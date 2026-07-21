import {
  getNarrationCue,
  type NarrationCue,
  type NarrationCueId,
} from "./narration-manifest.js";

export type NarrationPlaybackStatus =
  | "idle"
  | "loading"
  | "locked"
  | "playing"
  | "paused"
  | "ended"
  | "stopped"
  | "error"
  | "unsupported";

export type NarrationPlayResult =
  | "playing"
  | "queued"
  | "superseded"
  | "unsupported"
  | "failed";

export interface NarrationCaption {
  readonly cueId: NarrationCueId;
  readonly text: string;
  readonly durationSeconds: number;
}

export interface NarrationSnapshot {
  readonly supported: boolean;
  readonly status: NarrationPlaybackStatus;
  readonly currentCueId: NarrationCueId | null;
  readonly lastCueId: NarrationCueId | null;
  readonly pendingCueId: NarrationCueId | null;
  readonly muted: boolean;
  readonly unlocked: boolean;
}

export interface NarrationManagerOptions {
  /** Supply an element for tests or host-managed audio. Null forces no-audio mode. */
  readonly audio?: HTMLAudioElement | null;
  /** Defaults to document when available. Null disables automatic gesture hooks. */
  readonly autoplayTarget?: EventTarget | null;
  readonly autoUnlock?: boolean;
  /** Base URL used to resolve manifest paths. Defaults to document.baseURI. */
  readonly baseUrl?: string | URL;
  readonly muted?: boolean;
  readonly onCaption?: (caption: NarrationCaption | null) => void;
  readonly onStateChange?: (snapshot: NarrationSnapshot) => void;
  readonly onError?: (error: Error, cueId: NarrationCueId | null) => void;
}

const AUTOPLAY_EVENTS = ["pointerdown", "touchend", "keydown"] as const;
const SILENT_WAV_DATA_URI =
  "data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YQIAAAAAAA==";

function createBrowserAudio(): HTMLAudioElement | null {
  if (typeof Audio !== "function") return null;
  const audio = new Audio();
  audio.preload = "auto";
  audio.setAttribute("playsinline", "");
  return audio;
}

function defaultAutoplayTarget(): EventTarget | null {
  return typeof document === "undefined" ? null : document;
}

function asError(value: unknown, fallback: string): Error {
  if (value instanceof Error) return value;
  return new Error(typeof value === "string" ? value : fallback);
}

function isAutoplayBlock(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const value = error as { readonly name?: unknown; readonly message?: unknown };
  if (value.name === "NotAllowedError") return true;
  return (
    typeof value.message === "string" &&
    /autoplay|user (activation|gesture|interaction)|not allowed/i.test(
      value.message,
    )
  );
}

function joinRelativeUrl(baseUrl: string, relativePath: string): string {
  return `${baseUrl.replace(/\/?$/, "/")}${relativePath.replace(/^\//, "")}`;
}

function resolveCueUrl(cue: NarrationCue, baseUrl?: string | URL): string {
  const effectiveBase =
    baseUrl ?? (typeof document === "undefined" ? undefined : document.baseURI);
  if (!effectiveBase) return cue.src;

  try {
    return new URL(cue.src, effectiveBase).href;
  } catch {
    return joinRelativeUrl(String(effectiveBase), cue.src);
  }
}

/**
 * A single-channel narration player. New cues replace old cues, so authored
 * voice lines never overlap. It is safe to construct during SSR: unsupported
 * environments retain the same API and resolve play requests as unsupported.
 */
export class NarrationManager {
  private readonly audio: HTMLAudioElement | null;
  private readonly baseUrl?: string | URL;
  private readonly onCaption?: NarrationManagerOptions["onCaption"];
  private readonly onStateChange?: NarrationManagerOptions["onStateChange"];
  private readonly onError?: NarrationManagerOptions["onError"];

  private autoplayTarget: EventTarget | null;
  private unlockListenersInstalled = false;
  private unlockInFlight: Promise<boolean> | null = null;
  private requestToken = 0;
  private disposed = false;
  private muted: boolean;
  private unlocked = false;
  private status: NarrationPlaybackStatus;
  private currentCueId: NarrationCueId | null = null;
  private lastCueId: NarrationCueId | null = null;
  private pendingCueId: NarrationCueId | null = null;

  private readonly handleEnded = (): void => {
    if (this.disposed || !this.currentCueId) return;
    this.pendingCueId = null;
    this.status = "ended";
    this.emitCaption(null);
    this.emitState();
  };

