import { expect, type Page, test } from "@playwright/test";

type LevelId =
  | "training-yard"
  | "school-crossing"
  | "harbor-load"
  | "storm-shift";
type PropId = "car" | "tower" | "crosswalk" | "heavy-cargo" | "rain-module";
type RuleId = "broad" | "alternate" | "targeted";

interface DebugPoint {
  readonly x: number;
  readonly y: number;
  readonly visible: boolean;
}

type ExpectedInteraction =
  | { readonly type: "place-prop"; readonly prop: PropId }
  | { readonly type: "install-rule"; readonly rule?: RuleId }
  | { readonly type: "pull-lever" }
  | { readonly type: "press-release" }
  | { readonly type: "advance-level" }
  | null;

interface DebugLevelProgress {
  readonly placedProps: readonly PropId[];
  readonly rule: RuleId | null;
  readonly released: boolean;
  readonly evidence: Readonly<Record<string, { readonly status: string }>>;
  readonly attempts: readonly unknown[];
}

interface DebugGameState {
  readonly currentLevelId: LevelId;
  readonly levels: Readonly<Record<LevelId, DebugLevelProgress>>;
}

interface KaijuQaDebugApi {
  getDebugTargets(): Record<string, DebugPoint>;
  getExpectedInteraction(): ExpectedInteraction;
  getState(): DebugGameState;
}

interface RuntimeObservations {
  readonly consoleMessages: Array<{ type: string; text: string }>;
  readonly pageErrors: string[];
  readonly requestFailures: string[];
  readonly httpErrors: string[];
  responseCount: number;
}

interface ScrollSnapshot {
  readonly windowX: number;
  readonly windowY: number;
  readonly documentX: number;
  readonly documentY: number;
  readonly bodyX: number;
  readonly bodyY: number;
  readonly visualX: number;
  readonly visualY: number;
}

const DEBUG_API = "__KAIJU_QA__";
const EXPECT_TIMEOUT = 20_000;
const READY_TIMEOUT = 300_000;

if (process.env.KAIJU_QA_BROWSER_CHANNEL) {
  test.use({ channel: process.env.KAIJU_QA_BROWSER_CHANNEL });
}

function captureRuntimeObservations(page: Page): RuntimeObservations {
  const observations: RuntimeObservations = {
    consoleMessages: [],
    pageErrors: [],
    requestFailures: [],
    httpErrors: [],
    responseCount: 0,
  };

  page.on("console", (message) => {
    observations.consoleMessages.push({
      type: message.type(),
      text: message.text(),
    });
  });
  page.on("pageerror", (error) => observations.pageErrors.push(error.message));
  page.on("requestfailed", (request) => {
    observations.requestFailures.push(
      `${request.resourceType()} ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown error"})`,
    );
  });
  page.on("response", (response) => {
    observations.responseCount += 1;
    if (response.status() < 400) return;
    observations.httpErrors.push(
      `${response.status()} ${response.request().resourceType()} ${response.url()}`,
    );
  });

  return observations;
}

function assertCleanRuntime(
  observations: RuntimeObservations,
  label: string,
): void {
  const chromiumDriverWarnings = observations.consoleMessages.filter(
    ({ type, text }) =>
      type === "warning" &&
      /GL Driver Message .*GPU stall due to ReadPixels/.test(text),
  );
  const consoleProblems = observations.consoleMessages.filter(
    ({ type, text }) =>
      (type === "warning" || type === "error") &&
      !/GL Driver Message .*GPU stall due to ReadPixels/.test(text),
  );
  const consoleSummary = observations.consoleMessages.reduce<Record<string, number>>(
    (summary, message) => {
      summary[message.type] = (summary[message.type] ?? 0) + 1;
      return summary;
    },
    {},
  );

  console.log(
    `[kaiju-qa:${label}] responses=${observations.responseCount} console=${JSON.stringify(consoleSummary)} chromiumReadPixelsWarnings=${chromiumDriverWarnings.length} requestFailures=${observations.requestFailures.length} httpErrors=${observations.httpErrors.length} pageErrors=${observations.pageErrors.length}`,
  );
  expect(
    consoleProblems,
    "The app should not log warnings or errors beyond Chromium's known WebGL readback diagnostic",
  ).toEqual([]);
  expect(observations.pageErrors, "The page should not throw runtime errors").toEqual([]);
  expect(
    observations.requestFailures,
    "All document, code, model, texture, audio, worker, and WASM requests should complete",
  ).toEqual([]);
  expect(observations.httpErrors, "The app should not receive HTTP error responses").toEqual([]);
}

