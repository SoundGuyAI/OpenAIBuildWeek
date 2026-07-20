import {
  AmbientLight,
  Color,
  DirectionalLight,
  SessionMode,
  VisibilityState,
  World,
} from "@iwsdk/core";

import {
  GUARDRAILS,
  METADATA,
  SCENARIOS,
  createInitialState,
  selectAttemptHistory,
  selectLatestAttempt,
  selectReleaseEligibility,
  selectReleaseLockReason,
  transition,
  type GameIntent,
  type GameState,
  type GuardrailId,
  type ScenarioId,
  type ScenarioStatus,
  type SceneCue as ModelSceneCue,
  type TutorialStep,
} from "./kaiju-qa/game-model.js";
import {
  createKaijuQaScene,
  type KaijuQaScene,
  type KaijuQaSceneIntent,
  type KaijuQaSceneView,
  type SceneCue,
  type SceneScenarioStatus,
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

function requiredElement<T extends HTMLElement>(selector: string): T {
  const element = document.querySelector<T>(selector);
  if (!element) throw new Error(`Missing required element: ${selector}`);
  return element;
}

const container = requiredElement<HTMLDivElement>("#scene-container");
const gameUi = requiredElement<HTMLDivElement>("#game-ui");
const status = requiredElement<HTMLParagraphElement>("#status");
const announcement = requiredElement<HTMLParagraphElement>("#announcement");
const enterXrButton = requiredElement<HTMLButtonElement>("#enter-xr");
const motionButton = requiredElement<HTMLButtonElement>("#toggle-motion");
const resetButton = requiredElement<HTMLButtonElement>("#reset-lab");
const primaryAction = requiredElement<HTMLButtonElement>("#primary-action");
const reviseButton = requiredElement<HTMLButtonElement>("#revise-guardrail");
const releaseButton = requiredElement<HTMLButtonElement>("#release-button");
const releaseReason = requiredElement<HTMLParagraphElement>("#release-reason");
const restartButton = requiredElement<HTMLButtonElement>("#restart-button");
const guidePanel = requiredElement<HTMLElement>("#guide-panel");
const guideBody = requiredElement<HTMLElement>("#guide-body");
const guideProgress = requiredElement<HTMLElement>("#guide-progress");
const guideCopy = requiredElement<HTMLParagraphElement>("#guide-copy");
const toggleGuideButton = requiredElement<HTMLButtonElement>("#toggle-guide");
const hintButton = requiredElement<HTMLButtonElement>("#hint-button");
const coverageStatus = requiredElement<HTMLOutputElement>("#coverage-status");
const guardrailFieldset =
  requiredElement<HTMLFieldSetElement>("#guardrail-fieldset");
const attemptHistory = requiredElement<HTMLOListElement>("#attempt-history");
const attemptEmpty = requiredElement<HTMLParagraphElement>("#attempt-empty");
const debriefPanel = requiredElement<HTMLElement>("#debrief-panel");
const loopSteps = [
  ...document.querySelectorAll<HTMLElement>("#loop-rail [data-step]"),
];
const scenarioButtons = [
  ...document.querySelectorAll<HTMLButtonElement>(
    "#scenario-list [data-scenario]",
  ),
];
const guardrailInputs = [
  ...document.querySelectorAll<HTMLInputElement>(
    '#guardrail-fieldset input[name="guardrail"]',
  ),
];
const attemptSlots = [
  ...document.querySelectorAll<HTMLElement>(
    "#attempt-history [data-attempt-slot]",
  ),
];

const GUIDE: Record<
  TutorialStep,
  { progress: string; copy: string; hint: readonly string[] }
> = {
  baseline: {
    progress: "1 / 5",
    copy: "First, record what already works. Run the current behavior.",
    hint: [
      "Record the current behavior before changing it.",
      "Activate Run baseline below.",
    ],
  },
  "stage-tower": {
    progress: "2 / 5",
    copy:
      "Two cases pass, but one risk is untested. Add the fragile tower.",
    hint: [
      "Add a risky situation before choosing a fix.",
      "Activate Add tower test; it snaps into the striped socket.",
    ],
  },
  "tower-fail": {
    progress: "3 / 5",
    copy: "Test before changing behavior. Run the tower case.",
    hint: [
      "The new case needs evidence before a rule changes.",
      "Activate Run tower test below.",
    ],
  },
  "select-freeze": {
    progress: "4 / 5",
    copy:
      "Let's test a safe-sounding broad rule. We will test it, not trust it.",
    hint: [
      "This guided experiment checks a rule that affects every building.",
      "Select Freeze near buildings.",
    ],
  },
  "run-regression": {
    progress: "5 / 5",
    copy: "A fix must preserve old behavior. Run every test.",
    hint: [
      "Old passes may change when the rule changes.",
      "Activate Run all 3 tests below.",
    ],
  },
  independent: {
    progress: "YOUR CALL",
    copy:
      "Training complete. Choose the smallest rule that keeps every test passing.",
    hint: [
      "Compare the latest run with the baseline. Which old pass became a regression?",
      "Compare what changed with the scope written on each guardrail.",
      "Choose the rule that changes behavior only where the tower hazard exists.",
      "Try a guardrail scoped to the marked hazard zone.",
    ],
  },
};

const SCENARIO_COPY: Record<
  ScenarioId,
  Partial<Record<ScenarioStatus, string>>
> = {
  car: {
    untested: "Run this scenario before release.",
    ready: "Ready for a current test.",
    pass: "Car delivered. Driver rescued.",
    fail: "Car arrived late. Response target missed.",
    regression: "Old pass broke. The rescue arrived late.",
    stale: "Guardrail changed. Rerun required.",
  },
  ambulance: {
    untested: "Run this scenario before release.",
    ready: "Ready for a current test.",
    pass: "Ambulance crossed. Lane clear.",
    fail: "Ambulance blocked. The lane is not clear.",
    regression: "Old pass broke. The kaiju blocked the crossing.",
    stale: "Guardrail changed. Rerun required.",
  },
  tower: {
    untested: "Add and run this scenario before release.",
    ready: "Tower staged. Run the tower test.",
    pass: "Tower protected. No contact observed.",
    fail: "Full-speed route contacted the tower in the striped zone.",
    regression: "An earlier tower pass broke.",
    stale: "Guardrail changed. Rerun required.",
  },
};

const TUTORIAL_INDEX: Record<TutorialStep, number> = {
  baseline: 0,
  "stage-tower": 1,
  "tower-fail": 2,
  "select-freeze": 3,
  "run-regression": 4,
  independent: 5,
};

let state: GameState = createInitialState();
let scene: KaijuQaScene | undefined;
let visualCue: SceneCue = "idle";
let lastAnnouncement =
  "Loading the tabletop lab. The first action will be Run baseline.";
let hintLevel = 0;
let reducedMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;
let motionPausedByUser = false;
let wasReleased = false;
let resetPresentationView: (() => void) | undefined;

function uppercaseStatus(statusValue: ScenarioStatus): SceneScenarioStatus {
  return statusValue.toUpperCase() as SceneScenarioStatus;
}

function tutorialTarget(currentState: GameState): KaijuQaSceneView["tutorialTarget"] {
  switch (currentState.tutorial) {
    case "baseline":
    case "tower-fail":
    case "run-regression":
      return "run";
    case "stage-tower":
      return "tower";
    case "select-freeze":
      return "guardrail";
    case "independent":
      return selectReleaseEligibility(currentState)
        ? "release"
        : currentState.guardrail
          ? "run"
          : "guardrail";
  }
}

function sceneView(currentState: GameState): KaijuQaSceneView {
  return {
    cue: currentState.released ? "release" : visualCue,
    guardrail: currentState.guardrail ?? "none",
    towerStaged: currentState.towerStaged,
    scenarios: {
      car: uppercaseStatus(currentState.evidence.car.status),
      emergency: uppercaseStatus(currentState.evidence.ambulance.status),
      tower: uppercaseStatus(currentState.evidence.tower.status),
    },
    tutorialTarget: tutorialTarget(currentState),
    released: currentState.released,
  };
}

function mapVisualCue(cue: ModelSceneCue): SceneCue | null {
  switch (cue) {
    case "baseline":
    case "tower-failure":
    case "ambulance-regression":
    case "car-regression":
    case "targeted-pass":
    case "release":
      return cue;
    case "reset":
      return "idle";
    default:
      return null;
  }
}

function actionForTutorial(currentState: GameState): {
  label: string;
  intent: GameIntent | null;
} {
  switch (currentState.tutorial) {
    case "baseline":
      return { label: "Run baseline", intent: { type: "run-baseline" } };
    case "stage-tower":
      return { label: "Add tower test", intent: { type: "stage-tower" } };
    case "tower-fail":
      return { label: "Run tower test", intent: { type: "run-tower" } };
    case "select-freeze":
      return {
        label: "Try broad guardrail",
        intent: {
          type: "select-guardrail",
          guardrail: "freeze-near-buildings",
        },
      };
    case "run-regression":
      return { label: "Run all 3 tests", intent: { type: "run-suite" } };
    case "independent":
      return currentState.guardrail
        ? { label: "Run all 3 tests", intent: { type: "run-suite" } }
        : { label: "Choose a guardrail", intent: null };
  }
}

function renderLoopRail(currentState: GameState): void {
  const currentIndex = TUTORIAL_INDEX[currentState.tutorial];
  loopSteps.forEach((step, index) => {
    const value =
      currentIndex >= loopSteps.length
        ? "complete"
        : index < currentIndex
          ? "complete"
          : index === currentIndex
            ? "current"
            : "future";
    step.dataset.state = value;
    if (value === "current") step.setAttribute("aria-current", "step");
    else step.removeAttribute("aria-current");
  });
}

function renderGuide(currentState: GameState): void {
  const guide = GUIDE[currentState.tutorial];
  guideProgress.textContent = guide.progress;
  guideProgress.setAttribute(
    "aria-label",
    currentState.tutorial === "independent"
      ? "Training complete. Your decision."
      : `Guide step ${guide.progress.replace(" / ", " of ")}`,
  );
  const hint =
    hintLevel > 0
      ? guide.hint[Math.min(hintLevel, guide.hint.length) - 1]
      : undefined;
  guideCopy.textContent = hint ? `${guide.copy} Hint: ${hint}` : guide.copy;
  guideBody.hidden = !currentState.guideVisible;
  guidePanel.dataset.state = currentState.guideVisible ? "active" : "collapsed";
  toggleGuideButton.textContent = currentState.guideVisible
    ? "Hide guide"
    : "Show guide";
  toggleGuideButton.setAttribute(
    "aria-expanded",
    String(currentState.guideVisible),
  );
}

function renderScenarios(currentState: GameState): void {
  let currentCount = 0;
  scenarioButtons.forEach((button) => {
    const scenario = button.dataset.scenario as ScenarioId;
    const evidence = currentState.evidence[scenario];
    button.dataset.status = evidence.status;
    button.setAttribute(
      "aria-pressed",
      String(currentState.inspected === scenario),
    );
    requiredElement<HTMLElement>(`#${scenario}-status`).textContent =
      evidence.status.toUpperCase();
    requiredElement<HTMLOutputElement>(`#${scenario}-output`).textContent =
      SCENARIO_COPY[scenario][evidence.status] ?? evidence.status;
    if (["pass", "fail", "regression"].includes(evidence.status)) {
      currentCount += 1;
    }
  });
  coverageStatus.textContent = `${currentCount} / 3 current`;
}

function renderGuardrails(currentState: GameState): void {
  const canSelect =
    !currentState.released &&
    (currentState.tutorial === "select-freeze" ||
      currentState.tutorial === "independent");
  guardrailFieldset.disabled = !canSelect;
  guardrailFieldset.dataset.state = canSelect ? "ready" : "locked";

  guardrailInputs.forEach((input) => {
    const guardrail = input.value as GuardrailId;
    input.checked = currentState.guardrail === guardrail;
    input.disabled =
      !canSelect ||
      (currentState.tutorial === "select-freeze" &&
        guardrail !== "freeze-near-buildings");
  });
}

function renderAttempts(currentState: GameState): void {
  const visibleAttempts = selectAttemptHistory(currentState);

  attemptSlots.forEach((slot, index) => {
    const attempt = visibleAttempts[index];
    slot.hidden = !attempt;
    if (!attempt) return;
    const label = slot.querySelector<HTMLElement>("[data-attempt-label]");
    const summary = slot.querySelector<HTMLElement>("[data-attempt-summary]");
    if (label) {
      label.textContent =
        attempt.kind === "baseline"
          ? "Baseline"
          : attempt.guardrail
            ? METADATA.guardrails[attempt.guardrail].label
            : `Attempt ${attempt.id}`;
    }
    const passCount = SCENARIOS.filter(
      (scenario) => attempt.scenarios[scenario] === "pass",
    ).length;
    const regressionCount = SCENARIOS.filter(
      (scenario) => attempt.scenarios[scenario] === "regression",
    ).length;
    if (summary) {
      summary.textContent = regressionCount
        ? `${passCount} pass / ${regressionCount} regression`
        : `${passCount} pass`;
    }
    SCENARIOS.forEach((scenario) => {
      const row = slot.querySelector<HTMLElement>(
        `[data-scenario="${scenario}"]`,
      );
      const value = slot.querySelector<HTMLElement>(
        `[data-attempt-status="${scenario}"]`,
      );
      if (row) row.dataset.status = attempt.scenarios[scenario];
      if (value) value.textContent = attempt.scenarios[scenario].toUpperCase();
    });
  });

  attemptHistory.dataset.empty = String(visibleAttempts.length === 0);
  attemptEmpty.hidden = visibleAttempts.length > 0;
}

function renderActions(currentState: GameState): void {
  const primary = actionForTutorial(currentState);
  primaryAction.textContent = primary.label;
  primaryAction.disabled = primary.intent === null || currentState.released;
  primaryAction.dataset.action = primary.intent?.type ?? "choose-guardrail";
  primaryAction.dataset.highlighted = String(
    currentState.tutorial !== "independent",
  );
  primaryAction.classList.toggle(
    "is-tutorial-target",
    currentState.tutorial !== "independent",
  );

  const latest = selectLatestAttempt(currentState);
  const eligible = selectReleaseEligibility(currentState);
  reviseButton.hidden =
    currentState.tutorial !== "independent" ||
    !latest?.complete ||
    eligible ||
    currentState.released;
  releaseButton.disabled = !eligible;
  releaseButton.textContent = eligible ? "Release" : "Release locked";
  releaseReason.textContent = eligible
    ? "Ready: 3/3 current tests pass."
    : selectReleaseLockReason(currentState);
}

function renderDebrief(currentState: GameState): void {
  debriefPanel.hidden = !currentState.released;
  if (currentState.released && !wasReleased) {
    debriefPanel.focus();
  }
  wasReleased = currentState.released;
}

function renderGame(): void {
  gameUi.dataset.phase =
    state.released
      ? "released"
      : state.tutorial === "independent"
        ? "independent"
        : "tutorial";
  gameUi.dataset.releaseState = selectReleaseEligibility(state)
    ? "ready"
    : "locked";
  gameUi.dataset.motion = reducedMotion ? "reduced" : "full";
  document.body.dataset.tutorialStep = state.tutorial;

  renderLoopRail(state);
  renderGuide(state);
  renderScenarios(state);
  renderGuardrails(state);
  renderAttempts(state);
  renderActions(state);
  renderDebrief(state);
  status.textContent = lastAnnouncement;
  announcement.textContent = lastAnnouncement;
  scene?.present(sceneView(state));
}

function dispatch(intent: GameIntent): void {
  const result = transition(state, intent);
  state = result.state;
  lastAnnouncement = result.announcement;
  const nextCue = mapVisualCue(result.cue);
  if (nextCue) visualCue = nextCue;
  if (
    result.accepted &&
    intent.type !== "toggle-guide" &&
    intent.type !== "inspect" &&
    intent.type !== "compare"
  ) {
    hintLevel = 0;
  }
  renderGame();
  queueMicrotask(() => {
    switch (result.cue) {
      case "baseline":
      case "stage":
      case "stale":
        primaryAction.focus();
        break;
      case "tower-failure":
        guardrailInputs.find((input) => !input.disabled)?.focus();
        break;
      case "ambulance-regression":
        requiredElement<HTMLButtonElement>("#scenario-ambulance").focus();
        break;
      case "car-regression":
        requiredElement<HTMLButtonElement>("#scenario-car").focus();
        break;
      case "targeted-pass":
        releaseButton.focus();
        break;
      case "reset":
        primaryAction.focus();
        break;
      default:
        break;
    }
  });
}

function dispatchPrimary(): void {
  const primary = actionForTutorial(state);
  if (primary.intent) dispatch(primary.intent);
  else {
    lastAnnouncement = "Choose one guardrail before running the suite.";
    announcement.textContent = lastAnnouncement;
    status.textContent = lastAnnouncement;
    guardrailInputs.find((input) => !input.disabled)?.focus();
  }
}

function resetGame(): void {
  hintLevel = 0;
  visualCue = "idle";
  dispatch({ type: "reset" });
  resetPresentationView?.();
}

primaryAction.addEventListener("click", dispatchPrimary);
reviseButton.addEventListener("click", () => {
  dispatch({ type: "revise" });
  guardrailInputs.find((input) => !input.disabled)?.focus();
});
releaseButton.addEventListener("click", () => dispatch({ type: "release" }));
resetButton.addEventListener("click", resetGame);
restartButton.addEventListener("click", resetGame);
toggleGuideButton.addEventListener("click", () =>
  dispatch({ type: "toggle-guide" }),
);
hintButton.addEventListener("click", () => {
  const hints = GUIDE[state.tutorial].hint;
  hintLevel = Math.min(hintLevel + 1, hints.length);
  lastAnnouncement = hints[hintLevel - 1] ?? hints[hints.length - 1];
  renderGame();
});

scenarioButtons.forEach((button) => {
  button.addEventListener("click", () => {
    dispatch({
      type: "inspect",
      scenario: button.dataset.scenario as ScenarioId,
    });
  });
});

guardrailInputs.forEach((input) => {
  input.addEventListener("change", () => {
    if (!input.checked) return;
    dispatch({
      type: "select-guardrail",
      guardrail: input.value as GuardrailId,
    });
  });
});

function sceneIntent(intent: KaijuQaSceneIntent): void {
  switch (intent.type) {
    case "STAGE_TOWER":
      dispatch({ type: "stage-tower" });
      break;
    case "SELECT_GUARDRAIL":
      dispatch({
        type: "select-guardrail",
        guardrail: intent.guardrail,
      });
      break;
    case "RUN_FULL_SUITE":
      dispatchPrimary();
      break;
    case "RELEASE":
      dispatch({ type: "release" });
      break;
    case "RESET":
      resetGame();
      break;
  }
}

const reducedMotionQuery = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
);