  private readonly handleMediaError = (): void => {
    if (this.disposed || !this.currentCueId) return;
    this.pendingCueId = null;
    this.status = "error";
    this.emitCaption(null);
    const code = this.audio?.error?.code;
    this.reportError(
      new Error(
        code
          ? `Narration media failed with HTMLMediaElement error code ${code}.`
          : "Narration media failed to load or decode.",
      ),
      this.currentCueId,
    );
    this.emitState();
  };

  private readonly handleUnlockGesture = (): void => {
    void this.unlock();
  };

  constructor(options: NarrationManagerOptions = {}) {
    this.audio =
      options.audio === undefined ? createBrowserAudio() : options.audio;
    this.baseUrl = options.baseUrl;
    this.onCaption = options.onCaption;
    this.onStateChange = options.onStateChange;
    this.onError = options.onError;
    this.autoplayTarget =
      options.autoplayTarget === undefined
        ? defaultAutoplayTarget()
        : options.autoplayTarget;
    this.muted = options.muted ?? false;
    this.status = this.audio ? "idle" : "unsupported";

    if (this.audio) {
      this.audio.preload = "auto";
      this.audio.muted = this.muted;
      this.audio.addEventListener("ended", this.handleEnded);
      this.audio.addEventListener("error", this.handleMediaError);
      if (options.autoUnlock !== false) this.installAutoplayUnlock();
    }

    this.emitState();
  }

  get supported(): boolean {
    return this.audio !== null && !this.disposed;
  }

  get snapshot(): NarrationSnapshot {
    return {
      supported: this.supported,
      status: this.status,
      currentCueId: this.currentCueId,
      lastCueId: this.lastCueId,
      pendingCueId: this.pendingCueId,
      muted: this.muted,
      unlocked: this.unlocked,
    };
  }

  installAutoplayUnlock(target: EventTarget | null = this.autoplayTarget): boolean {
    if (
      !this.supported ||
      !target ||
      this.unlockListenersInstalled ||
      this.unlocked
    ) {
      return false;
    }

    this.autoplayTarget = target;
    for (const eventName of AUTOPLAY_EVENTS) {
      target.addEventListener(eventName, this.handleUnlockGesture, {
        capture: true,
        passive: true,
      });
    }
    this.unlockListenersInstalled = true;
    return true;
  }

  private removeAutoplayUnlock(): void {
    if (!this.autoplayTarget || !this.unlockListenersInstalled) return;
    for (const eventName of AUTOPLAY_EVENTS) {
      this.autoplayTarget.removeEventListener(
        eventName,
        this.handleUnlockGesture,
        true,
      );
    }
    this.unlockListenersInstalled = false;
  }

  async unlock(): Promise<boolean> {
    if (!this.supported || !this.audio) return false;
    if (this.unlocked) return true;
    if (this.unlockInFlight) return this.unlockInFlight;

    this.unlockInFlight = this.performUnlock();
    try {
      return await this.unlockInFlight;
    } finally {
      this.unlockInFlight = null;
    }
  }

  private async performUnlock(): Promise<boolean> {
    if (!this.audio) return false;

    if (this.pendingCueId) {
      const cueId = this.pendingCueId;
      const result = await this.attemptPlayback(
        cueId,
        this.requestToken,
        true,
      );
      return result === "playing";
    }

    if (this.currentCueId && !this.audio.paused) {
      this.markUnlocked();
      return true;
    }

    if (
      this.currentCueId &&
      (this.status === "paused" || this.status === "ended")
    ) {
      // Preserve an explicit pause/end. The gesture grants the browser sticky
      // user activation; resume/replay remains an intentional caller action.
      this.markUnlocked();
      return true;
    }

    const previousMuted = this.audio.muted;
    try {
      this.audio.muted = false;
      this.audio.src = SILENT_WAV_DATA_URI;
      this.audio.load();
      await this.audio.play();
      this.audio.pause();
      this.safeSetCurrentTime(0);
      this.markUnlocked();
      return true;
    } catch (error) {
      this.reportError(
        asError(error, "Narration autoplay unlock failed."),
        this.currentCueId,
      );
      return false;
    } finally {
      this.audio.muted = previousMuted;
    }
  }

  async play(cueId: NarrationCueId): Promise<NarrationPlayResult> {
    if (!this.supported || !this.audio) return "unsupported";

    const cue = getNarrationCue(cueId);
    const token = ++this.requestToken;
    this.audio.pause();
    this.currentCueId = cueId;
    this.lastCueId = cueId;
    this.pendingCueId = null;
    this.status = "loading";
    this.emitCaption(null);
    this.audio.muted = this.muted;
    this.audio.src = resolveCueUrl(cue, this.baseUrl);
    this.audio.load();
    this.safeSetCurrentTime(0);
    this.emitState();

    return this.attemptPlayback(cueId, token, true);
  }

