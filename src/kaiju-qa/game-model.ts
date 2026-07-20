/** Pure, deterministic, renderer-independent Kaiju QA state machine. */

export const SCENARIOS = ["car", "ambulance", "tower"] as const;
export type ScenarioId = (typeof SCENARIOS)[number];

export const STATUSES = [
  "untested",
  "ready",
  "pass",
  "fail",
  "regression",
  "stale",
] as const;
export type ScenarioStatus = (typeof STATUSES)[number];

export const GUARDRAILS = [
  "freeze-near-buildings",
  "slow-while-carrying",
  "slow-striped-zones",
] as const;
export type GuardrailId = (typeof GUARDRAILS)[number];

export const TUTORIAL_STEPS = [
  "baseline",
  "stage-tower",
  "tower-fail",
  "select-freeze",
  "run-regression",
  "independent",
] as const;
export type TutorialStep = (typeof TUTORIAL_STEPS)[number];

export const METADATA = {
  scenarios: {
    car: {
      label: "Stranded Car",
      criterion: "Move the car to the service bay in time.",
    },
    ambulance: {
      label: "Emergency Lane",
      criterion: "Keep the crossing clear when the ambulance arrives.",
    },
    tower: {
      label: "Fragile Tower",
      criterion: "Complete the carry route without touching the tower.",
    },
  },
  guardrails: {
    "freeze-near-buildings": {
      label: "FREEZE NEAR BUILDINGS",
      scope: "Every building buffer",
    },
    "slow-while-carrying": {
      label: "SLOW WHILE CARRYING",
      scope: "Every carried object",
    },
    "slow-striped-zones": {
      label: "SLOW IN STRIPED ZONES",
      scope: "Marked hazard zones only",
    },
  },
} as const;

type FinalStatus = Extract<ScenarioStatus, "pass" | "fail" | "regression">;

export const OUTCOME_MATRIX: Readonly<
  Record<GuardrailId, Readonly<Record<ScenarioId, FinalStatus>>>
> = {
  "freeze-near-buildings": {
    car: "pass",
    ambulance: "regression",
    tower: "pass",
  },
  "slow-while-carrying": {
    car: "regression",
    ambulance: "pass",
    tower: "pass",
  },
  "slow-striped-zones": {
    car: "pass",
    ambulance: "pass",
    tower: "pass",
  },
};

export interface ScenarioEvidence {
  readonly status: ScenarioStatus;
  readonly attemptId: number | null;
  readonly revision: number | null;
}

export interface Attempt {
  readonly id: number;
  readonly kind: "baseline" | "tower" | "suite";
  readonly guardrail: GuardrailId | null;
  readonly revision: number;
  readonly scenarios: Readonly<Record<ScenarioId, ScenarioStatus>>;
  readonly complete: boolean;
}

export interface GameState {
  readonly tutorial: TutorialStep;
  readonly guideVisible: boolean;
  readonly towerStaged: boolean;
  readonly guardrail: GuardrailId | null;
  readonly revision: number;
  readonly evidence: Readonly<Record<ScenarioId, ScenarioEvidence>>;
  readonly attempts: readonly Attempt[];
  readonly nextAttemptId: number;
  readonly inspected: ScenarioId | null;
  readonly comparing: boolean;
  readonly released: boolean;
}

export type GameIntent =
  | { readonly type: "run-baseline" }
  | { readonly type: "stage-tower" }
  | { readonly type: "run-tower" }
  | { readonly type: "select-guardrail"; readonly guardrail: GuardrailId }
  | { readonly type: "run-suite" }
  | { readonly type: "inspect"; readonly scenario: ScenarioId }
  | { readonly type: "compare"; readonly open: boolean }
  | { readonly type: "revise" }
  | { readonly type: "release" }
  | { readonly type: "toggle-guide"; readonly visible?: boolean }
  | { readonly type: "reset" };

