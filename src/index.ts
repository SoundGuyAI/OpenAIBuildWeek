import {
  ACESFilmicToneMapping,
  AmbientLight,
  Color,
  DirectionalLight,
  PCFSoftShadowMap,
  SessionMode,
  SRGBColorSpace,
  VisibilityState,
  World,
} from "@iwsdk/core";

import { KAIJU_QA_ASSETS } from "./kaiju-qa/assets.js";
import {
  LEVEL_DEFINITIONS,
  LEVEL_IDS,
  PROP_DEFINITIONS,
  RULE_IDS,
  SCENARIO_DEFINITIONS,
  TRAINING_STAGES,
  createInitialState,
  selectCampaignCompletion,
  selectCurrentLevel,
  selectExpectedInteractionTarget,
  selectReleaseEligibility,
  selectReleaseLockReason,
  transition,
  type ExpectedInteractionTarget,
  type GameIntent,
  type GameState,
  type LevelId,
  type VisualCue,
} from "./kaiju-qa/game-model.js";
import {
  NarrationManager,
  type NarrationSnapshot,
} from "./kaiju-qa/narration.js";
import type { NarrationCueId } from "./kaiju-qa/narration-manifest.js";
import {
  createKaijuQaScene,
  type KaijuQaScene,
  type KaijuQaSceneDebugPoint,
  type KaijuQaSceneIntent,
  type KaijuQaSceneView,
  type SceneCue,
  type SceneInteractionTarget,
} from "./kaiju-qa/scene.js";
import {
  applyImmersiveVrUiState,
  checkImmersiveVrSupport,
  immersiveVrCheckingState,
  immersiveVrLaunchingState,
  launchImmersiveVr,
  type ImmersiveVrState,
  type ImmersiveVrSupportState,
} from "./xr-support.js";
import "./styles.css";

interface KaijuQaDebugApi {
  getState(): GameState;
  getDebugTargets(): Record<string, KaijuQaSceneDebugPoint>;
  getExpectedInteraction(): ExpectedInteractionTarget;
}

declare global {
  interface Window {
    __KAIJU_QA__?: KaijuQaDebugApi;
  }
}

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

const container = requiredElement<HTMLDivElement>("#scene-container");
const status = requiredElement<HTMLElement>("#status");
const announcement = requiredElement<HTMLElement>("#announcement");
const enterXrButton = requiredElement<HTMLButtonElement>("#enter-xr");
const motionButton = requiredElement<HTMLButtonElement>("#toggle-motion");
const resetButton = requiredElement<HTMLButtonElement>("#reset-lab");
const audioButton = requiredElement<HTMLButtonElement>("#toggle-audio");
const replayButton = requiredElement<HTMLButtonElement>("#replay-narration");
const levelLabel = requiredElement<HTMLElement>("#level-label");
const progressLabel = requiredElement<HTMLElement>("#progress-label");
const caption = requiredElement<HTMLElement>("#caption");
const loadingState = requiredElement<HTMLElement>("#loading-state");
const xrStatus = requiredElement<HTMLElement>("#xr-status");
const keyboardHint = requiredElement<HTMLElement>("#keyboard-hint");
const semanticInstruction = requiredElement<HTMLElement>("#semantic-instruction");
const semanticRules = requiredElement<HTMLUListElement>("#semantic-rules");
const semanticEvidence = requiredElement<HTMLUListElement>("#semantic-evidence");
const semanticRelease = requiredElement<HTMLElement>("#semantic-release");
const switchActions = requiredElement<HTMLElement>("#switch-actions");
const enterXrIcon = enterXrButton.querySelector("svg")?.cloneNode(true) ?? null;

const LEVEL_SUBTITLES: Readonly<Record<LevelId, string>> = {
  "training-yard": "Learn how evidence turns a fix into a safe release.",
  "school-crossing": "Protect walkers without blocking the emergency route.",
  "harbor-load": "Stabilize heavy cargo without slowing the whole harbor.",
  "storm-shift": "Handle active rain without regressing rescue access.",
};

