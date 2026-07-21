import { expect, test } from "@playwright/test";

async function waitForScene(page: import("@playwright/test").Page) {
  await page.goto("/", {
    waitUntil: "domcontentloaded",
    timeout: 120_000,
  });
  await expect(page.locator("body")).toHaveAttribute("data-iwsdk-ready", "true", {
    timeout: 300_000,
  });
}

test.describe("mixed reality availability feedback", () => {
  test.setTimeout(240_000);

  test.afterEach(async ({ page }) => {
    if (page.isClosed()) return;
    await page.goto("about:blank", { waitUntil: "commit", timeout: 10_000 });
    await page.close({ runBeforeUnload: false });
  });

  test("keeps non-XR players in the browser with clear unsupported feedback", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop fallback coverage is sufficient");
    await page.addInitScript(() => {
      class UnsupportedXRSystem extends EventTarget {
        isSessionSupported() {
          return Promise.resolve(false);
        }

        requestSession() {
          return Promise.reject(new DOMException("Unsupported", "NotSupportedError"));
        }
      }

      Object.defineProperty(navigator, "xr", {
        configurable: true,
        value: new UnsupportedXRSystem(),
      });
    });

    await waitForScene(page);

    const enterVr = page.locator("#enter-xr");
    await expect(enterVr).toHaveAttribute("data-xr-state", "unsupported");
    await expect(enterVr).toBeDisabled();
    await expect(enterVr).toHaveText("MR unavailable");
    await expect(page.locator("#xr-status")).toContainText(
      "desktop or touch controls",
    );
    await expect(page.locator("body")).toHaveAttribute(
      "data-xr-state",
      "unsupported",
    );
  });

  test("turns a denied WebXR request into a retryable launch failure", async ({
    page,
  }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop-chromium", "Desktop fallback coverage is sufficient");
    await page.addInitScript(() => {
      class DeniedXRSystem extends EventTarget {
        isSessionSupported() {
          return Promise.resolve(true);
        }

        requestSession() {
          return Promise.reject(
            new DOMException("The user denied the session", "NotAllowedError"),
          );
        }
      }

      Object.defineProperty(navigator, "xr", {
        configurable: true,
        value: new DeniedXRSystem(),
      });
    });

    await waitForScene(page);

    const enterVr = page.locator("#enter-xr");
    await expect(enterVr).toHaveAttribute("data-xr-state", "supported");
    await enterVr.click();

    await expect(enterVr).toHaveAttribute("data-xr-state", "launch-failed");
    await expect(enterVr).toBeEnabled();
    await expect(enterVr).toHaveText("Retry MR");
    await expect(page.locator("#xr-status")).toContainText("blocked or cancelled");
    await expect(page.locator("body")).toHaveAttribute(
      "data-xr-state",
      "launch-failed",
    );
  });
});
