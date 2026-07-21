/** Pure, deterministic, renderer-independent Kaiju QA campaign model. */

export const LEVEL_IDS = [
  "training-yard",
  "school-crossing",
  "harbor-load",
  "storm-shift",
] as const;
export type LevelId = (typeof LEVEL_IDS)[number];

export const RULE_IDS = ["broad", "alternate", "targeted"] as const;
export type RuleId = (typeof RULE_IDS)[number];

export const PROP_IDS = [
  "car",
  "tower",
  "crosswalk",
  "heavy-cargo",
  "rain-module",
] as const;
export type PropId = (typeof PROP_IDS)[number];

export const SCENARIO_IDS = [
  "car-delivery",
  "emergency-lane",
  "fragile-tower",
  "bus-window",
  "fire-lane",
  "student-crossing",
  "tug-lane",
  "crane-window",
  "heavy-cargo-route",
  "shelter-route",
  "grid-repair",
  "rain-shift",
] as const;
export type ScenarioId = (typeof SCENARIO_IDS)[number];

export const SCENARIO_STATUSES = [
  "untested",
  "ready",
  "pass",
  "fail",
  "regression",
  "stale",
] as const;
export type ScenarioStatus = (typeof SCENARIO_STATUSES)[number];
type RunStatus = Extract<ScenarioStatus, "pass" | "fail" | "regression">;

export const TRAINING_STAGES = [
  "place-car",
  "pull-baseline",
  "place-tower",
  "pull-tower-test",
  "install-broad-rule",
  "pull-regression-suite",
  "install-targeted-rule",
  "pull-verified-suite",
] as const;
export type TrainingStage = (typeof TRAINING_STAGES)[number];
export type TrainingProgress = TrainingStage | "release" | "complete";

export interface ScenarioDefinition {
  readonly id: ScenarioId;
  readonly levelId: LevelId;
  readonly label: string;
  readonly criterion: string;
  readonly role: "old-pass" | "hazard";
}

export interface PropDefinition {
  readonly id: PropId;
  readonly levelId: LevelId;
  readonly label: string;
  readonly readies: readonly ScenarioId[];
}

export interface RuleDefinition {
  readonly id: RuleId;
  readonly label: string;
  readonly scope: string;
}

export interface LevelRuleDefinition {
  readonly label: string;
  readonly scope: string;
}

export interface LevelDefinition {
  readonly id: LevelId;
  readonly label: string;
  readonly ordinal: number;
  readonly tutorial: boolean;
  readonly props: readonly PropId[];
  readonly fixtureProp: PropId;
  readonly scenarios: readonly [ScenarioId, ScenarioId, ScenarioId];
  readonly oldPassScenarios: readonly [ScenarioId, ScenarioId];
  readonly hazardScenario: ScenarioId;
  readonly rules: Readonly<Record<RuleId, LevelRuleDefinition>>;
}

export const RULE_DEFINITIONS = {
  broad: {
    id: "broad",
    label: "Broad rule",
    scope: "Changes behavior across the whole level.",
  },
  alternate: {
    id: "alternate",
    label: "Alternate rule",
    scope: "Changes a different cross-level behavior class.",
  },
  targeted: {
    id: "targeted",
    label: "Targeted rule",
    scope: "Changes behavior only at the staged hazard fixture.",
  },
} as const satisfies Readonly<Record<RuleId, RuleDefinition>>;