const TRAINING_COPY = {
  "place-car": {
    title: "Stage the happy path",
    body: "Grab the service car and move it into the glowing street socket.",
  },
  "pull-baseline": {
    title: "Record the baseline",
    body: "Pull the cyan test lever. Evidence comes before every change.",
  },
  "place-tower": {
    title: "Add an edge case",
    body: "Grab the fragile tower and place it in the highlighted route.",
  },
  "pull-tower-test": {
    title: "Test before fixing",
    body: "Pull the lever again and observe which scenario actually fails.",
  },
  "install-broad-rule": {
    title: "Try the broad rule",
    body: "Move the highlighted broad-scope cartridge into the rule dock.",
  },
  "pull-regression-suite": {
    title: "Run every old test",
    body: "Pull the lever. A fix is unsafe if it breaks an earlier pass.",
  },
  "install-targeted-rule": {
    title: "Choose from the evidence",
    body: "Compare every cartridge scope with the failed and passing checks, then place your choice.",
  },
  "pull-verified-suite": {
    title: "Verify the whole suite",
    body: "Pull the lever one last time. Release needs fresh passing evidence.",
  },
  release: {
    title: "Gate the release",
    body: "Press the yellow release stamp only after all three checks pass.",
  },
  complete: {
    title: "Training complete",
    body: "Press the release stamp again to open the next district.",
  },
} as const;

let gameState = createInitialState();
let scene: KaijuQaScene | null = null;
let currentSceneCue: SceneCue = "idle";
let sceneCueId = 0;
let currentInstruction = "The tabletop laboratory is loading.";
let resetPresentationView: () => void = () => undefined;
let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let motionPausedByUser = false;
let introFollowUpPlayed = false;
let lastAnnouncement = "Preparing the tactile lab.";
let keyboardActionIndex = 0;
let keyboardActionSignature = "";

interface KeyboardWorldAction {
  readonly key: string;
  readonly label: string;
  readonly intent: GameIntent;
}

function setUtilityButtonLabel(
  button: HTMLButtonElement,
  visibleLabel: string,
  accessibleLabel: string,
): void {
  let label = button.querySelector("span");
  if (!label) {
    label = document.createElement("span");
    button.append(label);
  }
  label.textContent = visibleLabel;
  button.setAttribute("aria-label", accessibleLabel);
}

function restoreXrButtonContent(): void {
  const label = enterXrButton.textContent?.trim() || "VR";
  const labelNode = document.createElement("span");
  labelNode.textContent = label;
  enterXrButton.replaceChildren(
    ...(enterXrIcon ? [enterXrIcon.cloneNode(true), labelNode] : [labelNode]),
  );
  enterXrButton.setAttribute("aria-label", label);
}

function currentExpected(): ExpectedInteractionTarget {
  return selectExpectedInteractionTarget(gameState);
}

function announce(message: string): void {
  lastAnnouncement = message;
  status.textContent = message;
  announcement.textContent = message;
}

function updateAudioUi(snapshot: NarrationSnapshot): void {
  audioButton.disabled = !snapshot.supported;
  replayButton.disabled = !snapshot.supported || snapshot.lastCueId === null;
  audioButton.setAttribute("aria-pressed", String(snapshot.muted));
  setUtilityButtonLabel(
    audioButton,
    "Narration",
    snapshot.muted ? "Unmute narration" : "Mute narration",
  );
  document.body.dataset.narration = snapshot.status;
}

let narration!: NarrationManager;
narration = new NarrationManager({
  autoUnlock: true,
  onCaption(nextCaption) {
    caption.textContent = nextCaption?.text ?? currentInstruction;
    caption.hidden = false;
  },
  onStateChange(snapshot) {
    updateAudioUi(snapshot);
    if (
      snapshot.status === "ended" &&
      snapshot.currentCueId === "tutorial-intro" &&
      !introFollowUpPlayed &&
      currentExpected()?.type === "place-prop"
    ) {
      introFollowUpPlayed = true;
      queueMicrotask(() => void narration.play("place-car"));
    }
  },
  onError(error) {
    console.warn("Kaiju QA narration could not play", error);
    announce("Narration is unavailable, but every instruction remains captioned.");
  },
});

function trainingProgressLabel(): string {
  const stage = gameState.levels["training-yard"].tutorialStage;
  if (stage === "complete") return "Training complete";
  if (stage === "release") return "Training 9 / 9";
  if (!stage) return "Training";
  const index = TRAINING_STAGES.indexOf(stage);
  return `Training ${Math.max(0, index) + 1} / 9`;
}

