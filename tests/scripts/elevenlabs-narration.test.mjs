import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import {
  CUES,
  assertMp3,
  buildSpeechRequest,
  getMp3DurationSeconds,
  requestSpeech,
  requireInteractiveTerminal,
  renderCredits,
  renderManifest,
} from "../../scripts/elevenlabs-narration.mjs";

test("buildSpeechRequest creates an ElevenLabs request without sending it", () => {
  const voiceId = "voice-id-for-test";
  const request = buildSpeechRequest(CUES[0], "secret-value", voiceId);

  assert.equal(CUES.length, 12);
  assert.match(request.url, new RegExp(voiceId));
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

  const voiceId = "voice-id-for-test";
  const manifest = renderManifest([result], voiceId);
  const credits = renderCredits([result], "2026-07-21", voiceId);

  assert.match(manifest, /audio\/narration\/tutorial-intro\.mp3/);
  assert.match(credits, /ElevenLabs/);
  assert.match(manifest, new RegExp(voiceId));
  assert.match(credits, new RegExp(voiceId));
  assert.doesNotMatch(manifest, new RegExp(secret));
  assert.doesNotMatch(credits, new RegExp(secret));
});

test("calculates an MP3 duration from its audio frame headers", () => {
  const frameLength = 417;
  const frame = Buffer.alloc(frameLength);
  frame.set([0xff, 0xfb, 0x90, 0x00]);
  const audio = Buffer.concat([frame, frame]);

  assert.equal(getMp3DurationSeconds(audio), (2 * 1152) / 44100);
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
