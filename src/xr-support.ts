import {
  SessionMode,
  buildSessionInit,
  normalizeReferenceSpec,
  resolveReferenceSpaceType,
  type World,
  type XROptions,
} from "@iwsdk/core";

export { xrSessionUsesPassthrough } from "./xr-capabilities.js";

type XRSystemLike = Pick<XRSystem, "isSessionSupported" | "requestSession">;

export type ImmersiveVrUnsupportedReason =
  | "api-unavailable"
  | "session-unsupported"
  | "support-check-failed";

export type ImmersiveVrLaunchFailureReason =
  | "permission-denied"
  | "security-error"
  | "session-request-failed"
  | "session-setup-failed";

export type ImmersiveVrState =
  | { state: "checking"; message: string }
  | { state: "supported"; message: string }
  | { state: "launching"; message: string }
  | {
      state: "unsupported";
      reason: ImmersiveVrUnsupportedReason;
      message: string;
      error?: unknown;
    }
  | { state: "active"; message: string; session: XRSession }
  | {
      state: "launch-failed";
      reason: ImmersiveVrLaunchFailureReason;
      message: string;
      error: unknown;
    };

export type ImmersiveVrSupportState = Extract<
  ImmersiveVrState,
  { state: "supported" | "unsupported" }
>;

export type ImmersiveVrLaunchState = Extract<
  ImmersiveVrState,
  { state: "active" | "unsupported" | "launch-failed" }
>;

export interface ImmersiveVrUiElements {
  button: HTMLButtonElement;
  status: HTMLElement;
  root?: HTMLElement;
}

export interface LaunchImmersiveVrOptions {
  xr?: XRSystemLike | null;
  support?: ImmersiveVrSupportState;
  xrOptions?: Partial<XROptions>;
}

export function immersiveVrCheckingState(): ImmersiveVrState {
  return {
    state: "checking",
    message: "Ready - checking whether an immersive AR session is available...",
  };
}

export function immersiveVrLaunchingState(): ImmersiveVrState {
  return {
    state: "launching",
    message: "Starting mixed reality...",
  };
}

function currentXrSystem(explicit?: XRSystemLike | null): XRSystemLike | null {
  if (explicit !== undefined) return explicit;
  if (typeof navigator === "undefined") return null;
  return navigator.xr ?? null;
}

function unsupported(
  reason: ImmersiveVrUnsupportedReason,
  error?: unknown,
): Extract<ImmersiveVrState, { state: "unsupported" }> {
  const message =
    reason === "support-check-failed"
      ? "Ready - mixed reality availability could not be checked. You can keep playing with desktop or touch controls."
      : "Ready - immersive AR is not available in this browser or device. You can keep playing with desktop or touch controls.";

  return {
    state: "unsupported",
    reason,
    message,
    ...(error !== undefined ? { error } : {}),
  };
}

export async function checkImmersiveVrSupport(
  xr: XRSystemLike | null = currentXrSystem(),
): Promise<ImmersiveVrSupportState> {
  if (!xr) return unsupported("api-unavailable");

  try {
    const isSupported = await xr.isSessionSupported(SessionMode.ImmersiveAR);
    return isSupported
      ? {
          state: "supported",
          message: "Ready - immersive AR is available. Passthrough is verified after entry, then you can place the workbench.",
        }
      : unsupported("session-unsupported");
  } catch (error) {
    return unsupported("support-check-failed", error);
  }
}

function launchFailure(
  error: unknown,
  duringSetup: boolean,
): Extract<ImmersiveVrState, { state: "launch-failed" }> {
  const name = error instanceof DOMException ? error.name : "";

  if (name === "NotAllowedError" || name === "AbortError") {
    return {
      state: "launch-failed",
      reason: "permission-denied",
      message:
        "Mixed reality launch was blocked or cancelled. Check the browser and headset permissions, then try again.",
      error,
    };
  }

  if (name === "SecurityError") {
    return {
      state: "launch-failed",
      reason: "security-error",
      message:
        "Mixed reality could not start because this page is not in a secure WebXR context. Use HTTPS or localhost, then try again.",
      error,
    };
  }

  return {
    state: "launch-failed",
    reason: duringSetup ? "session-setup-failed" : "session-request-failed",
    message: duringSetup
      ? "The headset connected, but the mixed reality scene could not finish starting. Exit XR on the headset and try again."
      : "Mixed reality could not start. Check that the headset is connected and available, then try again.",
    error,
  };
}