export type SceneCue =
  | "blocked"
  | "baseline"
  | "stage"
  | "tower-failure"
  | "stale"
  | "ambulance-regression"
  | "car-regression"
  | "targeted-pass"
  | "inspect"
  | "compare"
  | "revise"
  | "guide"
  | "release"
  | "reset";

export interface TransitionResult {
  readonly state: GameState;
  readonly announcement: string;
  readonly cue: SceneCue;
  readonly accepted: boolean;
}

function blankEvidence(): Readonly<Record<ScenarioId, ScenarioEvidence>> {
  return {
    car: { status: "untested", attemptId: null, revision: null },
    ambulance: { status: "untested", attemptId: null, revision: null },
    tower: { status: "untested", attemptId: null, revision: null },
  };
}

export function createInitialState(): GameState {
  return {
    tutorial: "baseline",
    guideVisible: true,
    towerStaged: false,
    guardrail: null,
    revision: 0,
    evidence: blankEvidence(),
    attempts: [],
    nextAttemptId: 1,
    inspected: null,
    comparing: false,
    released: false,
  };
}

function reject(state: GameState, announcement: string): TransitionResult {
  return { state, announcement, cue: "blocked", accepted: false };
}

function currentStatuses(
  evidence: Readonly<Record<ScenarioId, ScenarioEvidence>>,
): Readonly<Record<ScenarioId, ScenarioStatus>> {
  return {
    car: evidence.car.status,
    ambulance: evidence.ambulance.status,
    tower: evidence.tower.status,
  };
}

function markEvidenceStale(
  evidence: Readonly<Record<ScenarioId, ScenarioEvidence>>,
): Readonly<Record<ScenarioId, ScenarioEvidence>> {
  return {
    car:
      evidence.car.revision === null
        ? evidence.car
        : { ...evidence.car, status: "stale" },
    ambulance:
      evidence.ambulance.revision === null
        ? evidence.ambulance
        : { ...evidence.ambulance, status: "stale" },
    tower:
      evidence.tower.revision === null
        ? evidence.tower
        : { ...evidence.tower, status: "stale" },
  };
}

function appendAttempt(
  state: GameState,
  values: {
    kind: Attempt["kind"];
    guardrail: GuardrailId | null;
    evidence: Readonly<Record<ScenarioId, ScenarioEvidence>>;
    complete: boolean;
  },
): GameState {
  const attempt: Attempt = {
    id: state.nextAttemptId,
    kind: values.kind,
    guardrail: values.guardrail,
    revision: state.revision,
    scenarios: currentStatuses(values.evidence),
    complete: values.complete,
  };

  return {
    ...state,
    evidence: values.evidence,
    attempts: [...state.attempts, attempt],
    nextAttemptId: state.nextAttemptId + 1,
  };
}

function runBaseline(state: GameState): TransitionResult {
  const attemptId = state.nextAttemptId;
  const evidence = {
    car: { status: "pass", attemptId, revision: state.revision },
    ambulance: { status: "pass", attemptId, revision: state.revision },
    tower: state.evidence.tower,
  } satisfies Readonly<Record<ScenarioId, ScenarioEvidence>>;
  const next = appendAttempt(state, {
    kind: "baseline",
    guardrail: null,
    evidence,
    complete: false,
  });

  return {
    state: { ...next, tutorial: "stage-tower" },
    accepted: true,
    cue: "baseline",
    announcement:
      "Baseline recorded: car pass, emergency lane pass, fragile tower untested. Coverage is 2 of 3.",
  };
}

function runTowerFailure(state: GameState): TransitionResult {
  const attemptId = state.nextAttemptId;
  const evidence = {
    ...state.evidence,
    tower: { status: "fail", attemptId, revision: state.revision },
  } satisfies Readonly<Record<ScenarioId, ScenarioEvidence>>;
  const next = appendAttempt(state, {
    kind: "tower",
    guardrail: null,
    evidence,
    complete: false,
  });

  return {
    state: { ...next, tutorial: "select-freeze" },
    accepted: true,
    cue: "tower-failure",
    announcement:
      "Fragile Tower failed: the full-speed route contacted the tower in the striped zone.",
  };
}