function campaignProgressLabel(expected: ExpectedInteractionTarget): string {
  const { progress } = selectCurrentLevel(gameState);
  if (progress.released) return "District verified";
  switch (expected?.type) {
    case "place-prop":
      return "Stage 1 / 5";
    case "pull-lever":
      return progress.initialRunComplete ? "Stage 4 / 5" : "Stage 2 / 5";
    case "install-rule":
      return "Stage 3 / 5";
    case "press-release":
      return "Stage 5 / 5";
    case "advance-level":
      return "District complete";
    case undefined:
      return "Campaign complete";
  }
}

function instructionForState(): {
  readonly title: string;
  readonly body: string;
  readonly progress: string;
} {
  const current = selectCurrentLevel(gameState);
  const expected = currentExpected();

  if (current.id === "training-yard" && current.progress.tutorialStage) {
    const copy = TRAINING_COPY[current.progress.tutorialStage];
    return { ...copy, progress: trainingProgressLabel() };
  }

  if (selectCampaignCompletion(gameState)) {
    return {
      title: "Campaign verified",
      body: "Four districts, four targeted fixes, and no hidden regressions. Release earned.",
      progress: "Campaign complete",
    };
  }

  switch (expected?.type) {
    case "place-prop":
      return {
        title: `Stage ${PROP_DEFINITIONS[expected.prop].label}`,
        body: "Grab the highlighted fixture and snap it into the glowing district socket.",
        progress: campaignProgressLabel(expected),
      };
    case "pull-lever":
      return {
        title: current.progress.initialRunComplete
          ? "Rerun every scenario"
          : "Expose the edge case",
        body: current.progress.initialRunComplete
          ? "Pull the lever. Compare the new result with every earlier pass."
          : "Pull the cyan lever to record the first complete district run.",
        progress: campaignProgressLabel(expected),
      };
    case "install-rule": {
      const namedRule = expected.rule
        ? current.definition.rules[expected.rule]
        : null;
      return {
        title: namedRule ? `Install ${namedRule.label}` : "Choose a testable rule",
        body: namedRule
          ? "Move the highlighted cartridge into the rule dock, then rerun the suite."
          : "Choose a cartridge by its written scope and move it into the glowing rule dock.",
        progress: campaignProgressLabel(expected),
      };
    }
    case "press-release":
      return {
        title: "Release on evidence",
        body: "All three current scenarios pass. Press the yellow release stamp.",
        progress: campaignProgressLabel(expected),
      };
    case "advance-level":
      return {
        title: "Open the next district",
        body: "Press the yellow release stamp again to continue the campaign.",
        progress: campaignProgressLabel(expected),
      };
    case undefined:
      return {
        title: "Inspect the evidence",
        body: "Follow the highlighted object and world-space instruction.",
        progress: campaignProgressLabel(expected),
      };
  }
}

function currentKeyboardActions(): readonly KeyboardWorldAction[] {
  const expected = currentExpected();
  const current = selectCurrentLevel(gameState);
  switch (expected?.type) {
    case "place-prop":
      return [{
        key: `prop:${expected.prop}`,
        label: `Place ${PROP_DEFINITIONS[expected.prop].label}`,
        intent: { type: "place-prop", prop: expected.prop },
      }];
    case "pull-lever":
      return [{
        key: "lever",
        label: "Pull the test lever",
        intent: { type: "pull-lever" },
      }];
    case "install-rule": {
      const ruleIds = expected.rule ? [expected.rule] : RULE_IDS;
      return ruleIds.map((rule) => ({
        key: `rule:${rule}`,
        label: `${current.definition.rules[rule].label}. Scope: ${current.definition.rules[rule].scope}`,
        intent: { type: "install-rule", rule },
      }));
    }
    case "press-release":
      return [{
        key: "release",
        label: "Press the release stamp",
        intent: { type: "press-release" },
      }];
    case "advance-level":
      return [{
        key: "advance",
        label: "Press the stamp to open the next district",
        intent: { type: "advance-level" },
      }];
    case undefined:
      return [];
  }
}