export const SCENARIO_DEFINITIONS = {
  "car-delivery": {
    id: "car-delivery",
    levelId: "training-yard",
    label: "Service Car Delivery",
    criterion: "Move the service car to its bay before the response timer expires.",
    role: "old-pass",
  },
  "emergency-lane": {
    id: "emergency-lane",
    levelId: "training-yard",
    label: "Emergency Lane",
    criterion: "Keep the emergency lane clear during the training route.",
    role: "old-pass",
  },
  "fragile-tower": {
    id: "fragile-tower",
    levelId: "training-yard",
    label: "Fragile Tower",
    criterion: "Pass the striped tower zone without contact.",
    role: "hazard",
  },
  "bus-window": {
    id: "bus-window",
    levelId: "school-crossing",
    label: "Bus Arrival Window",
    criterion: "Clear the bus bay before the scheduled arrival.",
    role: "old-pass",
  },
  "fire-lane": {
    id: "fire-lane",
    levelId: "school-crossing",
    label: "School Fire Lane",
    criterion: "Leave the fire lane open throughout the route.",
    role: "old-pass",
  },
  "student-crossing": {
    id: "student-crossing",
    levelId: "school-crossing",
    label: "Student Crossing",
    criterion: "Yield inside the marked crosswalk while students cross.",
    role: "hazard",
  },
  "tug-lane": {
    id: "tug-lane",
    levelId: "harbor-load",
    label: "Tug Lane",
    criterion: "Keep the tug lane clear for the harbor escort.",
    role: "old-pass",
  },
  "crane-window": {
    id: "crane-window",
    levelId: "harbor-load",
    label: "Crane Lift Window",
    criterion: "Reach the crane before its lift window closes.",
    role: "old-pass",
  },
  "heavy-cargo-route": {
    id: "heavy-cargo-route",
    levelId: "harbor-load",
    label: "Heavy Cargo Route",
    criterion: "Stabilize the heavy cargo through the marked berth.",
    role: "hazard",
  },
  "shelter-route": {
    id: "shelter-route",
    levelId: "storm-shift",
    label: "Shelter Supply Route",
    criterion: "Deliver shelter supplies before the storm window closes.",
    role: "old-pass",
  },
  "grid-repair": {
    id: "grid-repair",
    levelId: "storm-shift",
    label: "Grid Repair Access",
    criterion: "Keep the repair crew access lane open.",
    role: "old-pass",
  },
  "rain-shift": {
    id: "rain-shift",
    levelId: "storm-shift",
    label: "Rain Shift",
    criterion: "Use the wet-zone grip behavior only while rain is active.",
    role: "hazard",
  },
} as const satisfies Readonly<Record<ScenarioId, ScenarioDefinition>>;

export const PROP_DEFINITIONS = {
  car: {
    id: "car",
    levelId: "training-yard",
    label: "Service Car",
    readies: ["car-delivery", "emergency-lane"],
  },
  tower: {
    id: "tower",
    levelId: "training-yard",
    label: "Fragile Tower",
    readies: ["fragile-tower"],
  },
  crosswalk: {
    id: "crosswalk",
    levelId: "school-crossing",
    label: "School Crosswalk",
    readies: ["bus-window", "fire-lane", "student-crossing"],
  },
  "heavy-cargo": {
    id: "heavy-cargo",
    levelId: "harbor-load",
    label: "Heavy Cargo",
    readies: ["tug-lane", "crane-window", "heavy-cargo-route"],
  },
  "rain-module": {
    id: "rain-module",
    levelId: "storm-shift",
    label: "Rain Module",
    readies: ["shelter-route", "grid-repair", "rain-shift"],
  },
} as const satisfies Readonly<Record<PropId, PropDefinition>>;

export const LEVEL_DEFINITIONS = {
  "training-yard": {
    id: "training-yard",
    label: "Training Yard",
    ordinal: 1,
    tutorial: true,
    props: ["car", "tower"],
    fixtureProp: "tower",
    scenarios: ["car-delivery", "emergency-lane", "fragile-tower"],
    oldPassScenarios: ["car-delivery", "emergency-lane"],
    hazardScenario: "fragile-tower",
    rules: {
      broad: {
        label: "Freeze Near Every Structure",
        scope: "Every structure buffer in the training yard",
      },
      alternate: {
        label: "Slow Every Carry",
        scope: "Every carried object in the training yard",
      },
      targeted: {
        label: "Slow in Tower Stripes",
        scope: "Only the striped fragile-tower zone",
      },
    },
  },
  "school-crossing": {
    id: "school-crossing",
    label: "School Crossing",
    ordinal: 2,
    tutorial: false,
    props: ["crosswalk"],
    fixtureProp: "crosswalk",
    scenarios: ["bus-window", "fire-lane", "student-crossing"],
    oldPassScenarios: ["bus-window", "fire-lane"],
    hazardScenario: "student-crossing",
    rules: {
      broad: {
        label: "Stop Near Every School Fixture",
        scope: "Every school fixture and approach lane",
      },
      alternate: {
        label: "Yield to Every Vehicle",
        scope: "Every moving vehicle near the school",
      },
      targeted: {
        label: "Yield at the Crosswalk",
        scope: "Only the marked student crosswalk",
      },
    },
  },
  "harbor-load": {
    id: "harbor-load",
    label: "Harbor Load",
    ordinal: 3,
    tutorial: false,
    props: ["heavy-cargo"],
    fixtureProp: "heavy-cargo",
    scenarios: ["tug-lane", "crane-window", "heavy-cargo-route"],
    oldPassScenarios: ["tug-lane", "crane-window"],
    hazardScenario: "heavy-cargo-route",
    rules: {
      broad: {
        label: "Slow Across the Harbor",
        scope: "Every harbor route and service lane",
      },
      alternate: {
        label: "Pause Every Lift",
        scope: "Every crane lift window",
      },
      targeted: {
        label: "Brace Heavy Cargo",
        scope: "Only the marked heavy-cargo berth",
      },
    },
  },
  "storm-shift": {
    id: "storm-shift",
    label: "Storm Shift",
    ordinal: 4,
    tutorial: false,
    props: ["rain-module"],
    fixtureProp: "rain-module",
    scenarios: ["shelter-route", "grid-repair", "rain-shift"],
    oldPassScenarios: ["shelter-route", "grid-repair"],
    hazardScenario: "rain-shift",
    rules: {
      broad: {
        label: "Shelter at Every Cloud",
        scope: "Every weather signal in the storm district",
      },
      alternate: {
        label: "Slow All Repairs",
        scope: "Every grid-repair movement",
      },
      targeted: {
        label: "Grip in Active Rain",
        scope: "Only the active rain-module zone",
      },
    },
  },
} as const satisfies Readonly<Record<LevelId, LevelDefinition>>;

