import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CUES,
  assertMp3,
  buildSpeechRequest,
  requestSpeech,
  requireInteractiveTerminal,
  renderCredits,
  renderManifest,
} from "../../scripts/elevenlabs-narration.mjs";

test("buildSpeechRequest creates an ElevenLabs request without sending it", () => {
  const request = buildSpeechRequest(CUES[0], "secret-value");

  assert.equal(CUES.length, 12);
  assert.match(request.url, /wBXNqKUATyqu0RtYt25i/);
  assert.equal(request.init.headers["xi-api-key"], "secret-value");
  assert.throws(() => assertMp3(Buffer.from("not audio"), "cue.mp3"));
});

test("renderers describe static ElevenLabs MP3 assets without credentials", () => {
  const secret = "secret-value";
  const result = {
    ...CUES[0],
    fileName: "tutorial-intro.mp3",
    durationSeconds: 1.25,
    bytes: 1234,
    sha256: "0123456789abcdef",
  };

  const manifest = renderManifest([result]);
  const credits = renderCredits([result], "2026-07-21");

  assert.match(manifest, /audio\/narration\/tutorial-intro\.mp3/);
  assert.match(credits, /ElevenLabs/);
  assert.doesNotMatch(manifest, new RegExp(secret));
  assert.doesNotMatch(credits, new RegExp(secret));
});

test("requires a terminal prompt instead of accepting an environment key", () => {
  assert.throws(
    () => requireInteractiveTerminal({ stdinIsTTY: false, stdoutIsTTY: true }),
    /interactive terminal/i,
  );
});

test("passes the request URL and options separately to fetch", async () => {
  let received;
  await requestSpeech(
    async (...args) => {
      received = args;
      return { ok: true };
    },
    CUES[0],
    "secret-value",
  );

  assert.equal(received.length, 2);
  assert.match(received[0], /api\.elevenlabs\.io/);
  assert.equal(received[1].headers["xi-api-key"], "secret-value");
});

test("runtime narration manifest resolves the generated MP3 set", async () => {
  const manifest = await readFile(
    new URL("../../src/kaiju-qa/narration-manifest.ts", import.meta.url),
    "utf8",
  );

  assert.doesNotMatch(manifest, /audio\/narration\/[^\n"]+\.wav/);
  assert.equal((manifest.match(/audio\/narration\/[^\n"]+\.mp3/g) ?? []).length, 12);
});
