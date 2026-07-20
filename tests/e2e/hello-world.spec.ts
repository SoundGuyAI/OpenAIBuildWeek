import { expect, type Page, test } from "@playwright/test";

function captureRuntimeErrors(page: Page) {
  const errors: string[] = [];

  page.on("console", (message) => {
    if (message.type() === "error") errors.push(`console: ${message.text()}`);
  });
  page.on("pageerror", (error) => errors.push(`pageerror: ${error.message}`));
  page.on("requestfailed", (request) => {
    if (!["document", "script", "stylesheet"].includes(request.resourceType())) {
      return;
    }

    errors.push(
      `requestfailed: ${request.method()} ${request.url()} (${request.failure()?.errorText ?? "unknown error"})`,
    );
  });

  return errors;
}

async function openExperience(page: Page) {
  const runtimeErrors = captureRuntimeErrors(page);
  const response = await page.goto("/", { waitUntil: "domcontentloaded" });

  expect(response, "The app document should return a response").not.toBeNull();
  expect(response?.ok(), `Unexpected document status: ${response?.status()}`).toBe(true);

  await expect(page).toHaveTitle("IWSDK Hello World");

  await expect(page.locator("body")).toHaveAttribute("data-iwsdk-ready", "true", {
    timeout: 90_000,
  });
  await expect(page.getByRole("heading", { name: "IWSDK Hello World" })).toBeVisible();
  await expect(page.locator("#enter-xr")).toBeEnabled();
  await expect(page.locator("#reset-view")).toBeEnabled();
  await expect(page.getByRole("status")).toContainText("Ready");

  // IWSDK may transfer or replace its canvas while the render worker is active,
  // so the stable contract is the ready state plus a visible scene container.
  await expect(page.locator("#scene-container")).toBeVisible();

  return runtimeErrors;
}

test("boots the IWSDK scene and supports platform controls", async ({ page }, testInfo) => {
  // IWSDK uses worker-backed rendering and software WebGL is intentionally slow
  // in headless CI. Allow enough time for a full boot plus clean worker teardown.
  test.setTimeout(240_000);

  const runtimeErrors = await openExperience(page);
  const motionButton = page.locator("#toggle-motion");
  const resetButton = page.locator("#reset-view");

  await motionButton.evaluate((element) => (element as HTMLButtonElement).click());
  await expect(motionButton).toHaveText("Resume float");

  const touchNavigation = page.getByRole("navigation", {
    name: "Mobile movement controls",
  });

  if (testInfo.project.name === "mobile-chromium") {
    await expect(touchNavigation).toBeVisible();
    await expect(touchNavigation.getByRole("button")).toHaveCount(4);
    await expect(page.getByRole("button", { name: "Move forward" })).toBeVisible();

    const hasHorizontalOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    );
    expect(hasHorizontalOverflow, "Mobile layout should not overflow horizontally").toBe(
      false,
    );
  } else {
    await expect(touchNavigation).toBeHidden();
    await expect(page.getByText(/Move with WASD/)).toBeVisible();
    await expect(resetButton).toBeEnabled();
  }

  expect(runtimeErrors, "The app should not emit runtime or asset-loading errors").toEqual([]);

  // Leave the worker-backed WebGL page before Playwright closes the context.
  // This keeps teardown deterministic in headless Chromium.
  await page.goto("about:blank", { waitUntil: "commit", timeout: 10_000 });
  await page.close({ runBeforeUnload: false });
});