export type LevelRunOutcome = Readonly<
  Partial<Record<ScenarioId, RunStatus>>
>;

function makeInitialFailure(
  oldPassA: ScenarioId,
  oldPassB: ScenarioId,
  hazard: ScenarioId,
): LevelRunOutcome {
  return {
    [oldPassA]: "pass",
    [oldPassB]: "pass",
    [hazard]: "fail",
  };
}

function makeRuleOutcomes(
  oldPassA: ScenarioId,
  oldPassB: ScenarioId,
  hazard: ScenarioId,
): Readonly<Record<RuleId, LevelRunOutcome>> {
  return {
    broad: {
      [oldPassA]: "regression",
      [oldPassB]: "pass",
      [hazard]: "pass",
    },
    alternate: {
      [oldPassA]: "pass",
      [oldPassB]: "regression",
      [hazard]: "pass",
    },
    targeted: {
      [oldPassA]: "pass",
      [oldPassB]: "pass",
      [hazard]: "pass",
    },
  };
}

export const INITIAL_FAILURE_OUTCOMES = {
  "training-yard": makeInitialFailure(
    "car-delivery",
    "emergency-lane",
    "fragile-tower",
  ),
  "school-crossing": makeInitialFailure(
    "bus-window",
    "fire-lane",
    "student-crossing",
  ),
  "harbor-load": makeInitialFailure(
    "tug-lane",
    "crane-window",
    "heavy-cargo-route",
  ),
  "storm-shift": makeInitialFailure(
    "shelter-route",
    "grid-repair",
    "rain-shift",
  ),
} as const satisfies Readonly<Record<LevelId, LevelRunOutcome>>;

export const LEVEL_RULE_OUTCOMES = {
  "training-yard": makeRuleOutcomes(
    "car-delivery",
    "emergency-lane",
    "fragile-tower",
  ),
  "school-crossing": makeRuleOutcomes(
    "bus-window",
    "fire-lane",
    "student-crossing",
  ),
  "harbor-load": makeRuleOutcomes(
    "tug-lane",
    "crane-window",
    "heavy-cargo-route",
  ),
  "storm-shift": makeRuleOutcomes(
    "shelter-route",
    "grid-repair",
    "rain-shift",
  ),
} as const satisfies Readonly<
  Record<LevelId, Readonly<Record<RuleId, LevelRunOutcome>>>
>;

export interface ScenarioEvidence {
  readonly status: ScenarioStatus;
  readonly attemptId: number | null;
  readonly revision: number | null;
  readonly rule: RuleId | null;
}

export type LevelEvidence = Readonly<
  Partial<Record<ScenarioId, ScenarioEvidence>>
>;

export interface Attempt {
  readonly id: number;
  readonly levelId: LevelId;
  readonly kind: "baseline" | "fixture-test" | "rule-suite";
  readonly rule: RuleId | null;
  readonly revision: number;
  readonly scenarios: Readonly<Partial<Record<ScenarioId, ScenarioStatus>>>;
  readonly complete: boolean;
}