function runSuite(state: GameState): TransitionResult {
  if (!state.guardrail) {
    return reject(state, "Choose one guardrail before running the suite.");
  }
  if (state.released) {
    return reject(state, "Reset the lab before running a released build.");
  }

  const attemptId = state.nextAttemptId;
  const result = OUTCOME_MATRIX[state.guardrail];
  const evidence = Object.fromEntries(
    SCENARIOS.map((scenario) => [
      scenario,
      {
        status: result[scenario],
        attemptId,
        revision: state.revision,
      },
    ]),
  ) as Readonly<Record<ScenarioId, ScenarioEvidence>>;
  const next = appendAttempt(state, {
    kind: "suite",
    guardrail: state.guardrail,
    evidence,
    complete: true,
  });

  const cue: SceneCue =
    state.guardrail === "freeze-near-buildings"
      ? "ambulance-regression"
      : state.guardrail === "slow-while-carrying"
        ? "car-regression"
        : "targeted-pass";
  const announcement =
    cue === "ambulance-regression"
      ? "One fix, one regression. The tower passes, but the kaiju blocks the ambulance lane."
      : cue === "car-regression"
        ? "The tower passes, but the stranded-car rescue misses its response target."
        : "Verified: all 3 current tests pass under the striped-zone guardrail.";

  return {
    state: {
      ...next,
      tutorial:
        state.tutorial === "run-regression" ? "independent" : state.tutorial,
    },
    accepted: true,
    cue,
    announcement,
  };
}

export function transition(
  state: GameState,
  intent: GameIntent,
): TransitionResult {
  switch (intent.type) {
    case "run-baseline":
      return state.tutorial === "baseline"
        ? runBaseline(state)
        : reject(state, "Run the highlighted tutorial action.");

    case "stage-tower":
      if (state.tutorial !== "stage-tower") {
        return reject(state, "Run the highlighted tutorial action.");
      }
      return {
        state: {
          ...state,
          towerStaged: true,
          tutorial: "tower-fail",
          evidence: {
            ...state.evidence,
            tower: { status: "ready", attemptId: null, revision: null },
          },
        },
        accepted: true,
        cue: "stage",
        announcement: "Fragile Tower staged and ready.",
      };

    case "run-tower":
      if (!state.towerStaged || state.tutorial !== "tower-fail") {
        return reject(state, "Stage the tower before running its test.");
      }
      return runTowerFailure(state);

    case "select-guardrail": {
      if (
        state.tutorial === "select-freeze" &&
        intent.guardrail !== "freeze-near-buildings"
      ) {
        return reject(
          state,
          "The guided experiment first tests FREEZE NEAR BUILDINGS.",
        );
      }
      if (
        state.tutorial !== "select-freeze" &&
        state.tutorial !== "independent"
      ) {
        return reject(state, "Finish the current tutorial action first.");
      }

      const changed = state.guardrail !== intent.guardrail;
      const nextRevision = changed ? state.revision + 1 : state.revision;
      return {
        state: {
          ...state,
          guardrail: intent.guardrail,
          revision: nextRevision,
          evidence: changed ? markEvidenceStale(state.evidence) : state.evidence,
          tutorial:
            state.tutorial === "select-freeze"
              ? "run-regression"
              : "independent",
          comparing: false,
        },
        accepted: true,
        cue: changed ? "stale" : "inspect",
        announcement: changed
          ? `${METADATA.guardrails[intent.guardrail].label} selected. Results are stale; rerun all 3 tests.`
          : "Same guardrail selected. The deterministic run will reproduce the same evidence.",
      };
    }

    case "run-suite":
      if (
        state.tutorial !== "run-regression" &&
        state.tutorial !== "independent"
      ) {
        return reject(state, "Run the highlighted tutorial action.");
      }
      return runSuite(state);

    case "inspect":
      return {
        state: { ...state, inspected: intent.scenario },
        accepted: true,
        cue: "inspect",
        announcement: `${METADATA.scenarios[intent.scenario].label}: ${state.evidence[intent.scenario].status}.`,
      };

    case "compare":
      return {
        state: { ...state, comparing: intent.open },
        accepted: true,
        cue: "compare",
        announcement: intent.open
          ? "One fix, one regression. Compare the tower cause with the blocked ambulance route."
          : "Evidence comparison closed.",
      };

    case "revise":
      return {
        state: { ...state, tutorial: "independent", comparing: false },
        accepted: true,
        cue: "revise",
        announcement:
          "Choose another guardrail. Attempt history is preserved.",
      };

    case "toggle-guide": {
      const visible = intent.visible ?? !state.guideVisible;
      return {
        state: { ...state, guideVisible: visible },
        accepted: true,
        cue: "guide",
        announcement: visible
          ? "Guide shown at the current step."
          : "Guide hidden; progress preserved.",
      };
    }

    case "release":
      if (!selectReleaseEligibility(state)) {
        return reject(state, selectReleaseLockReason(state));
      }
      return {
        state: { ...state, released: true },
        accepted: true,
        cue: "release",
        announcement:
          "Verified City Guardian released with 3 of 3 current passes.",
      };

    case "reset":
      return {
        state: createInitialState(),
        accepted: true,
        cue: "reset",
        announcement: "Kaiju QA lab reset.",
      };
  }
}

