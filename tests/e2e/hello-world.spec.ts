import { expect, type Page, test } from "@playwright/test";

function captureRuntimeErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    errors.push(
      `requestfailed: ${request.resourceType()} ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown error"})`,
    );
  });
  page.on("response", (response) => {
    if (response.status() < 400) return;
    errors.push(
      `response: ${response.status()} ${response.request().resourceType()} ${response.url()}`,
    );
  });

  return errors;
}

function evidenceName(projectName: string) {
  return projectName === "mobile-chromium" ? "02-mobile.png" : "01-desktop.png";
}

async function openExperience(page: Page) {
  const runtimeErrors = captureRuntimeErrors(page);
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response, "The app document should return a response").not.toBeNull();
  expect(response?.ok(), `Unexpected document status: ${response?.status()}`).toBe(true);
  await expect(page).toHaveTitle(/Kaiju QA/i);
  await expect(page.locator("body")).toHaveAttribute("data-iwsdk-ready", "true", {
    timeout: 90_000,
  });
  await expect(page.locator("body")).toHaveAttribute("data-game-ready", "true");
  await expect(page.getByRole("heading", { name: "KAIJU QA" })).toBeVisible();
  await expect(page.getByRole("status")).toContainText("Ready");
  await expect(page.locator("#primary-action")).toBeEnabled();
  return runtimeErrors;
}

async function runToIndependent(page: Page) {
  const primary = page.locator("#primary-action");

  await expect(page.locator("#guide-progress")).toHaveText("1 / 5");
  await primary.click();
  await expect(page.locator("#car-status")).toHaveText("PASS");
  await expect(page.locator("#ambulance-status")).toHaveText("PASS");
  await expect(page.locator("#tower-status")).toHaveText("UNTESTED");
  await expect(page.locator("#coverage-status")).toHaveText("2 / 3 current");

  await primary.click();
  await expect(page.locator("#tower-status")).toHaveText("READY");
  await primary.click();
  await expect(page.locator("#tower-status")).toHaveText("FAIL");
  await expect(page.locator("#guide-progress")).toHaveText("4 / 5");

  await page.locator("#guardrail-freeze-near-buildings").check();
  await expect(page.locator("#guide-progress")).toHaveText("5 / 5");
  await expect(page.locator("#car-status")).toHaveText("STALE");
  await expect(page.locator("#ambulance-status")).toHaveText("STALE");
  await expect(page.locator("#tower-status")).toHaveText("STALE");
  await primary.click();
  await expect(page.locator("#ambulance-status")).toHaveText("REGRESSION");
  await expect(page.locator("#release-button")).toBeDisabled();

  await page.locator("#revise-guardrail").click();
  await page.locator("#guardrail-slow-while-carrying").check();
  await primary.click();
  await expect(page.locator("#car-status")).toHaveText("REGRESSION");
  await expect(page.locator("#ambulance-status")).toHaveText("PASS");

  await page.locator("#guardrail-slow-striped-zones").check();
  await expect(page.locator("#car-status")).toHaveText("STALE");
  await primary.click();
  await expect(page.locator("#coverage-status")).toHaveText("3 / 3 current");
  await expect(page.locator("#car-status")).toHaveText("PASS");
  await expect(page.locator("#ambulance-status")).toHaveText("PASS");
  await expect(page.locator("#tower-status")).toHaveText("PASS");
  await expect(page.locator("#release-button")).toBeEnabled();
  const retainedAttempts = page.locator("#attempt-history > li:visible");
  await expect(retainedAttempts).toHaveCount(3);
  await expect(page.locator("#attempt-history")).toContainText("Baseline");
  await expect(page.locator("#attempt-history")).toContainText(
    "FREEZE NEAR BUILDINGS",
  );
  await expect(page.locator("#attempt-history")).toContainText(
    "SLOW IN STRIPED ZONES",
  );
}

test("covers the deterministic Kaiju QA loop and captures desktop evidence", async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  const runtimeErrors = await openExperience(page);

  await expect(page.locator("#guide-body")).toBeVisible();
  await runToIndependent(page);
  await page.locator("#release-button").click();
  await expect(page.locator("#debrief-panel")).toBeVisible();
  await expect(page.locator("#game-ui")).toHaveAttribute("data-phase", "released");

  expect(runtimeErrors, "The app should not emit runtime or asset-loading errors").toEqual([]);
  await page.screenshot({
    path: `test-results/evidence/${evidenceName(testInfo.project.name)}`,
    type: "png",
    animations: "disabled",
  });

  await page.locator("#reset-lab").click();
  await expect(page.locator("#car-status")).toHaveText("UNTESTED");
  await expect(page.locator("#tower-status")).toHaveText("UNTESTED");
  await expect(page.locator("#release-button")).toBeDisabled();

  await page.locator("#toggle-guide").click();
  await expect(page.locator("#guide-body")).toBeHidden();
  await page.locator("#toggle-guide").click();
  await expect(page.locator("#guide-body")).toBeVisible();

  await page.goto("about:blank", { waitUntil: "commit", timeout: 10_000 });
  await page.close({ runBeforeUnload: false });
});

test("supports mobile layout, large actions, and reduced motion", async ({ page }, testInfo) => {
  test.setTimeout(240_000);
  test.skip(testInfo.project.name !== "mobile-chromium", "Mobile-only layout check");
  const runtimeErrors = await openExperience(page);

  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(overflow, "Mobile layout should not overflow horizontally").toBe(false);
  const controls = page.locator(
    "button:visible, #guardrail-fieldset label:visible",
  );
  for (let i = 0; i < await controls.count(); i += 1) {
    const box = await controls.nth(i).boundingBox();
    expect(box?.height ?? 0, "Mobile action controls should be large enough to tap").toBeGreaterThanOrEqual(44);
  }

  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("#game-ui")).toHaveAttribute("data-motion", "reduced");
  await page.locator("#primary-action").click();
  await expect(page.locator("#car-status")).toHaveText("PASS");
  await page.setViewportSize({ width: 844, height: 390 });
  const landscapeOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );
  expect(landscapeOverflow, "Landscape mobile should not overflow horizontally").toBe(
    false,
  );
  expect(runtimeErrors).toEqual([]);
  await page.goto("about:blank", { waitUntil: "commit", timeout: 10_000 });
  await page.close({ runBeforeUnload: false });
});

test("supports keyboard activation and focus recovery through release", async ({
  page,
}, testInfo) => {
  test.setTimeout(240_000);
  test.skip(testInfo.project.name !== "desktop-chromium", "Desktop keyboard check");
  const runtimeErrors = await openExperience(page);
  const primary = page.locator("#primary-action");

  await primary.focus();
  await page.keyboard.press("Enter");
  await expect(primary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(primary).toBeFocused();
  await page.keyboard.press("Enter");

  const freeze = page.locator("#guardrail-freeze-near-buildings");
  await expect(freeze).toBeFocused();
  await page.keyboard.press("Space");
  await expect(primary).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#scenario-ambulance")).toBeFocused();

  const striped = page.locator("#guardrail-slow-striped-zones");
  await striped.focus();
  await page.keyboard.press("Space");
  await expect(primary).toBeFocused();
  await page.keyboard.press("Enter");

  const release = page.locator("#release-button");
  await expect(release).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("#debrief-panel")).toBeFocused();
  await expect(page.locator("#debrief-panel")).toBeVisible();
  expect(runtimeErrors).toEqual([]);

  await page.goto("about:blank", { waitUntil: "commit", timeout: 10_000 });
  await page.close({ runBeforeUnload: false });
});