export interface LevelProgress {
  readonly placedProps: readonly PropId[];
  readonly rule: RuleId | null;
  readonly revision: number;
  readonly evidence: LevelEvidence;
  readonly attempts: readonly Attempt[];
  readonly nextAttemptId: number;
  readonly initialRunComplete: boolean;
  readonly released: boolean;
  readonly tutorialStage: TrainingProgress | null;
}

export interface CampaignState {
  readonly currentLevelId: LevelId;
  readonly levels: Readonly<Record<LevelId, LevelProgress>>;
}

export type GameState = CampaignState;

export type GameIntent =
  | { readonly type: "place-prop"; readonly prop: PropId }
  | { readonly type: "install-rule"; readonly rule: RuleId }
  | { readonly type: "pull-lever" }
  | { readonly type: "press-release" }
  | { readonly type: "advance-level" }
  | { readonly type: "reset-level" }
  | { readonly type: "reset-campaign" };

export type ExpectedInteractionTarget =
  | { readonly type: "place-prop"; readonly prop: PropId }
  | { readonly type: "install-rule"; readonly rule?: RuleId }
  | { readonly type: "pull-lever" }
  | { readonly type: "press-release" }
  | { readonly type: "advance-level" }
  | null;

export type VisualCue =
  | "blocked"
  | "prop-placed"
  | "baseline-pass"
  | "fixture-failure"
  | "broad-rule-installed"
  | "alternate-rule-installed"
  | "targeted-rule-installed"
  | "broad-regression"
  | "alternate-regression"
  | "targeted-pass"
  | "level-release"
  | "level-advance"
  | "level-reset"
  | "campaign-reset";

export type NarrationCue =
  | "wrong-action"
  | "release-locked"
  | "prop-placed"
  | "baseline-recorded"
  | "fixture-failed"
  | "evidence-stale"
  | "broad-regression"
  | "alternate-regression"
  | "targeted-verified"
  | "level-released"
  | "level-advanced"
  | "level-reset"
  | "campaign-reset";

export interface TransitionResult {
  readonly state: GameState;
  readonly accepted: boolean;
  readonly announcement: string;
  readonly visualCue: VisualCue;
  readonly narrationCue: NarrationCue;
}

export interface CurrentLevel {
  readonly id: LevelId;
  readonly index: number;
  readonly definition: LevelDefinition;
  readonly progress: LevelProgress;
}

function blankEvidence(levelId: LevelId): LevelEvidence {
  const evidence: Partial<Record<ScenarioId, ScenarioEvidence>> = {};
  for (const scenario of LEVEL_DEFINITIONS[levelId].scenarios) {
    evidence[scenario] = {
      status: "untested",
      attemptId: null,
      revision: null,
      rule: null,
    };
  }
  return evidence;
}

function createLevelProgress(levelId: LevelId): LevelProgress {
  return {
    placedProps: [],
    rule: null,
    revision: 0,
    evidence: blankEvidence(levelId),
    attempts: [],
    nextAttemptId: 1,
    initialRunComplete: false,
    released: false,
    tutorialStage: levelId === "training-yard" ? "place-car" : null,
  };
}

export function createInitialState(): GameState {
  return {
    currentLevelId: "training-yard",
    levels: {
      "training-yard": createLevelProgress("training-yard"),
      "school-crossing": createLevelProgress("school-crossing"),
      "harbor-load": createLevelProgress("harbor-load"),
      "storm-shift": createLevelProgress("storm-shift"),
    },
  };
}

function reject(
  state: GameState,
  announcement: string,
  narrationCue: NarrationCue = "wrong-action",
): TransitionResult {
  return {
    state,
    accepted: false,
    announcement,
    visualCue: "blocked",
    narrationCue,
  };
}

function accept(
  state: GameState,
  announcement: string,
  visualCue: VisualCue,
  narrationCue: NarrationCue,
): TransitionResult {
  return { state, accepted: true, announcement, visualCue, narrationCue };
}

function replaceLevel(
  state: GameState,
  levelId: LevelId,
  progress: LevelProgress,
): GameState {
  return {
    ...state,
    levels: {
      ...state.levels,
      [levelId]: progress,
    },
  };
}

function currentProgress(state: GameState): LevelProgress {
  return state.levels[state.currentLevelId];
}

