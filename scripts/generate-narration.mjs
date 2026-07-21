import { createHash } from "node:crypto";
import { mkdir, rename, rm, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import process from "node:process";

import {
  CUES,
  assertMp3,
  requireInteractiveTerminal,
  requestSpeech,
} from "./elevenlabs-narration.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = path.join(ROOT, "public", "audio", "narration");

function promptForValue(label, { hidden }) {
  requireInteractiveTerminal({
    stdinIsTTY: process.stdin.isTTY,
    stdoutIsTTY: process.stdout.isTTY,
  });

  return new Promise((resolve, reject) => {
    let value = "";
    const wasRaw = process.stdin.isRaw;

    const cleanup = () => {
      process.stdin.off("data", onData);
      process.stdin.setRawMode(wasRaw ?? false);
      process.stdin.pause();
    };

    const onData = (chunk) => {
      const input = chunk.toString("utf8");
      if (input === "\u0003") {
        cleanup();
        reject(new Error("ElevenLabs generation cancelled."));
      } else if (input === "\r" || input === "\n") {
        cleanup();
        process.stdout.write("\n");
        value ? resolve(value) : reject(new Error(`${label.trim()} is required.`));
      } else if (input === "\u007f" || input === "\b") {
        value = value.slice(0, -1);
        if (!hidden) process.stdout.write("\b \b");
      } else {
        value += input;
        if (!hidden) process.stdout.write(input);
      }
    };

    process.stdout.write(label);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.on("data", onData);
  });
}

async function generateCue(cue, apiKey, voiceId) {
  const response = await requestSpeech(fetch, cue, apiKey, voiceId);
  if (!response.ok) {
    throw new Error(`ElevenLabs failed for ${cue.id} with HTTP ${response.status}.`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  const fileName = `${cue.id}.mp3`;
  assertMp3(buffer, fileName);

  const target = path.join(OUTPUT_DIR, fileName);
  const temporary = path.join(OUTPUT_DIR, `${cue.id}.tmp.mp3`);
  await rm(temporary, { force: true });
  try {
    await writeFile(temporary, buffer);
    await rename(temporary, target);
  } finally {
    await rm(temporary, { force: true });
  }

  return { bytes: buffer.length, sha256: createHash("sha256").update(buffer).digest("hex") };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  let voiceId = await promptForValue("ElevenLabs voice ID: ", { hidden: false });
  let apiKey = await promptForValue("ElevenLabs API key (hidden): ", { hidden: true });
  try {
    for (const [index, cue] of CUES.entries()) {
      const result = await generateCue(cue, apiKey, voiceId);
      console.log(`[${index + 1}/${CUES.length}] ${cue.id}: ${result.bytes} bytes, ${result.sha256.slice(0, 12)}...`);
    }
  } finally {
    apiKey = "";
    voiceId = "";
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