function updateKeyboardTarget(actions = currentKeyboardActions()): void {
  const signature = `${gameState.currentLevelId}:${actions.map((action) => action.key).join("|")}`;
  if (signature !== keyboardActionSignature) {
    keyboardActionSignature = signature;
    keyboardActionIndex = 0;
  }
  if (actions.length === 0) {
    keyboardHint.textContent = "Campaign complete. Use Reset to play again.";
    container.removeAttribute("aria-label");
    container.setAttribute("aria-label", "Interactive 3D Kaiju QA toy lab. Campaign complete.");
    return;
  }
  keyboardActionIndex = Math.min(keyboardActionIndex, actions.length - 1);
  const active = actions[keyboardActionIndex];
  keyboardHint.textContent = `Keyboard target ${keyboardActionIndex + 1} of ${actions.length}: ${active.label}. Press Enter or Space.`;
  container.setAttribute(
    "aria-label",
    `Interactive 3D Kaiju QA toy lab. ${active.label}. Use arrow keys to choose and Enter or Space to act.`,
  );
}

function replaceTextList(
  list: HTMLUListElement,
  items: readonly string[],
): void {
  list.replaceChildren(
    ...items.map((text) => {
      const item = document.createElement("li");
      item.textContent = text;
      return item;
    }),
  );
}

function updateSemanticState(
  view: KaijuQaSceneView,
  instruction: ReturnType<typeof instructionForState>,
): void {
  semanticInstruction.textContent = `${instruction.progress}. ${instruction.title}. ${instruction.body}`;
  replaceTextList(
    semanticRules,
    view.ruleOptions.map((rule) =>
      `${rule.label}. Scope: ${rule.scope}.${view.selectedRule === rule.id ? " Currently installed." : ""}`
    ),
  );
  replaceTextList(
    semanticEvidence,
    view.evidence.map((item) => `${item.label}: ${item.status}.`),
  );
  semanticRelease.textContent = selectReleaseLockReason(gameState) ??
    "Release is unlocked because every current scenario passes under one fresh complete run.";
  const actions = currentKeyboardActions();
  const restoreSwitchFocus = switchActions.contains(document.activeElement);
  const previousActionKey = document.activeElement instanceof HTMLElement
    ? document.activeElement.dataset.actionKey
    : undefined;
  switchActions.replaceChildren(
    ...actions.map((action) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = action.label;
      button.dataset.actionKey = action.key;
      button.addEventListener("click", () => dispatch(action.intent));
      return button;
    }),
  );
  if (restoreSwitchFocus) {
    const preferred = previousActionKey
      ? switchActions.querySelector<HTMLButtonElement>(
        `button[data-action-key="${CSS.escape(previousActionKey)}"]`,
      )
      : null;
    (preferred ?? switchActions.querySelector<HTMLButtonElement>("button"))?.focus({
      preventScroll: true,
    });
  }
  updateKeyboardTarget();
}

function mapExpectedTarget(
  expected: ExpectedInteractionTarget,
): SceneInteractionTarget {
  switch (expected?.type) {
    case "place-prop":
      return { kind: "prop", id: expected.prop };
    case "install-rule":
      return { kind: "rule", ...(expected.rule ? { id: expected.rule } : {}) };
    case "pull-lever":
      return { kind: "lever" };
    case "press-release":
    case "advance-level":
      return { kind: "stamp" };
    case undefined:
      return null;
  }
}

function buildSceneView(): KaijuQaSceneView {
  const current = selectCurrentLevel(gameState);
  const instruction = instructionForState();
  const expected = currentExpected();
  return {
    level: current.id,
    levelIndex: current.index,
    levelCount: LEVEL_IDS.length,
    levelTitle: current.definition.label,
    levelSubtitle: LEVEL_SUBTITLES[current.id],
    placedProps: current.progress.placedProps,
    selectedRule: current.progress.rule,
    ruleOptions: RULE_IDS.map((id) => ({
      id,
      label: current.definition.rules[id].label,
      scope: current.definition.rules[id].scope,
    })),
    evidence: current.definition.scenarios.map((id) => ({
      id,
      label: SCENARIO_DEFINITIONS[id].label,
      status: current.progress.evidence[id]?.status ?? "untested",
    })),
    expected: mapExpectedTarget(expected),
    instructionTitle: instruction.title,
    instructionBody: instruction.body,
    progressLabel: instruction.progress,
    releaseReady: selectReleaseEligibility(gameState),
    levelReleased: current.progress.released,
    campaignComplete: selectCampaignCompletion(gameState),
    cue: currentSceneCue,
    cueId: sceneCueId,
  };
}

