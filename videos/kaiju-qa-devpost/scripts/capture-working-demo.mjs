import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { chromium } from "@playwright/test";

const root = process.cwd();
const artifactsDir = path.join(root, "artifacts");
const baseURL = "http://127.0.0.1:4173";
const rawVideo = path.join(artifactsDir, "kaiju-qa-working-demo-raw.webm");

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite preview exited early (${server.exitCode}).`);
    }
    try {
      const response = await fetch(baseURL);
      if (response.ok) return;
    } catch {
      // Server is still starting.
    }
    await wait(250);
  }
  throw new Error(`Timed out waiting for ${baseURL}`);
}

async function moveCursor(page, selector, label, holdMs = 360) {
  const locator = page.locator(selector);
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error(`No visible box for ${selector}`);
  const x = Math.round(box.x + box.width / 2);
  const y = Math.round(box.y + box.height / 2);
  await page.evaluate(
    ({ x: cursorX, y: cursorY, message }) => {
      const cursor = document.querySelector("#ci-demo-cursor");
      const caption = document.querySelector("#ci-demo-caption");
      if (cursor instanceof HTMLElement) {
        cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      }
      if (caption instanceof HTMLElement) caption.textContent = message;
    },
    { x, y, message: label },
  );
  await wait(260);
  return { locator, holdMs };
}

async function clickWithCursor(page, selector, label, holdMs) {
  const { locator } = await moveCursor(page, selector, label, holdMs);
  await locator.click();
  await page.evaluate(() => {
    const cursor = document.querySelector("#ci-demo-cursor");
    if (!(cursor instanceof HTMLElement)) return;
    cursor.animate(
      [
        { boxShadow: "0 0 0 0 rgba(255,210,74,.95)" },
        { boxShadow: "0 0 0 24px rgba(255,210,74,0)" },
      ],
      { duration: 360, easing: "ease-out" },
    );
  });
  await wait(holdMs);
}

async function checkWithCursor(page, inputSelector, labelSelector, label, holdMs) {
  await moveCursor(page, labelSelector, label, holdMs);
  await page.locator(inputSelector).check();
  await wait(holdMs);
}

await mkdir(artifactsDir, { recursive: true });

const server = spawn(
  process.execPath,
  [
    path.join(root, "node_modules", "vite", "bin", "vite.js"),
    "preview",
    "--host",
    "127.0.0.1",
    "--port",
    "4173",
    "--strictPort",
  ],
  { cwd: root, env: { ...process.env, CI: "true" }, stdio: "inherit" },
);

let browser;
try {
  await waitForServer(server);
  browser = await chromium.launch({ headless: true });
  const contextStartedAt = Date.now();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    recordVideo: { dir: artifactsDir, size: { width: 1280, height: 720 } },
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "domcontentloaded" });
  await page.locator("body").waitFor({ state: "visible" });
  await page.waitForFunction(
    () =>
      document.body.dataset.iwsdkReady === "true" &&
      document.body.dataset.gameReady === "true",
    { timeout: 90_000 },
  );

  await page.evaluate(() => {
    const style = document.createElement("style");
    style.textContent = `
      #ci-demo-banner, #ci-demo-caption, #ci-demo-cursor { position: fixed; z-index: 2147483647; pointer-events: none; }
      #ci-demo-banner { top: 12px; left: 50%; transform: translateX(-50%); padding: 8px 14px; border: 3px solid #f4eedf; background: #081722; color: #f8c44f; font: 800 13px/1.1 ui-monospace, monospace; letter-spacing: .08em; text-transform: uppercase; }
      #ci-demo-caption { left: 50%; bottom: 18px; transform: translateX(-50%); min-width: 430px; padding: 12px 18px; border: 4px solid #f4eedf; background: #081722; color: #f4eedf; box-shadow: 9px 9px 0 #ef6a5a; font: 800 19px/1.15 system-ui, sans-serif; text-align: center; text-transform: uppercase; }
      #ci-demo-cursor { top: -18px; left: -18px; width: 36px; height: 36px; border: 4px solid #081722; border-radius: 50%; background: #f8c44f; transform: translate(96px, 96px); transition: transform 220ms cubic-bezier(.2,.8,.2,1); }
      #ci-demo-cursor::after { content: ""; position: absolute; left: 10px; top: 10px; width: 8px; height: 8px; border-radius: 50%; background: #081722; }
    `;
    document.head.append(style);
    const banner = document.createElement("div");
    banner.id = "ci-demo-banner";
    banner.textContent = "Working prototype capture · desktop Chromium · CI reproduction";
    const caption = document.createElement("div");
    caption.id = "ci-demo-caption";
    caption.textContent = "Kaiju QA: evidence before release";
    const cursor = document.createElement("div");
    cursor.id = "ci-demo-cursor";
    document.body.append(banner, caption, cursor);
  });

  const demoStartedAt = Date.now();
  await wait(450);
  await clickWithCursor(page, "#primary-action", "Run baseline: car + emergency lane pass", 420);
  await clickWithCursor(page, "#primary-action", "Add the missing fragile-tower case", 300);
  await clickWithCursor(page, "#primary-action", "Observe: tower fails", 520);
  await checkWithCursor(
    page,
    "#guardrail-freeze-near-buildings",
    "label[for='guardrail-freeze-near-buildings']",
    "Try the broad guardrail",
    300,
  );
  await clickWithCursor(page, "#primary-action", "Rerun: ambulance regression", 900);
  await clickWithCursor(page, "#revise-guardrail", "Regression found: revise the guardrail", 300);
  await checkWithCursor(
    page,
    "#guardrail-slow-striped-zones",
    "label[for='guardrail-slow-striped-zones']",
    "Choose the targeted slow zone",
    320,
  );
  await clickWithCursor(page, "#primary-action", "Rerun all three tests", 950);
  await clickWithCursor(page, "#release-button", "3 / 3 current: release earned", 1400);
  const demoEndedAt = Date.now();

  const video = page.video();
  await context.close();
  if (!video) throw new Error("Playwright did not create a video handle.");
  await video.saveAs(rawVideo);
  await writeFile(
    path.join(artifactsDir, "capture-meta.json"),
    `${JSON.stringify(
      {
        sourceCommit: "2674d397ad8cf88f7739874f22abbeed7640f9d5",
        viewport: "1280x720",
        trimStartSec: Math.max(0, (demoStartedAt - contextStartedAt) / 1000 - 0.2),
        demoDurationSec: (demoEndedAt - demoStartedAt) / 1000,
      },
      null,
      2,
    )}\n`,
  );
} finally {
  if (browser) await browser.close();
  if (server.exitCode === null) server.kill("SIGTERM");
}