  async replay(): Promise<NarrationPlayResult> {
    return this.lastCueId ? this.play(this.lastCueId) : "failed";
  }

  pause(): boolean {
    if (!this.supported || !this.audio || !this.currentCueId) return false;
    ++this.requestToken;
    this.pendingCueId = null;
    this.audio.pause();
    this.status = "paused";
    this.emitState();
    return true;
  }

  async resume(): Promise<NarrationPlayResult> {
    if (!this.supported || !this.audio || !this.currentCueId) return "failed";
    if (this.status === "ended") return this.play(this.currentCueId);

    const token = ++this.requestToken;
    this.pendingCueId = null;
    this.status = "loading";
    this.emitState();
    return this.attemptPlayback(this.currentCueId, token, true);
  }

  stop(): boolean {
    if (!this.supported || !this.audio) return false;
    ++this.requestToken;
    this.pendingCueId = null;
    this.currentCueId = null;
    this.audio.pause();
    this.safeSetCurrentTime(0);
    this.status = "stopped";
    this.emitCaption(null);
    this.emitState();
    return true;
  }

  setMuted(muted: boolean): void {
    this.muted = muted;
    if (this.audio) this.audio.muted = muted;
    this.emitState();
  }

  toggleMuted(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  dispose(): void {
    if (this.disposed) return;
    this.removeAutoplayUnlock();
    ++this.requestToken;
    this.pendingCueId = null;
    this.currentCueId = null;
    this.emitCaption(null);

    if (this.audio) {
      this.audio.pause();
      this.audio.removeEventListener("ended", this.handleEnded);
      this.audio.removeEventListener("error", this.handleMediaError);
      this.audio.removeAttribute("src");
      this.audio.load();
    }

    this.disposed = true;
    this.status = "unsupported";
    this.emitState();
  }

  private async attemptPlayback(
    cueId: NarrationCueId,
    token: number,
    queueWhenBlocked: boolean,
  ): Promise<NarrationPlayResult> {
    if (!this.audio) return "unsupported";

    try {
      await this.audio.play();
      if (token !== this.requestToken || cueId !== this.currentCueId) {
        return "superseded";
      }

      this.pendingCueId = null;
      this.status = "playing";
      if (!this.muted) this.markUnlocked();
      const cue = getNarrationCue(cueId);
      this.emitCaption({
        cueId,
        text: cue.text,
        durationSeconds: cue.durationSeconds,
      });
      this.emitState();
      return "playing";
    } catch (error) {
      if (token !== this.requestToken || cueId !== this.currentCueId) {
        return "superseded";
      }

      if (queueWhenBlocked && isAutoplayBlock(error)) {
        // A previous gesture may have produced sticky activation in one browser
        // but not another. Treat the actual NotAllowedError as authoritative and
        // reinstall the first-gesture hook.
        this.unlocked = false;
        this.pendingCueId = cueId;
        this.status = "locked";
        this.installAutoplayUnlock();
        this.emitState();
        return "queued";
      }

      this.pendingCueId = null;
      this.status = "error";
      this.emitCaption(null);
      this.reportError(
        asError(error, `Narration cue ${cueId} could not play.`),
        cueId,
      );
      this.emitState();
      return "failed";
    }
  }

  private markUnlocked(): void {
    this.unlocked = true;
    this.removeAutoplayUnlock();
  }

  private safeSetCurrentTime(value: number): void {
    if (!this.audio) return;
    try {
      this.audio.currentTime = value;
    } catch {
      // Some browsers reject seeking before metadata is available. Loading at
      // the beginning still produces the intended behavior.
    }
  }

  private emitCaption(caption: NarrationCaption | null): void {
    if (!this.onCaption) return;
    try {
      this.onCaption(caption);
    } catch (error) {
      this.reportError(
        asError(error, "Narration caption callback failed."),
        caption?.cueId ?? this.currentCueId,
      );
    }
  }

  private emitState(): void {
    if (!this.onStateChange) return;
    try {
      this.onStateChange(this.snapshot);
    } catch (error) {
      this.reportError(
        asError(error, "Narration state callback failed."),
        this.currentCueId,
      );
    }
  }

  private reportError(error: Error, cueId: NarrationCueId | null): void {
    if (!this.onError) return;
    try {
      this.onError(error, cueId);
    } catch {
      // Host callbacks must not destabilize the shared narration channel.
    }
  }
}

export function createNarrationManager(
  options: NarrationManagerOptions = {},
): NarrationManager {
  return new NarrationManager(options);
}

export type { NarrationCueId } from "./narration-manifest.js";