function snapshotStatuses(
  levelId: LevelId,
  evidence: LevelEvidence,
): Readonly<Partial<Record<ScenarioId, ScenarioStatus>>> {
  const statuses: Partial<Record<ScenarioId, ScenarioStatus>> = {};
  for (const scenario of LEVEL_DEFINITIONS[levelId].scenarios) {
    statuses[scenario] = evidence[scenario]?.status ?? "untested";
  }
  return statuses;
}

function appendAttempt(
  progress: LevelProgress,
  levelId: LevelId,
  values: {
    readonly kind: Attempt["kind"];
    readonly rule: RuleId | null;
    readonly evidence: LevelEvidence;
    readonly complete: boolean;
  },
): LevelProgress {
  const attempt: Attempt = {
    id: progress.nextAttemptId,
    levelId,
    kind: values.kind,
    rule: values.rule,
    revision: progress.revision,
    scenarios: snapshotStatuses(levelId, values.evidence),
    complete: values.complete,
  };

  return {
    ...progress,
    evidence: values.evidence,
    attempts: [...progress.attempts, attempt],
    nextAttemptId: progress.nextAttemptId + 1,
  };
}

function evidenceFromOutcome(
  progress: LevelProgress,
  levelId: LevelId,
  outcome: LevelRunOutcome,
  rule: RuleId | null,
): LevelEvidence {
  const evidence: Partial<Record<ScenarioId, ScenarioEvidence>> = {
    ...progress.evidence,
  };
  for (const scenario of LEVEL_DEFINITIONS[levelId].scenarios) {
    const status = outcome[scenario];
    if (!status) continue;
    evidence[scenario] = {
      status,
      attemptId: progress.nextAttemptId,
      revision: progress.revision,
      rule,
    };
  }
  return evidence;
}

function markEvidenceStale(
  levelId: LevelId,
  evidence: LevelEvidence,
): LevelEvidence {
  const next: Partial<Record<ScenarioId, ScenarioEvidence>> = {
    ...evidence,
  };
  for (const scenario of LEVEL_DEFINITIONS[levelId].scenarios) {
    const item = evidence[scenario];
    if (item?.attemptId !== null && item?.attemptId !== undefined) {
      next[scenario] = { ...item, status: "stale" };
    }
  }
  return next;
}

function placeProp(state: GameState, prop: PropId): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);
  const expected = selectExpectedInteractionTarget(state);

  if (
    expected?.type !== "place-prop" ||
    expected.prop !== prop ||
    PROP_DEFINITIONS[prop].levelId !== levelId
  ) {
    const expectedLabel =
      expected?.type === "place-prop"
        ? PROP_DEFINITIONS[expected.prop].label
        : "the highlighted campaign action";
    return reject(state, `Place ${expectedLabel} next.`);
  }

  const evidence: Partial<Record<ScenarioId, ScenarioEvidence>> = {
    ...progress.evidence,
  };
  for (const scenario of PROP_DEFINITIONS[prop].readies) {
    const item = evidence[scenario];
    if (item?.status === "untested") {
      evidence[scenario] = { ...item, status: "ready" };
    }
  }

  let tutorialStage = progress.tutorialStage;
  if (tutorialStage === "place-car") tutorialStage = "pull-baseline";
  if (tutorialStage === "place-tower") tutorialStage = "pull-tower-test";

  const nextProgress: LevelProgress = {
    ...progress,
    placedProps: [...progress.placedProps, prop],
    evidence,
    tutorialStage,
  };
  return accept(
    replaceLevel(state, levelId, nextProgress),
    `${PROP_DEFINITIONS[prop].label} placed in ${level.label}.`,
    "prop-placed",
    "prop-placed",
  );
}

function runTrainingBaseline(state: GameState): TransitionResult {
  const levelId: LevelId = "training-yard";
  const progress = currentProgress(state);
  const [oldPassA, oldPassB] = LEVEL_DEFINITIONS[levelId].oldPassScenarios;
  const evidence = evidenceFromOutcome(
    progress,
    levelId,
    { [oldPassA]: "pass", [oldPassB]: "pass" },
    null,
  );
  const attempted = appendAttempt(progress, levelId, {
    kind: "baseline",
    rule: null,
    evidence,
    complete: false,
  });
  const nextProgress: LevelProgress = {
    ...attempted,
    tutorialStage: "place-tower",
  };
  return accept(
    replaceLevel(state, levelId, nextProgress),
    "Baseline recorded: both existing scenarios pass; the tower hazard is still untested.",
    "baseline-pass",
    "baseline-recorded",
  );
}

