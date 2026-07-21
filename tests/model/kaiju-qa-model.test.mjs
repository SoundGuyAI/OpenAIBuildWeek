import assert from "node:assert/strict";
import test from "node:test";
import {
  LEVEL_DEFINITIONS,
  LEVEL_IDS,
  LEVEL_RULE_OUTCOMES,
  PROP_DEFINITIONS,
  PROP_IDS,
  RULE_DEFINITIONS,
  SCENARIO_DEFINITIONS,
  TRAINING_STAGES,
  createInitialState,
  selectAttemptHistory,
  selectCampaignCompletion,
  selectCurrentEvidence,
  selectCurrentLevel,
  selectCurrentStatuses,
  selectExpectedInteractionTarget,
  selectReleaseEligibility,
  selectReleaseLockReason,
  transition,
} from "../../src/kaiju-qa/game-model.ts";

function accept(state, intent) {
  const result = transition(state, intent);
  assert.equal(result.accepted, true, result.announcement);
  assert.equal(typeof result.announcement, "string");
  assert.ok(result.visualCue);
  assert.ok(result.narrationCue);
  return result;
}

function step(state, intent) {
  return accept(state, intent).state;
}

function reject(state, intent) {
  const result = transition(state, intent);
  assert.equal(result.accepted, false);
  assert.strictEqual(result.state, state);
  assert.equal(result.visualCue, "blocked");
  return result;
}

function completeTraining(state = createInitialState(), advance = false) {
  state = step(state, { type: "place-prop", prop: "car" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "place-prop", prop: "tower" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "install-rule", rule: "broad" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "install-rule", rule: "targeted" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "press-release" });
  return advance ? step(state, { type: "advance-level" }) : state;
}

function allScenarioStatuses(state) {
  const level = selectCurrentLevel(state).definition;
  const statuses = selectCurrentStatuses(state);
  return level.scenarios.map((scenario) => statuses[scenario]);
}

function assertNeutralReleaseLock(state) {
  const level = selectCurrentLevel(state).definition;
  const reason = selectReleaseLockReason(state);
  assert.ok(reason);
  assert.doesNotMatch(reason, /targeted/i);
  assert.equal(
    reason.toLowerCase().includes(level.rules.targeted.label.toLowerCase()),
    false,
  );
}

test("campaign data exposes four levels, semantic props, and distinct rule scopes", () => {
  assert.deepEqual(LEVEL_IDS, [
    "training-yard",
    "school-crossing",
    "harbor-load",
    "storm-shift",
  ]);
  assert.equal(TRAINING_STAGES.length, 8);
  assert.deepEqual(PROP_IDS, [
    "car",
    "tower",
    "crosswalk",
    "heavy-cargo",
    "rain-module",
  ]);

  for (const rule of ["broad", "alternate", "targeted"]) {
    assert.ok(RULE_DEFINITIONS[rule].label);
    assert.ok(RULE_DEFINITIONS[rule].scope);
  }

  for (const levelId of LEVEL_IDS) {
    const level = LEVEL_DEFINITIONS[levelId];
    const [oldPassA, oldPassB] = level.oldPassScenarios;
    assert.ok(level.label);
    assert.equal(PROP_DEFINITIONS[level.fixtureProp].levelId, levelId);
    assert.equal(SCENARIO_DEFINITIONS[level.hazardScenario].role, "hazard");
    assert.ok(level.rules.broad.label);
    assert.ok(level.rules.alternate.scope);
    assert.equal(LEVEL_RULE_OUTCOMES[levelId].broad[oldPassA], "regression");
    assert.equal(LEVEL_RULE_OUTCOMES[levelId].broad[oldPassB], "pass");
    assert.equal(LEVEL_RULE_OUTCOMES[levelId].alternate[oldPassA], "pass");
    assert.equal(LEVEL_RULE_OUTCOMES[levelId].alternate[oldPassB], "regression");
    assert.deepEqual(
      level.scenarios.map(
        (scenario) => LEVEL_RULE_OUTCOMES[levelId].targeted[scenario],
      ),
      ["pass", "pass", "pass"],
    );
  }
});