function attachCameraRestore(world: World, session: XRSession): void {
  const { camera } = world;
  const snapshot = {
    position: camera.position.clone(),
    quaternion: camera.quaternion.clone(),
    scale: camera.scale.clone(),
    aspect: camera.aspect,
    fov: camera.fov,
    near: camera.near,
    far: camera.far,
    zoom: camera.zoom,
  };

  const onEnd = () => {
    session.removeEventListener("end", onEnd);
    requestAnimationFrame(() => {
      camera.position.copy(snapshot.position);
      camera.quaternion.copy(snapshot.quaternion);
      camera.scale.copy(snapshot.scale);
      camera.aspect = snapshot.aspect;
      camera.fov = snapshot.fov;
      camera.near = snapshot.near;
      camera.far = snapshot.far;
      camera.zoom = snapshot.zoom;
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
    });
  };

  session.addEventListener("end", onEnd);
}

/**
 * Launch immersive AR through IWSDK 0.4.2 while preserving the rejected
 * requestSession promise so the caller can show a useful failure state.
 *
 * IWSDK 0.4.2's World.launchXR() returns void, so it cannot be awaited by UI
 * code. This helper follows the same public setup path with IWSDK's exported
 * session-option and reference-space helpers.
 */
export async function launchImmersiveVr(
  world: World,
  options: LaunchImmersiveVrOptions = {},
): Promise<ImmersiveVrLaunchState> {
  if (world.session) {
    return {
      state: "active",
      message: "Mixed reality is active.",
      session: world.session,
    };
  }

  const xr = currentXrSystem(options.xr);
  const support = options.support ?? (await checkImmersiveVrSupport(xr));
  if (support.state === "unsupported") return support;
  if (!xr) return unsupported("api-unavailable");

  const base = world.xrDefaults ?? {};
  const overrides = options.xrOptions ?? {};
  const features = { ...(base.features ?? {}), ...(overrides.features ?? {}) };
  const mergedOptions: XROptions = {
    ...base,
    ...overrides,
    sessionMode: SessionMode.ImmersiveAR,
    ...(Object.keys(features).length ? { features } : {}),
  };

  let session: XRSession;
  try {
    session = await xr.requestSession(
      SessionMode.ImmersiveAR,
      buildSessionInit(mergedOptions),
    );
  } catch (error) {
    return launchFailure(error, false);
  }

  const onSessionEnd = () => {
    session.removeEventListener("end", onSessionEnd);
    if (world.session === session) world.session = undefined;
  };
  session.addEventListener("end", onSessionEnd);

  try {
    const referenceSpace = normalizeReferenceSpec(mergedOptions.referenceSpace);
    const resolvedReferenceSpace = await resolveReferenceSpaceType(
      session,
      referenceSpace.type,
      referenceSpace.required ? [] : referenceSpace.fallbackOrder,
    );

    world.renderer.xr.enabled = true;
    world.renderer.xr.getDepthSensingMesh = () => null;
    world.renderer.xr.setReferenceSpaceType(resolvedReferenceSpace);
    if (mergedOptions.restoreCameraOnExit !== false) {
      attachCameraRestore(world, session);
    }

    await world.renderer.xr.setSession(session);
    world.session = session;

    return {
      state: "active",
      message: "Mixed reality is active.",
      session,
    };
  } catch (error) {
    session.removeEventListener("end", onSessionEnd);
    try {
      await session.end();
    } catch {
      // Preserve the original setup failure; session cleanup is best effort.
    }
    return launchFailure(error, true);
  }
}

export function applyImmersiveVrUiState(
  state: ImmersiveVrState,
  { button, status, root = document.body }: ImmersiveVrUiElements,
): void {
  button.dataset.xrState = state.state;
  status.dataset.xrState = state.state;
  root.dataset.xrState = state.state;
  status.textContent = state.message;

  switch (state.state) {
    case "checking":
      button.textContent = "Checking MR...";
      button.disabled = true;
      break;
    case "supported":
      button.textContent = "Enter MR";
      button.disabled = false;
      break;
    case "launching":
      button.textContent = "Entering MR...";
      button.disabled = true;
      break;
    case "active":
      button.textContent = "Exit MR";
      button.disabled = false;
      break;
    case "unsupported":
      button.textContent = "MR unavailable";
      button.disabled = true;
      break;
    case "launch-failed":
      button.textContent = "Retry MR";
      button.disabled = false;
      break;
  }
}