function runInitialFailure(state: GameState): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);
  const evidence = evidenceFromOutcome(
    progress,
    levelId,
    INITIAL_FAILURE_OUTCOMES[levelId],
    null,
  );
  const attempted = appendAttempt(progress, levelId, {
    kind: "fixture-test",
    rule: null,
    evidence,
    complete: true,
  });
  const nextProgress: LevelProgress = {
    ...attempted,
    initialRunComplete: true,
    tutorialStage:
      levelId === "training-yard" ? "install-broad-rule" : null,
  };
  return accept(
    replaceLevel(state, levelId, nextProgress),
    `${SCENARIO_DEFINITIONS[level.hazardScenario].label} failed while both established scenarios still pass.`,
    "fixture-failure",
    "fixture-failed",
  );
}

function runRuleSuite(state: GameState, rule: RuleId): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);
  const outcome = LEVEL_RULE_OUTCOMES[levelId][rule];
  const evidence = evidenceFromOutcome(
    progress,
    levelId,
    outcome,
    rule,
  );
  const attempted = appendAttempt(progress, levelId, {
    kind: "rule-suite",
    rule,
    evidence,
    complete: true,
  });

  let tutorialStage = attempted.tutorialStage;
  if (levelId === "training-yard") {
    tutorialStage =
      rule === "targeted" ? "release" : "install-targeted-rule";
  }

  const nextProgress: LevelProgress = { ...attempted, tutorialStage };
  const nextState = replaceLevel(state, levelId, nextProgress);
  if (rule === "targeted") {
    return accept(
      nextState,
      `Verified in ${level.label}: all current scenarios pass under ${level.rules.targeted.label}.`,
      "targeted-pass",
      "targeted-verified",
    );
  }

  const regressionScenario = level.oldPassScenarios[rule === "broad" ? 0 : 1];
  const cue = rule === "broad" ? "broad-regression" : "alternate-regression";
  return accept(
    nextState,
    `${level.rules[rule].label} fixes the new hazard but regresses ${SCENARIO_DEFINITIONS[regressionScenario].label}.`,
    cue,
    cue,
  );
}

function pullLever(state: GameState): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);

  if (progress.released) {
    return reject(state, `${level.label} is already released.`);
  }

  if (levelId === "training-yard") {
    switch (progress.tutorialStage) {
      case "pull-baseline":
        return runTrainingBaseline(state);
      case "pull-tower-test":
        return runInitialFailure(state);
      case "pull-regression-suite":
        return progress.rule === "broad"
          ? runRuleSuite(state, "broad")
          : reject(state, "Install the guided broad rule before pulling the lever.");
      case "pull-verified-suite":
        return progress.rule
          ? runRuleSuite(state, progress.rule)
          : reject(state, "Choose a rule cartridge before pulling the lever.");
      default:
        return reject(state, "Complete the highlighted training action before pulling the lever.");
    }
  }

  if (!progress.placedProps.includes(level.fixtureProp)) {
    return reject(
      state,
      `Place ${PROP_DEFINITIONS[level.fixtureProp].label} before pulling the lever.`,
    );
  }
  if (!progress.initialRunComplete) return runInitialFailure(state);
  if (!progress.rule) {
    return reject(state, "Install a rule before rerunning the current scenarios.");
  }
  return runRuleSuite(state, progress.rule);
}

function installRule(state: GameState, rule: RuleId): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);

  if (progress.released) {
    return reject(state, `${level.label} is already released.`);
  }

  let tutorialStage = progress.tutorialStage;
  const neutralTutorialChoice =
    levelId === "training-yard" &&
    tutorialStage === "install-targeted-rule";
  if (levelId === "training-yard") {
    if (tutorialStage === "install-broad-rule" && rule !== "broad") {
      return reject(state, "The guided comparison installs the broad rule first.");
    }
    if (
      tutorialStage !== "install-broad-rule" &&
      tutorialStage !== "install-targeted-rule"
    ) {
      return reject(state, "Complete the highlighted training action before installing a rule.");
    }
  } else if (!progress.initialRunComplete) {
    return reject(state, "Pull the lever once to record the initial failure before installing a rule.");
  }

  if (progress.rule === rule && !neutralTutorialChoice) {
    return reject(
      state,
      `${level.rules[rule].label} is already installed; pull the lever or choose a different rule.`,
    );
  }

  if (tutorialStage === "install-broad-rule") {
    tutorialStage = "pull-regression-suite";
  } else if (tutorialStage === "install-targeted-rule") {
    tutorialStage = "pull-verified-suite";
  }

  const nextProgress: LevelProgress = {
    ...progress,
    rule,
    revision: progress.revision + 1,
    evidence: markEvidenceStale(levelId, progress.evidence),
    tutorialStage,
  };
  const visualCue: VisualCue =
    rule === "broad"
      ? "broad-rule-installed"
      : rule === "alternate"
        ? "alternate-rule-installed"
        : "targeted-rule-installed";
  return accept(
    replaceLevel(state, levelId, nextProgress),
    `${level.rules[rule].label} installed. Prior evidence is stale; pull the lever to rerun every current scenario.`,
    visualCue,
    "evidence-stale",
  );
}