function updateBodyState(view: KaijuQaSceneView): void {
  document.body.dataset.level = view.level;
  document.body.dataset.levelIndex = String(view.levelIndex + 1);
  document.body.dataset.expected = view.expected?.kind ?? "complete";
  document.body.dataset.releaseReady = String(view.releaseReady);
  document.body.dataset.levelReleased = String(view.levelReleased);
  document.body.dataset.campaignComplete = String(view.campaignComplete);
}

function renderGame(): void {
  const view = buildSceneView();
  const instruction = instructionForState();
  currentInstruction = instruction.body;
  levelLabel.textContent = `District ${view.levelIndex + 1} / ${view.levelCount} · ${view.levelTitle}`;
  progressLabel.textContent = instruction.progress;
  progressLabel.dataset.ready = String(view.releaseReady);
  if (
    (narration.snapshot.status !== "playing" && narration.snapshot.status !== "loading") ||
    !narration.snapshot.supported ||
    narration.snapshot.muted
  ) {
    caption.textContent = instruction.body;
  }
  updateBodyState(view);
  updateSemanticState(view, instruction);
  scene?.present(view);
}

function sceneCueFor(visualCue: VisualCue): SceneCue {
  switch (visualCue) {
    case "blocked":
      return "blocked";
    case "prop-placed":
    case "broad-rule-installed":
    case "alternate-rule-installed":
    case "targeted-rule-installed":
      return "placed";
    case "baseline-pass":
      return "baseline";
    case "fixture-failure":
      return "failure";
    case "broad-regression":
    case "alternate-regression":
      return "regression";
    case "targeted-pass":
      return "verified";
    case "level-release":
      return "release";
    case "level-advance":
      return "level-change";
    case "level-reset":
    case "campaign-reset":
      return "idle";
  }
}

function narrationFor(visualCue: VisualCue): NarrationCueId | null {
  const current = selectCurrentLevel(gameState);
  switch (visualCue) {
    case "prop-placed":
      return current.id === "training-yard" &&
        current.progress.tutorialStage === "pull-baseline"
        ? "baseline"
        : null;
    case "baseline-pass":
      return "place-tower";
    case "fixture-failure":
      return current.id === "training-yard" ? "tower-fail" : null;
    case "broad-regression":
    case "alternate-regression":
      return "regression";
    case "targeted-pass":
      return "release";
    case "level-release":
      return current.id === "storm-shift" ? "finale" : null;
    case "level-advance":
      if (current.id === "school-crossing") return "school";
      if (current.id === "harbor-load") return "harbor";
      if (current.id === "storm-shift") return "storm";
      return null;
    case "blocked":
    case "broad-rule-installed":
    case "alternate-rule-installed":
    case "targeted-rule-installed":
    case "level-reset":
    case "campaign-reset":
      return null;
  }
}

function dispatch(intent: GameIntent): void {
  const result = transition(gameState, intent);
  if (
    narration.snapshot.status === "playing" ||
    narration.snapshot.status === "loading" ||
    narration.snapshot.status === "locked"
  ) {
    narration.stop();
  }
  gameState = result.state;
  currentSceneCue = sceneCueFor(result.visualCue);
  sceneCueId += 1;
  announce(result.announcement);
  renderGame();
  const narrationCue = result.accepted ? narrationFor(result.visualCue) : null;
  if (narrationCue) void narration.play(narrationCue);
}

function dispatchSceneIntent(intent: KaijuQaSceneIntent): void {
  switch (intent.type) {
    case "PLACE_PROP":
      dispatch({ type: "place-prop", prop: intent.prop });
      break;
    case "INSTALL_RULE":
      dispatch({ type: "install-rule", rule: intent.rule });
      break;
    case "PULL_LEVER":
      dispatch({ type: "pull-lever" });
      break;
    case "PRESS_RELEASE":
      dispatch(
        currentExpected()?.type === "advance-level"
          ? { type: "advance-level" }
          : { type: "press-release" },
      );
      break;
  }
}

