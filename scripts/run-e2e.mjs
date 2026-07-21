import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";

const root = process.cwd();
const previewURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:4173";
const forwardedArgs = process.argv.slice(2);

const waitForExit = (child) =>
  new Promise((resolve) => {
    if (child.exitCode !== null) {
      resolve(child.exitCode);
      return;
    }
    child.once("exit", (code) => resolve(code ?? 1));
  });

async function serverIsReady() {
  try {
    const response = await fetch(previewURL, { redirect: "manual" });
    return response.ok;
  } catch {
    return false;
  }
}

async function waitForServer(server) {
  const deadline = Date.now() + 120_000;

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(`Vite preview exited before becoming ready (${server.exitCode}).`);
    }

    if (await serverIsReady()) return;

    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  throw new Error(`Timed out waiting for ${previewURL}`);
}

async function stopServer(server) {
  if (server.exitCode !== null || !server.pid) return;

  if (process.platform === "win32") {
    spawnSync("taskkill", ["/PID", String(server.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
  } else {
    server.kill("SIGTERM");
    await Promise.race([
      waitForExit(server),
      new Promise((resolve) => setTimeout(resolve, 5_000)),
    ]);
    if (server.exitCode === null) server.kill("SIGKILL");
  }
}

let preview;

try {
  // Reuse an already-running local preview during the edit loop. This avoids a
  // strict-port failure and removes redundant server startup from every smoke run.
  if (!process.env.PLAYWRIGHT_BASE_URL && !(await serverIsReady())) {
    preview = spawn(
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
      {
        cwd: root,
        env: { ...process.env, CI: "true" },
        stdio: "inherit",
        windowsHide: true,
      },
    );
    await waitForServer(preview);
  }

  const playwright = spawn(
    process.execPath,
    [
      path.join(root, "node_modules", "@playwright", "test", "cli.js"),
      "test",
      ...forwardedArgs,
    ],
    {
      cwd: root,
      env: process.env,
      stdio: "inherit",
      windowsHide: true,
    },
  );

  process.exitCode = await waitForExit(playwright);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  if (preview) await stopServer(preview);
}