function pressRelease(state: GameState): TransitionResult {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);
  const lockReason = selectReleaseLockReason(state);
  if (lockReason) return reject(state, lockReason, "release-locked");

  const nextProgress: LevelProgress = {
    ...progress,
    released: true,
    tutorialStage: levelId === "training-yard" ? "complete" : null,
  };
  return accept(
    replaceLevel(state, levelId, nextProgress),
    `${level.label} released with all current scenarios verified under the targeted rule.`,
    "level-release",
    "level-released",
  );
}

function advanceLevel(state: GameState): TransitionResult {
  const progress = currentProgress(state);
  const currentIndex = LEVEL_IDS.indexOf(state.currentLevelId);
  if (!progress.released) {
    return reject(state, "Release the current level before advancing.");
  }
  if (currentIndex === LEVEL_IDS.length - 1) {
    return reject(state, "Campaign complete. Reset the campaign to play again.");
  }

  const nextLevelId = LEVEL_IDS[currentIndex + 1];
  const nextLevel = LEVEL_DEFINITIONS[nextLevelId];
  return accept(
    { ...state, currentLevelId: nextLevelId },
    `${nextLevel.label} ready. Place ${PROP_DEFINITIONS[nextLevel.fixtureProp].label} to stage the fixture.`,
    "level-advance",
    "level-advanced",
  );
}

function resetLevel(state: GameState): TransitionResult {
  const levelId = state.currentLevelId;
  const previous = currentProgress(state);
  const fresh = createLevelProgress(levelId);
  const reset: LevelProgress = {
    ...fresh,
    revision: previous.revision + 1,
    attempts: previous.attempts,
    nextAttemptId: previous.nextAttemptId,
  };
  return accept(
    replaceLevel(state, levelId, reset),
    `${LEVEL_DEFINITIONS[levelId].label} reset. Attempt history was retained.`,
    "level-reset",
    "level-reset",
  );
}

export function transition(
  state: GameState,
  intent: GameIntent,
): TransitionResult {
  switch (intent.type) {
    case "place-prop":
      return placeProp(state, intent.prop);
    case "install-rule":
      return installRule(state, intent.rule);
    case "pull-lever":
      return pullLever(state);
    case "press-release":
      return pressRelease(state);
    case "advance-level":
      return advanceLevel(state);
    case "reset-level":
      return resetLevel(state);
    case "reset-campaign":
      return accept(
        createInitialState(),
        "Kaiju QA campaign reset to the Training Yard.",
        "campaign-reset",
        "campaign-reset",
      );
  }
}

export const reducer = transition;

export function selectCurrentLevel(state: GameState): CurrentLevel {
  const index = LEVEL_IDS.indexOf(state.currentLevelId);
  return {
    id: state.currentLevelId,
    index,
    definition: LEVEL_DEFINITIONS[state.currentLevelId],
    progress: state.levels[state.currentLevelId],
  };
}

export function selectCurrentEvidence(state: GameState): LevelEvidence {
  return currentProgress(state).evidence;
}

export function selectCurrentStatuses(
  state: GameState,
): Readonly<Partial<Record<ScenarioId, ScenarioStatus>>> {
  return snapshotStatuses(state.currentLevelId, selectCurrentEvidence(state));
}

export function selectLatestAttempt(
  state: GameState,
  levelId: LevelId = state.currentLevelId,
): Attempt | null {
  const attempts = state.levels[levelId].attempts;
  return attempts[attempts.length - 1] ?? null;
}