async function openExperience(page: Page): Promise<RuntimeObservations> {
  const observations = captureRuntimeObservations(page);
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response, "The app document should return a response").not.toBeNull();
  expect(response?.ok(), `Unexpected document status: ${response?.status()}`).toBe(true);
  await expect(page).toHaveTitle(/Kaiju QA/i);
  await expect(page.locator("body")).toHaveAttribute("data-iwsdk-ready", "true", {
    timeout: READY_TIMEOUT,
  });
  await expect(page.locator("body")).toHaveAttribute("data-game-ready", "true");
  await expect(page.locator("#loading-state")).toBeHidden();
  await expect(
    page.getByRole("heading", { name: "KAIJU QA", exact: true }),
  ).toBeVisible();
  await expect(page.locator("#scene-container canvas")).toBeVisible();
  await expect
    .poll(
      () =>
        page.evaluate((apiName) => {
          const api = (window as Window & Record<string, KaijuQaDebugApi | undefined>)[
            apiName
          ];
          return api ? Object.keys(api.getDebugTargets()).length : 0;
        }, DEBUG_API),
      { timeout: EXPECT_TIMEOUT },
    )
    .toBeGreaterThan(0);
  return observations;
}

async function readExpected(page: Page): Promise<ExpectedInteraction> {
  return page.evaluate((apiName) => {
    const api = (window as Window & Record<string, KaijuQaDebugApi | undefined>)[
      apiName
    ];
    if (!api) throw new Error("Kaiju QA debug API is unavailable");
    return api.getExpectedInteraction();
  }, DEBUG_API);
}

async function readState(page: Page): Promise<DebugGameState> {
  return page.evaluate((apiName) => {
    const api = (window as Window & Record<string, KaijuQaDebugApi | undefined>)[
      apiName
    ];
    if (!api) throw new Error("Kaiju QA debug API is unavailable");
    return api.getState();
  }, DEBUG_API);
}

async function readDebugPoint(page: Page, key: string): Promise<DebugPoint | null> {
  return page.evaluate(
    ({ apiName, targetKey }) => {
      const api = (window as Window & Record<string, KaijuQaDebugApi | undefined>)[
        apiName
      ];
      return api?.getDebugTargets()[targetKey] ?? null;
    },
    { apiName: DEBUG_API, targetKey: key },
  );
}

async function debugPoint(page: Page, key: string): Promise<DebugPoint> {
  const point = await readDebugPoint(page, key);
  expect(point, `Debug target ${key} should exist`).not.toBeNull();
  expect(point?.visible, `Debug target ${key} should project into the camera`).toBe(true);

  const canvasBox = await page.evaluate(() => {
    const canvas = document.querySelector<HTMLCanvasElement>("#scene-container canvas");
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: bounds.x,
      y: bounds.y,
      width: bounds.width,
      height: bounds.height,
    };
  });
  expect(canvasBox, "The interaction canvas should have measurable bounds").not.toBeNull();
  expect(point!.x).toBeGreaterThanOrEqual(canvasBox!.x);
  expect(point!.x).toBeLessThanOrEqual(canvasBox!.x + canvasBox!.width);
  expect(point!.y).toBeGreaterThanOrEqual(canvasBox!.y);
  expect(point!.y).toBeLessThanOrEqual(canvasBox!.y + canvasBox!.height);
  return point!;
}

async function expectExpected(
  page: Page,
  expected: ExpectedInteraction,
): Promise<void> {
  await expect
    .poll(() => readExpected(page), { timeout: EXPECT_TIMEOUT })
    .toEqual(expected);
}

async function expectCurrentLevel(page: Page, levelId: LevelId): Promise<void> {
  await expect
    .poll(async () => (await readState(page)).currentLevelId, {
      timeout: EXPECT_TIMEOUT,
    })
    .toBe(levelId);
  await expect(page.locator("body")).toHaveAttribute("data-level", levelId);
}

async function waitForTargetReturn(
  page: Page,
  key: string,
  home: DebugPoint,
): Promise<void> {
  await expect
    .poll(
      async () => {
        const point = await readDebugPoint(page, key);
        return point ? Math.hypot(point.x - home.x, point.y - home.y) : Number.POSITIVE_INFINITY;
      },
      { timeout: EXPECT_TIMEOUT },
    )
    .toBeLessThan(3);
}

async function mouseDrag(
  page: Page,
  fromKey: string,
  toKey: string,
): Promise<{ from: DebugPoint; to: DebugPoint }> {
  const from = await debugPoint(page, fromKey);
  const to = await debugPoint(page, toKey);

  await page.mouse.move(from.x, from.y);
  await page.mouse.down();
  try {
    await page.waitForTimeout(40);
    await page.mouse.move(to.x, to.y, { steps: 18 });
    await page.waitForTimeout(40);
  } finally {
    await page.mouse.up();
  }
  return { from, to };
}