function updateMotionUi(): void {
  motionButton.setAttribute("aria-pressed", String(reducedMotion));
  setUtilityButtonLabel(
    motionButton,
    "Motion",
    "Reduce motion",
  );
  document.body.dataset.motion = reducedMotion ? "reduced" : "full";
  scene?.setReducedMotion(reducedMotion);
}

motionButton.addEventListener("click", () => {
  reducedMotion = !reducedMotion;
  motionPausedByUser = reducedMotion;
  updateMotionUi();
});

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
reducedMotionQuery.addEventListener("change", (event) => {
  reducedMotion = event.matches || motionPausedByUser;
  updateMotionUi();
});

audioButton.addEventListener("click", () => {
  narration.toggleMuted();
});

replayButton.addEventListener("click", () => {
  void narration.replay();
});

resetButton.addEventListener("click", () => {
  const resetIntent: GameIntent = selectCampaignCompletion(gameState)
    ? { type: "reset-campaign" }
    : { type: "reset-level" };
  dispatch(resetIntent);
  resetPresentationView();
  if (gameState.currentLevelId === "training-yard") {
    introFollowUpPlayed = true;
    void narration.play("place-car");
  }
});

container.addEventListener("focus", () => {
  document.body.dataset.keyboardFocus = "true";
  keyboardHint.setAttribute("aria-hidden", "false");
  updateKeyboardTarget();
});

container.addEventListener("blur", () => {
  document.body.dataset.keyboardFocus = "false";
  keyboardHint.setAttribute("aria-hidden", "true");
});

container.addEventListener("keydown", (event) => {
  const actions = currentKeyboardActions();
  if (actions.length === 0) return;

  if (
    event.key === "ArrowLeft" ||
    event.key === "ArrowUp" ||
    event.key === "ArrowRight" ||
    event.key === "ArrowDown"
  ) {
    event.preventDefault();
    const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
    keyboardActionIndex = (keyboardActionIndex + direction + actions.length) % actions.length;
    updateKeyboardTarget(actions);
    announcement.textContent = keyboardHint.textContent;
    return;
  }

  if (event.key === "Enter" || event.key === " ") {
    event.preventDefault();
    const activeElement = document.activeElement;
    if (
      activeElement instanceof HTMLButtonElement ||
      activeElement instanceof HTMLAnchorElement ||
      activeElement instanceof HTMLInputElement
    ) {
      return;
    }
    const action = actions[keyboardActionIndex] ?? actions[0];
    dispatch(action.intent);
    container.focus({ preventScroll: true });
  }
});

updateMotionUi();
updateAudioUi(narration.snapshot);
renderGame();

