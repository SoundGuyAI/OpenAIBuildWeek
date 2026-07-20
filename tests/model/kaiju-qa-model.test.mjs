import assert from "node:assert/strict";
import test from "node:test";
import {
  createInitialState,
  selectAttemptHistory,
  selectReleaseEligibility,
  selectReleaseLockReason,
  transition,
} from "../../src/kaiju-qa/game-model.ts";

const step = (state, type, extra = {}) => transition(state, { type, ...extra }).state;

function reachIndependent(state = createInitialState()) {
  state = step(state, "run-baseline");
  state = step(state, "stage-tower");
  state = step(state, "run-tower");
  state = step(state, "select-guardrail", { guardrail: "freeze-near-buildings" });
  state = step(state, "run-suite");
  return state;
}

test("happy path reaches a releasable 3/3 targeted suite", () => {
  let state = reachIndependent();
  assert.equal(state.evidence.ambulance.status, "regression");
  state = step(state, "select-guardrail", { guardrail: "slow-striped-zones" });
  assert.equal(state.evidence.car.status, "stale");
  state = step(state, "run-suite");
  assert.deepEqual(
    Object.fromEntries(Object.entries(state.evidence).map(([key, value]) => [key, value.status])),
    { car: "pass", ambulance: "pass", tower: "pass" },
  );
  assert.equal(selectReleaseEligibility(state), true);
  assert.equal(step(state, "release").released, true);
});

test("wrong guardrails reproduce ambulance and car regressions", () => {
  let state = reachIndependent();
  state = step(state, "select-guardrail", { guardrail: "slow-while-carrying" });
  state = step(state, "run-suite");
  assert.equal(state.evidence.car.status, "regression");
  assert.equal(state.evidence.ambulance.status, "pass");

  const rejected = transition(reachIndependent(), {
    type: "select-guardrail",
    guardrail: "slow-striped-zones",
  });
  assert.equal(rejected.accepted, true);
});

test("stale evidence and release gate block incomplete results", () => {
  let state = step(createInitialState(), "run-baseline");
  state = step(state, "stage-tower");
  state = step(state, "run-tower");
  assert.equal(selectReleaseEligibility(state), false);
  assert.match(selectReleaseLockReason(state), /choose a guardrail|run all 3/i);
  state = step(state, "select-guardrail", { guardrail: "freeze-near-buildings" });
  assert.equal(state.evidence.car.status, "stale");
  assert.equal(selectReleaseEligibility(state), false);
});

test("guide toggle and reset preserve deterministic contracts", () => {
  const initial = createInitialState();
  const hidden = step(initial, "toggle-guide");
  assert.equal(hidden.guideVisible, false);
  assert.equal(initial.guideVisible, true);
  const progressed = step(hidden, "run-baseline");
  const reset = step(progressed, "reset");
  assert.deepEqual(reset, initial);
});

test("transitions do not mutate prior state or nested evidence", () => {
  const initial = createInitialState();
  const baseline = step(initial, "run-baseline");
  assert.deepEqual(initial, createInitialState());
  assert.notEqual(baseline, initial);
  assert.notEqual(baseline.evidence, initial.evidence);
  const readyForSelection = step(step(step(baseline, "stage-tower"), "run-tower"), "select-guardrail", {
    guardrail: "freeze-near-buildings",
  });
  assert.equal(baseline.guardrail, null);
  assert.equal(baseline.evidence.car.status, "pass");
  const selected = readyForSelection;
  assert.equal(selected.evidence.car.status, "stale");
});

test("attempt history retains baseline, guided regression, and latest suite", () => {
  let state = reachIndependent();
  state = step(state, "select-guardrail", { guardrail: "slow-while-carrying" });
  state = step(state, "run-suite");
  state = step(state, "select-guardrail", { guardrail: "slow-striped-zones" });
  state = step(state, "run-suite");

  assert.deepEqual(
    selectAttemptHistory(state).map((attempt) => attempt.guardrail),
    [null, "freeze-near-buildings", "slow-striped-zones"],
  );
});