test("training tutorial follows all eight guided stages, then unlocks release", () => {
  let state = createInitialState();
  assert.equal(selectCurrentLevel(state).id, "training-yard");
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "place-prop",
    prop: "car",
  });

  reject(state, { type: "place-prop", prop: "tower" });
  state = step(state, { type: "place-prop", prop: "car" });
  assert.deepEqual(allScenarioStatuses(state), ["ready", "ready", "untested"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "pull-lever",
  });

  const baseline = accept(state, { type: "pull-lever" });
  assert.equal(baseline.visualCue, "baseline-pass");
  state = baseline.state;
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "untested"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "place-prop",
    prop: "tower",
  });

  state = step(state, { type: "place-prop", prop: "tower" });
  assert.equal(selectCurrentStatuses(state)["fragile-tower"], "ready");
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "fail"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
    rule: "broad",
  });

  reject(state, { type: "install-rule", rule: "alternate" });
  state = step(state, { type: "install-rule", rule: "broad" });
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  assert.equal(selectReleaseEligibility(state), false);
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["regression", "pass", "pass"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  assertNeutralReleaseLock(state);

  state = step(state, { type: "install-rule", rule: "targeted" });
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  assertNeutralReleaseLock(state);
  const verified = accept(state, { type: "pull-lever" });
  assert.equal(verified.visualCue, "targeted-pass");
  state = verified.state;
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "pass"]);
  assert.equal(selectReleaseEligibility(state), true);
  assert.equal(selectReleaseLockReason(state), null);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "press-release",
  });

  const released = accept(state, { type: "press-release" });
  assert.equal(released.visualCue, "level-release");
  state = released.state;
  assert.equal(selectCurrentLevel(state).progress.released, true);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "advance-level",
  });
  assert.deepEqual(
    selectAttemptHistory(state).map(({ kind, rule }) => [kind, rule]),
    [
      ["baseline", null],
      ["fixture-test", null],
      ["rule-suite", "broad"],
      ["rule-suite", "targeted"],
    ],
  );
});

test("tutorial neutral choice allows both wrong rules before a fresh passing suite", () => {
  let state = createInitialState();
  state = step(state, { type: "place-prop", prop: "car" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "place-prop", prop: "tower" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "install-rule", rule: "broad" });
  state = step(state, { type: "pull-lever" });

  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  assertNeutralReleaseLock(state);

  const broadInstall = accept(state, { type: "install-rule", rule: "broad" });
  assert.equal(broadInstall.visualCue, "broad-rule-installed");
  state = broadInstall.state;
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "pull-lever",
  });
  const broadRun = accept(state, { type: "pull-lever" });
  assert.equal(broadRun.visualCue, "broad-regression");
  state = broadRun.state;
  assert.deepEqual(allScenarioStatuses(state), ["regression", "pass", "pass"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  assert.equal(selectReleaseEligibility(state), false);
  assertNeutralReleaseLock(state);

  const alternateInstall = accept(state, {
    type: "install-rule",
    rule: "alternate",
  });
  assert.equal(alternateInstall.visualCue, "alternate-rule-installed");
  state = alternateInstall.state;
  const alternateRun = accept(state, { type: "pull-lever" });
  assert.equal(alternateRun.visualCue, "alternate-regression");
  state = alternateRun.state;
  assert.deepEqual(allScenarioStatuses(state), ["pass", "regression", "pass"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  assert.equal(selectReleaseEligibility(state), false);
  assertNeutralReleaseLock(state);

  state = step(state, { type: "install-rule", rule: "targeted" });
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  assert.equal(selectReleaseEligibility(state), false);
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "pass"]);
  assert.equal(selectReleaseEligibility(state), true);
  assert.deepEqual(
    selectAttemptHistory(state).map((attempt) => attempt.rule),
    [null, null, "broad", "broad", "alternate", "targeted"],
  );
});