export const reducer = transition;

export function selectLatestAttempt(state: GameState): Attempt | null {
  return state.attempts[state.attempts.length - 1] ?? null;
}

/**
 * Retain the three attempts that carry the lesson: baseline, the guided broad
 * regression, and the latest player-run suite. Duplicate slots are removed.
 */
export function selectAttemptHistory(state: GameState): readonly Attempt[] {
  const baseline = state.attempts.find(
    (attempt) => attempt.kind === "baseline",
  );
  const guidedRegression = state.attempts.find(
    (attempt) =>
      attempt.kind === "suite" &&
      attempt.guardrail === "freeze-near-buildings",
  );
  const latestSuite = [...state.attempts]
    .reverse()
    .find((attempt) => attempt.kind === "suite");

  const retained: Attempt[] = [];
  for (const attempt of [baseline, guidedRegression, latestSuite]) {
    if (attempt && !retained.some((item) => item.id === attempt.id)) {
      retained.push(attempt);
    }
  }
  return retained;
}

export function selectCurrentStatuses(
  state: GameState,
): Readonly<Record<ScenarioId, ScenarioStatus>> {
  return currentStatuses(state.evidence);
}

export function selectReleaseEligibility(state: GameState): boolean {
  const latest = selectLatestAttempt(state);
  return Boolean(
    !state.released &&
      state.guardrail === "slow-striped-zones" &&
      latest?.complete &&
      latest.guardrail === state.guardrail &&
      latest.revision === state.revision &&
      SCENARIOS.every((scenario) => state.evidence[scenario].status === "pass"),
  );
}

export function selectReleaseLockReason(state: GameState): string {
  if (state.released) return "Already released.";
  if (!state.guardrail) return "RELEASE LOCKED - choose a guardrail.";

  const latest = selectLatestAttempt(state);
  if (
    SCENARIOS.some((scenario) => state.evidence[scenario].status === "stale") ||
    !latest ||
    latest.revision !== state.revision
  ) {
    return "RELEASE LOCKED - results are stale; rerun all 3 tests.";
  }
  if (!latest.complete) {
    return "RELEASE LOCKED - run all 3 tests under the current guardrail.";
  }
  if (
    SCENARIOS.some((scenario) =>
      ["untested", "ready", "fail", "regression"].includes(
        state.evidence[scenario].status,
      ),
    )
  ) {
    return "RELEASE LOCKED - every current test must pass.";
  }
  return "RELEASE LOCKED - the targeted full-suite result is required.";
}
