import { defineConfig, devices } from "@playwright/test";

const isCI = Boolean(process.env.CI);
const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: "./tests/e2e",
  outputDir: "test-results",
  // The IWSDK renderer initializes during Playwright's page fixture setup, so
  // this must cover fixture creation as well as the test body.
  timeout: 240_000,
  expect: { timeout: 10_000 },
  // IWSDK initializes a full WebGL/XR world and local GLB set for every page.
  // Running those worlds concurrently causes false startup timeouts on both
  // developer machines and smaller CI runners.
  fullyParallel: false,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  workers: 1,
  reporter: isCI
    ? [["github"], ["html", { open: "never", outputFolder: "playwright-report" }]]
    : [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL: externalBaseURL ?? "http://127.0.0.1:4173",
    actionTimeout: 20_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    // Continuous trace/video snapshots force expensive WebGL readbacks in
    // headless Chromium. Trace only the CI retry, after an initial failure.
    trace: isCI ? "on-first-retry" : "off",
    video: "off",
  },
  projects: [
    {
      name: "desktop-chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: "mobile-chromium",
      use: { ...devices["Pixel 7"] },
    },
  ],
});