export function selectAttemptHistory(
  state: GameState,
  levelId: LevelId = state.currentLevelId,
): readonly Attempt[] {
  return state.levels[levelId].attempts;
}

function currentEvidenceIsStale(state: GameState): boolean {
  const level = LEVEL_DEFINITIONS[state.currentLevelId];
  const evidence = selectCurrentEvidence(state);
  return level.scenarios.some((scenario) => {
    const item = evidence[scenario];
    return item?.status === "stale" ||
      (item?.attemptId !== null &&
        item?.attemptId !== undefined &&
        item.revision !== currentProgress(state).revision);
  });
}

export function selectReleaseEligibility(state: GameState): boolean {
  const level = LEVEL_DEFINITIONS[state.currentLevelId];
  const progress = currentProgress(state);
  const latest = selectLatestAttempt(state);
  return Boolean(
    !progress.released &&
      progress.rule === "targeted" &&
      latest?.kind === "rule-suite" &&
      latest.rule === "targeted" &&
      latest.revision === progress.revision &&
      level.scenarios.every((scenario) => {
        const evidence = progress.evidence[scenario];
        return (
          evidence?.status === "pass" &&
          evidence.rule === "targeted" &&
          evidence.revision === progress.revision &&
          evidence.attemptId === latest.id
        );
      }),
  );
}

export function selectReleaseLockReason(state: GameState): string | null {
  const level = LEVEL_DEFINITIONS[state.currentLevelId];
  const progress = currentProgress(state);
  if (progress.released) return `${level.label} is already released.`;
  if (selectReleaseEligibility(state)) return null;

  if (state.currentLevelId === "training-yard" && progress.tutorialStage !== "release") {
    return "RELEASE LOCKED - complete the guided evidence cycle with one fresh suite where every scenario passes.";
  }
  if (!progress.placedProps.includes(level.fixtureProp)) {
    return `RELEASE LOCKED - place ${PROP_DEFINITIONS[level.fixtureProp].label}.`;
  }
  if (!progress.initialRunComplete) {
    return "RELEASE LOCKED - pull the lever to record the initial failure.";
  }
  if (!progress.rule) {
    return "RELEASE LOCKED - install a rule and rerun every current scenario.";
  }
  if (currentEvidenceIsStale(state)) {
    return "RELEASE LOCKED - evidence is stale; pull the lever to rerun every current scenario.";
  }
  if (progress.rule !== "targeted") {
    return "RELEASE LOCKED - the latest suite still contains a regression; choose a cartridge and rerun every current scenario.";
  }
  return "RELEASE LOCKED - every current scenario must pass in one fresh rule-suite run.";
}

export function selectExpectedInteractionTarget(
  state: GameState,
): ExpectedInteractionTarget {
  const levelId = state.currentLevelId;
  const level = LEVEL_DEFINITIONS[levelId];
  const progress = currentProgress(state);

  if (progress.released) {
    return levelId === LEVEL_IDS[LEVEL_IDS.length - 1]
      ? null
      : { type: "advance-level" };
  }

  if (levelId === "training-yard") {
    switch (progress.tutorialStage) {
      case "place-car":
        return { type: "place-prop", prop: "car" };
      case "pull-baseline":
      case "pull-tower-test":
      case "pull-regression-suite":
      case "pull-verified-suite":
        return { type: "pull-lever" };
      case "place-tower":
        return { type: "place-prop", prop: "tower" };
      case "install-broad-rule":
        return { type: "install-rule", rule: "broad" };
      case "install-targeted-rule":
        return { type: "install-rule" };
      case "release":
        return { type: "press-release" };
      case "complete":
        return { type: "advance-level" };
      case null:
        return null;
    }
  }

  if (!progress.placedProps.includes(level.fixtureProp)) {
    return { type: "place-prop", prop: level.fixtureProp };
  }
  if (!progress.initialRunComplete) return { type: "pull-lever" };
  if (!progress.rule) return { type: "install-rule" };
  if (currentEvidenceIsStale(state)) return { type: "pull-lever" };
  if (selectReleaseEligibility(state)) return { type: "press-release" };

  const hasRegression = level.scenarios.some(
    (scenario) => progress.evidence[scenario]?.status === "regression",
  );
  if (hasRegression) return { type: "install-rule" };
  return { type: "pull-lever" };
}

export function selectCampaignCompletion(state: GameState): boolean {
  return LEVEL_IDS.every((levelId) => state.levels[levelId].released);
}