test("wrong-rule recovery records distinct regressions and stales prior evidence", () => {
  let state = completeTraining(createInitialState(), true);
  assert.equal(selectCurrentLevel(state).id, "school-crossing");
  state = step(state, { type: "place-prop", prop: "crosswalk" });
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "fail"]);

  state = step(state, { type: "install-rule", rule: "broad" });
  const broadRevision = selectCurrentLevel(state).progress.revision;
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  assert.equal(selectReleaseEligibility(state), false);
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["regression", "pass", "pass"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  const broadRelease = reject(state, { type: "press-release" });
  assert.equal(broadRelease.narrationCue, "release-locked");
  assertNeutralReleaseLock(state);

  state = step(state, { type: "install-rule", rule: "alternate" });
  assert.equal(selectCurrentLevel(state).progress.revision, broadRevision + 1);
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["pass", "regression", "pass"]);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "install-rule",
  });
  assertNeutralReleaseLock(state);

  state = step(state, { type: "install-rule", rule: "targeted" });
  assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
  assert.match(selectReleaseLockReason(state), /stale/i);
  reject(state, { type: "press-release" });
  state = step(state, { type: "pull-lever" });
  assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "pass"]);
  assert.equal(selectReleaseEligibility(state), true);
  assert.deepEqual(
    selectAttemptHistory(state).map((attempt) => attempt.rule),
    [null, "broad", "alternate", "targeted"],
  );
});

test("every post-tutorial level exposes neutral choice before a fresh passing release", () => {
  let state = completeTraining(createInitialState(), true);
  const postTutorialLevels = [
    "school-crossing",
    "harbor-load",
    "storm-shift",
  ];

  for (const levelId of postTutorialLevels) {
    const level = LEVEL_DEFINITIONS[levelId];
    assert.equal(selectCurrentLevel(state).id, levelId);
    reject(state, { type: "advance-level" });
    reject(state, { type: "pull-lever" });
    reject(state, { type: "install-rule", rule: "targeted" });

    state = step(state, { type: "place-prop", prop: level.fixtureProp });
    assert.deepEqual(selectExpectedInteractionTarget(state), {
      type: "pull-lever",
    });
    state = step(state, { type: "pull-lever" });
    assert.equal(
      selectCurrentEvidence(state)[level.hazardScenario].status,
      "fail",
    );
    for (const scenario of level.oldPassScenarios) {
      assert.equal(selectCurrentEvidence(state)[scenario].status, "pass");
    }
    assert.deepEqual(selectExpectedInteractionTarget(state), {
      type: "install-rule",
    });
    reject(state, { type: "press-release" });
    assertNeutralReleaseLock(state);

    state = step(state, { type: "install-rule", rule: "targeted" });
    assert.deepEqual(allScenarioStatuses(state), ["stale", "stale", "stale"]);
    state = step(state, { type: "pull-lever" });
    assert.deepEqual(allScenarioStatuses(state), ["pass", "pass", "pass"]);
    assert.equal(selectReleaseEligibility(state), true);
    state = step(state, { type: "press-release" });
    assert.equal(selectCurrentLevel(state).progress.released, true);
    assert.equal(selectAttemptHistory(state, levelId).length, 2);

    if (levelId !== "storm-shift") {
      assert.equal(selectCampaignCompletion(state), false);
      state = step(state, { type: "advance-level" });
    }
  }

  assert.equal(selectCampaignCompletion(state), true);
  assert.equal(selectCurrentLevel(state).id, "storm-shift");
  assert.equal(selectExpectedInteractionTarget(state), null);
  const noFifthLevel = reject(state, { type: "advance-level" });
  assert.match(noFifthLevel.announcement, /campaign complete/i);
  assert.equal(selectAttemptHistory(state, "training-yard").length, 4);
  assert.equal(selectAttemptHistory(state, "school-crossing").length, 2);
  assert.equal(selectAttemptHistory(state, "harbor-load").length, 2);
  assert.equal(selectAttemptHistory(state, "storm-shift").length, 2);
});