function updateMotionUi(): void {
  motionButton.setAttribute("aria-pressed", String(reducedMotion));
  motionButton.textContent = reducedMotion ? "Use full motion" : "Reduce motion";
  motionButton.setAttribute(
    "aria-label",
    reducedMotion ? "Use full motion" : "Reduce motion",
  );
  scene?.setReducedMotion(reducedMotion);
  gameUi.dataset.motion = reducedMotion ? "reduced" : "full";
}

motionButton.addEventListener("click", () => {
  reducedMotion = !reducedMotion;
  motionPausedByUser = reducedMotion;
  updateMotionUi();
  renderGame();
});

reducedMotionQuery.addEventListener("change", (event) => {
  reducedMotion = event.matches || motionPausedByUser;
  updateMotionUi();
  renderGame();
});

primaryAction.disabled = true;
updateMotionUi();
renderGame();

World.create(container, {
  xr: {
    sessionMode: SessionMode.ImmersiveVR,
    offer: "always",
    features: { handTracking: true, layers: true },
  },
  render: {
    fov: 38,
    near: 0.05,
    far: 40,
    defaultLighting: false,
  },
  features: {
    locomotion: false,
    grabbing: false,
    physics: false,
    sceneUnderstanding: false,
    environmentRaycast: false,
  },
})
  .then(async (world) => {
    const { camera } = world;
    camera.position.set(0.25, 2.2, 3.25);
    camera.lookAt(0, 0.82, -1.3);
    world.scene.background = new Color(0x0b1620);

    const ambient = new AmbientLight(0x9ecbc8, 1.55);
    ambient.name = "KaijuQaAmbient";
    world.createTransformEntity(ambient);

    const keyLight = new DirectionalLight(0xffe1a6, 2.6);
    keyLight.name = "KaijuQaKey";
    keyLight.position.set(-2.5, 5, 3.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    world.createTransformEntity(keyLight);

    scene = createKaijuQaScene(world, {
      onIntent: sceneIntent,
      reducedMotion,
    });
    scene.present(sceneView(state));

    const resetView = () => {
      world.player.position.set(0, 0, 0);
      world.player.rotation.set(0, 0, 0);
      camera.position.set(0.25, 2.2, 3.25);
      camera.lookAt(0, 0.82, -1.3);
      scene?.resetView();
    };
    resetPresentationView = resetView;

    let immersiveVrSupport: ImmersiveVrSupportState | undefined;
    const applyXrState = (xrState: ImmersiveVrState) => {
      applyImmersiveVrUiState(xrState, {
        button: enterXrButton,
        status,
      });
    };

    const updateSuspended = () => {
      const xrVisibility = world.visibilityState.value;
      const xrSuspended =
        xrVisibility === VisibilityState.Hidden ||
        xrVisibility === VisibilityState.VisibleBlurred;
      scene?.setSuspended(
        xrSuspended || document.visibilityState !== "visible",
      );
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
          message: "Immersive VR is active.",
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
        void world.exitXR();
      }
    });

    window.addEventListener(
      "beforeunload",
      () => {
        scene?.dispose();
      },
      { once: true },
    );

    primaryAction.disabled = false;
    lastAnnouncement =
      "Ready. First, record what already works. Run the baseline.";
    document.body.dataset.iwsdkReady = "true";
    document.body.dataset.gameReady = "true";
    renderGame();

    applyXrState(immersiveVrCheckingState());
    immersiveVrSupport = await checkImmersiveVrSupport();
    if (world.visibilityState.value === VisibilityState.NonImmersive) {
      applyXrState(immersiveVrSupport);
    }
  })
  .catch((error: unknown) => {
    console.error("IWSDK failed to initialize", error);
    status.textContent =
      "The tabletop lab could not start. Check the browser console.";
    announcement.textContent = status.textContent;
    primaryAction.disabled = true;
    document.body.dataset.iwsdkReady = "error";
    document.body.dataset.gameReady = "error";
  });