async function placeProp(
  page: Page,
  prop: PropId,
  nextExpected: ExpectedInteraction,
): Promise<void> {
  await mouseDrag(page, `prop-${prop}`, `drop-prop-${prop}`);
  await expectExpected(page, nextExpected);
}

async function installRule(
  page: Page,
  rule: RuleId,
  nextExpected: ExpectedInteraction,
): Promise<void> {
  await mouseDrag(page, `rule-${rule}`, `drop-rule-${rule}`);
  await expectExpected(page, nextExpected);
}

async function pullLever(
  page: Page,
  nextExpected: ExpectedInteraction,
): Promise<void> {
  const home = await debugPoint(page, "lever");
  await mouseDrag(page, "lever", "lever-pull");
  await expectExpected(page, nextExpected);
  await waitForTargetReturn(page, "lever", home);
}

async function pressStamp(
  page: Page,
  nextExpected: ExpectedInteraction,
): Promise<void> {
  const home = await debugPoint(page, "stamp");
  await mouseDrag(page, "stamp", "stamp-press");
  await expectExpected(page, nextExpected);
  await waitForTargetReturn(page, "stamp", home);
}

async function expectAllEvidence(
  page: Page,
  levelId: LevelId,
  expectedStatus: string,
): Promise<void> {
  await expect
    .poll(async () => {
      const level = (await readState(page)).levels[levelId];
      return Object.values(level.evidence).map(({ status }) => status);
    })
    .toEqual([expectedStatus, expectedStatus, expectedStatus]);
}

async function readScroll(page: Page): Promise<ScrollSnapshot> {
  return page.evaluate(() => ({
    windowX: window.scrollX,
    windowY: window.scrollY,
    documentX: document.documentElement.scrollLeft,
    documentY: document.documentElement.scrollTop,
    bodyX: document.body.scrollLeft,
    bodyY: document.body.scrollTop,
    visualX: window.visualViewport?.pageLeft ?? 0,
    visualY: window.visualViewport?.pageTop ?? 0,
  }));
}

const ZERO_SCROLL: ScrollSnapshot = {
  windowX: 0,
  windowY: 0,
  documentX: 0,
  documentY: 0,
  bodyX: 0,
  bodyY: 0,
  visualX: 0,
  visualY: 0,
};

test.describe.configure({ mode: "serial" });

test.describe("desktop tactile manipulation", () => {
  test("recovers an invalid canvas drop and accepts the next real drag", async ({
    page,
  }, testInfo) => {
    test.setTimeout(900_000);
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only tactile check");
    const observations = await openExperience(page);
    await expectExpected(page, { type: "place-prop", prop: "car" });

    const home = await debugPoint(page, "prop-car");
    const validDrop = await debugPoint(page, "drop-prop-car");
    const invalidDrop = await debugPoint(page, "rule-socket");
    expect(
      Math.hypot(invalidDrop.x - validDrop.x, invalidDrop.y - validDrop.y),
      "The invalid-drop coordinate must be clearly separated from the prop socket",
    ).toBeGreaterThan(80);

    await mouseDrag(page, "prop-car", "rule-socket");
    await expect(page.locator("#status")).toContainText(
      "Drop the test prop into its glowing city socket.",
    );
    await expectExpected(page, { type: "place-prop", prop: "car" });
    expect((await readState(page)).levels["training-yard"].placedProps).toEqual([]);
    await waitForTargetReturn(page, "prop-car", home);

    await placeProp(page, "car", { type: "pull-lever" });
    expect((await readState(page)).levels["training-yard"].placedProps).toEqual([
      "car",
    ]);
    assertCleanRuntime(observations, "invalid-drop-recovery");
  });

  test("completes all four districts through drags, lever pulls, and stamp presses", async ({
    page,
  }, testInfo) => {
    test.setTimeout(900_000);
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop-only campaign check");
    const observations = await openExperience(page);

    await expectCurrentLevel(page, "training-yard");
    await expectExpected(page, { type: "place-prop", prop: "car" });
    await placeProp(page, "car", { type: "pull-lever" });
    await pullLever(page, { type: "place-prop", prop: "tower" });
    await placeProp(page, "tower", { type: "pull-lever" });
    await pullLever(page, { type: "install-rule", rule: "broad" });
    await installRule(page, "broad", { type: "pull-lever" });
    await pullLever(page, { type: "install-rule" });
    await installRule(page, "targeted", { type: "pull-lever" });
    await pullLever(page, { type: "press-release" });
    await expectAllEvidence(page, "training-yard", "pass");
    await pressStamp(page, { type: "advance-level" });
    await pressStamp(page, { type: "place-prop", prop: "crosswalk" });

    const campaignLevels: ReadonlyArray<{
      level: Exclude<LevelId, "training-yard">;
      prop: Exclude<PropId, "car" | "tower">;
      nextLevel: LevelId | null;
    }> = [
      { level: "school-crossing", prop: "crosswalk", nextLevel: "harbor-load" },
      { level: "harbor-load", prop: "heavy-cargo", nextLevel: "storm-shift" },
      { level: "storm-shift", prop: "rain-module", nextLevel: null },
    ];

    for (const { level, prop, nextLevel } of campaignLevels) {
      await expectCurrentLevel(page, level);
      await expectExpected(page, { type: "place-prop", prop });
      await placeProp(page, prop, { type: "pull-lever" });
      await pullLever(page, { type: "install-rule" });
      await installRule(page, "targeted", { type: "pull-lever" });
      await pullLever(page, { type: "press-release" });
      await expectAllEvidence(page, level, "pass");
      await pressStamp(
        page,
        nextLevel === null ? null : { type: "advance-level" },
      );

      if (nextLevel !== null) {
        const nextProp = campaignLevels.find((item) => item.level === nextLevel)?.prop;
        expect(nextProp, `A fixture should be defined for ${nextLevel}`).toBeTruthy();
        await pressStamp(page, { type: "place-prop", prop: nextProp! });
      }
    }

    const finalState = await readState(page);
    expect(finalState.currentLevelId).toBe("storm-shift");
    expect(
      Object.fromEntries(
        Object.entries(finalState.levels).map(([level, progress]) => [
          level,
          {
            released: progress.released,
            attempts: progress.attempts.length,
            rule: progress.rule,
          },
        ]),
      ),
    ).toEqual({
      "training-yard": { released: true, attempts: 4, rule: "targeted" },
      "school-crossing": { released: true, attempts: 2, rule: "targeted" },
      "harbor-load": { released: true, attempts: 2, rule: "targeted" },
      "storm-shift": { released: true, attempts: 2, rule: "targeted" },
    });
    await expect(page.locator("body")).toHaveAttribute(
      "data-campaign-complete",
      "true",
    );
    await expect(page.locator("#progress-label")).toHaveText("Campaign complete");
    assertCleanRuntime(observations, "desktop-campaign");
  });
});