test("advance-level is gated and preserves the released level state", () => {
  const initial = createInitialState();
  const blocked = reject(initial, { type: "advance-level" });
  assert.match(blocked.announcement, /release the current level/i);

  const released = completeTraining();
  const trainingProgress = released.levels["training-yard"];
  const advanced = step(released, { type: "advance-level" });
  assert.equal(selectCurrentLevel(advanced).id, "school-crossing");
  assert.strictEqual(advanced.levels["training-yard"], trainingProgress);
  assert.equal(advanced.levels["training-yard"].released, true);
  assert.equal(selectAttemptHistory(advanced, "training-yard").length, 4);
});

test("reset-level restarts interaction state while retaining that level's attempts", () => {
  let state = completeTraining(createInitialState(), true);
  state = step(state, { type: "place-prop", prop: "crosswalk" });
  state = step(state, { type: "pull-lever" });
  state = step(state, { type: "install-rule", rule: "broad" });
  state = step(state, { type: "pull-lever" });
  const beforeReset = selectCurrentLevel(state).progress;
  assert.equal(beforeReset.attempts.length, 2);

  const resetResult = accept(state, { type: "reset-level" });
  assert.equal(resetResult.visualCue, "level-reset");
  state = resetResult.state;
  const reset = selectCurrentLevel(state).progress;
  assert.deepEqual(reset.placedProps, []);
  assert.equal(reset.rule, null);
  assert.equal(reset.initialRunComplete, false);
  assert.equal(reset.released, false);
  assert.equal(reset.revision, beforeReset.revision + 1);
  assert.deepEqual(allScenarioStatuses(state), ["untested", "untested", "untested"]);
  assert.equal(reset.attempts.length, 2);
  assert.equal(reset.nextAttemptId, beforeReset.nextAttemptId);
  assert.deepEqual(selectExpectedInteractionTarget(state), {
    type: "place-prop",
    prop: "crosswalk",
  });

  const campaignReset = accept(state, { type: "reset-campaign" });
  assert.equal(campaignReset.visualCue, "campaign-reset");
  assert.deepEqual(campaignReset.state, createInitialState());
});

test("accepted and rejected transitions never mutate prior campaign state", () => {
  const initial = createInitialState();
  const initialSnapshot = structuredClone(initial);
  const placedResult = accept(initial, { type: "place-prop", prop: "car" });
  const placed = placedResult.state;

  assert.deepEqual(initial, initialSnapshot);
  assert.notStrictEqual(placed, initial);
  assert.notStrictEqual(placed.levels, initial.levels);
  assert.notStrictEqual(
    placed.levels["training-yard"],
    initial.levels["training-yard"],
  );
  assert.notStrictEqual(
    placed.levels["training-yard"].evidence,
    initial.levels["training-yard"].evidence,
  );
  assert.strictEqual(
    placed.levels["school-crossing"],
    initial.levels["school-crossing"],
  );

  const beforeRejected = structuredClone(placed);
  const rejected = reject(placed, { type: "install-rule", rule: "broad" });
  assert.strictEqual(rejected.state, placed);
  assert.deepEqual(placed, beforeRejected);

  let progressed = step(placed, { type: "pull-lever" });
  progressed = step(progressed, { type: "place-prop", prop: "tower" });
  progressed = step(progressed, { type: "pull-lever" });
  const beforeRule = structuredClone(progressed);
  const installed = step(progressed, { type: "install-rule", rule: "broad" });
  assert.deepEqual(progressed, beforeRule);
  assert.notStrictEqual(
    installed.levels["training-yard"].evidence,
    progressed.levels["training-yard"].evidence,
  );
  assert.deepEqual(
    allScenarioStatuses(progressed),
    ["pass", "pass", "fail"],
  );
  assert.deepEqual(allScenarioStatuses(installed), ["stale", "stale", "stale"]);
});