World.create(container, {
  assets: KAIJU_QA_ASSETS,
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    offer: "always",
    features: { handTracking: true, layers: true },
  },
  render: {
    fov: 42,
    near: 0.04,
    far: 45,
    defaultLighting: false,
  },
  features: {
    locomotion: false,
    grabbing: { useHandPinchForGrab: true },
    physics: false,
    sceneUnderstanding: false,
    environmentRaycast: false,
  },
})
  .then(async (world) => {
    const { camera, renderer } = world;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFSoftShadowMap;
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.outputColorSpace = SRGBColorSpace;

    const applyPresentationCamera = () => {
      const aspect = Math.max(0.1, container.clientWidth / container.clientHeight);
      if (aspect < 0.82) {
        camera.position.set(0.12, 3.05, 8.05);
        camera.lookAt(0, 1.08, -1.45);
      } else if (aspect < 1.25) {
        camera.position.set(0.15, 2.65, 5.1);
        camera.lookAt(0, 1.18, -1.45);
      } else {
        camera.position.set(0.18, 2.42, 3.62);
        camera.lookAt(0, 1.25, -1.45);
      }
      camera.updateProjectionMatrix();
      camera.updateMatrixWorld(true);
    };
    applyPresentationCamera();
    world.scene.background = new Color(0x09131c);

    const ambient = new AmbientLight(0x8fc9d5, 1.35);
    ambient.name = "KaijuQaCoolFill";
    world.createTransformEntity(ambient);

    const keyLight = new DirectionalLight(0xffdfad, 3.4);
    keyLight.name = "KaijuQaWarmKey";
    keyLight.position.set(-3.3, 5.8, 3.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.left = -3.4;
    keyLight.shadow.camera.right = 3.4;
    keyLight.shadow.camera.top = 3.2;
    keyLight.shadow.camera.bottom = -1.2;
    keyLight.shadow.camera.near = 0.2;
    keyLight.shadow.camera.far = 14;
    keyLight.shadow.bias = -0.00045;
    world.createTransformEntity(keyLight);

    const rimLight = new DirectionalLight(0x5bd6ef, 1.45);
    rimLight.name = "KaijuQaRim";
    rimLight.position.set(3.5, 3.2, -4.5);
    world.createTransformEntity(rimLight);

    scene = createKaijuQaScene(world, {
      onIntent: dispatchSceneIntent,
      onInvalidDrop: announce,
      reducedMotion,
    });
    scene.present(buildSceneView());

    const resetView = () => {
      world.player.position.set(0, 0, 0);
      world.player.rotation.set(0, 0, 0);
      applyPresentationCamera();
      scene?.resetView();
    };
    resetPresentationView = resetView;
    window.addEventListener("resize", applyPresentationCamera);

    window.__KAIJU_QA__ = {
      getState: () => gameState,
      getDebugTargets: () => scene?.getDebugTargets() ?? {},
      getExpectedInteraction: currentExpected,
    };

    let immersiveVrSupport: ImmersiveVrSupportState | undefined;
    const applyXrState = (xrState: ImmersiveVrState) => {
      applyImmersiveVrUiState(xrState, {
        button: enterXrButton,
        status,
      });
      restoreXrButtonContent();
      xrStatus.textContent = xrState.message;
      status.textContent = lastAnnouncement;
      announcement.textContent = xrState.message;
    };

    const updateSuspended = () => {
      const xrVisibility = world.visibilityState.value;
      const suspended =
        document.visibilityState !== "visible" ||
        xrVisibility === VisibilityState.Hidden ||
        xrVisibility === VisibilityState.VisibleBlurred;
      scene?.setSuspended(suspended);
      if (suspended) narration.pause();
      else if (narration.snapshot.status === "paused") void narration.resume();
    };

    document.addEventListener("visibilitychange", updateSuspended);
    world.visibilityState.subscribe((visibilityState) => {
      updateSuspended();
      if (visibilityState === VisibilityState.NonImmersive) {
        if (immersiveVrSupport) applyXrState(immersiveVrSupport);
        return;
      }
      if (world.session) {
        applyXrState({
          state: "active",
          message: "Immersive VR is active. Point, hold, move, and release.",
          session: world.session,
        });
      }
    });

    enterXrButton.addEventListener("click", async () => {
      if (world.visibilityState.value === VisibilityState.NonImmersive) {
        applyXrState(immersiveVrLaunchingState());
        const result = await launchImmersiveVr(world, {
          support: immersiveVrSupport,
        });
        applyXrState(result);
      } else {
        await world.exitXR();
      }
    });

    window.addEventListener(
      "beforeunload",
      () => {
        window.removeEventListener("resize", applyPresentationCamera);
        narration.dispose();
        scene?.dispose();
        delete window.__KAIJU_QA__;
      },
      { once: true },
    );

    loadingState.hidden = true;
    loadingState.setAttribute("aria-busy", "false");
    document.body.dataset.iwsdkReady = "true";
    document.body.dataset.gameReady = "true";
    announce("Ready. Grab the highlighted object and follow the world-space arrow.");
    renderGame();
    void narration.play("tutorial-intro");

    applyXrState(immersiveVrCheckingState());
    immersiveVrSupport = await checkImmersiveVrSupport();
    if (world.visibilityState.value === VisibilityState.NonImmersive) {
      applyXrState(immersiveVrSupport);
    }
  })
  .catch((error: unknown) => {
    console.error("IWSDK failed to initialize", error);
    loadingState.hidden = true;
    announce("The tabletop lab could not start. Check the browser console.");
    enterXrButton.disabled = true;
    document.body.dataset.iwsdkReady = "error";
    document.body.dataset.gameReady = "error";
  });