test.describe("native mobile touch", () => {
  test("drags the fixture with native CDP touch without scrolling the page", async ({
    page,
  }, testInfo) => {
    test.setTimeout(900_000);
    test.skip(
      testInfo.project.name !== "mobile-chromium",
      "Mobile Chromium-only CDP touch check",
    );
    const observations = await openExperience(page);
    await expectExpected(page, { type: "place-prop", prop: "car" });
    const from = await debugPoint(page, "prop-car");
    const to = await debugPoint(page, "drop-prop-car");
    const session = await page.context().newCDPSession(page);
    const scrollSamples: ScrollSnapshot[] = [await readScroll(page)];
    let touchActive = false;

    try {
      await session.send("Emulation.setTouchEmulationEnabled", {
        enabled: true,
        maxTouchPoints: 1,
      });
      await session.send("Input.dispatchTouchEvent", {
        type: "touchStart",
        touchPoints: [
          {
            id: 1,
            x: from.x,
            y: from.y,
            radiusX: 8,
            radiusY: 8,
            force: 1,
          },
        ],
      });
      touchActive = true;
      await page.waitForTimeout(40);
      scrollSamples.push(await readScroll(page));

      for (let step = 1; step <= 18; step += 1) {
        const progress = step / 18;
        await session.send("Input.dispatchTouchEvent", {
          type: "touchMove",
          touchPoints: [
            {
              id: 1,
              x: from.x + (to.x - from.x) * progress,
              y: from.y + (to.y - from.y) * progress,
              radiusX: 8,
              radiusY: 8,
              force: 1,
            },
          ],
        });
        if (step === 9 || step === 18) scrollSamples.push(await readScroll(page));
        await page.waitForTimeout(16);
      }

      await session.send("Input.dispatchTouchEvent", {
        type: "touchEnd",
        touchPoints: [],
      });
      touchActive = false;
    } finally {
      if (touchActive) {
        await session.send("Input.dispatchTouchEvent", {
          type: "touchEnd",
          touchPoints: [],
        });
      }
      await session.detach();
    }

    await expectExpected(page, { type: "pull-lever" });
    scrollSamples.push(await readScroll(page));
    expect(scrollSamples).toEqual(scrollSamples.map(() => ZERO_SCROLL));
    expect((await readState(page)).levels["training-yard"].placedProps).toEqual([
      "car",
    ]);
    assertCleanRuntime(observations, "native-touch-drag");
  });
});
