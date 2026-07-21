#!/usr/bin/env node

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectDir = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const storyboardPath = join(projectDir, "STORYBOARD.md");
const storyboard = readFileSync(storyboardPath, "utf8");

// Measured before deterministic tail-silence padding was applied to each WAV.
const spokenDurationByFrame = new Map([
  [1, 8.96],
  [2, 7.594667],
  [3, 9.664],
  [4, 4.458667],
  [5, 9.749333],
  [6, 9.066667],
  [7, 9.578667],
  [8, 16.746667],
]);

const sfxByFrame = new Map([
  [1, { file: "assets/sfx/whoosh-short.mp3", offset_s: 5.2, duration_s: 0.57, volume: 0.28 }],
  [2, { file: "assets/sfx/click-soft.mp3", offset_s: 2.2, duration_s: 0.37, volume: 0.24 }],
  [3, { file: "assets/sfx/error.mp3", offset_s: 5.4, duration_s: 1.62, volume: 0.24 }],
  [4, { file: "assets/sfx/click-soft.mp3", offset_s: 2.2, duration_s: 0.37, volume: 0.22 }],
  [5, { file: "assets/sfx/error.mp3", offset_s: 3.2, duration_s: 1.62, volume: 0.24 }],
  [6, { file: "assets/sfx/whoosh-short.mp3", offset_s: 6.6, duration_s: 0.57, volume: 0.26 }],
  [7, { file: "assets/sfx/chime.mp3", offset_s: 12.0, duration_s: 2.5, volume: 0.24 }],
  [8, { file: "assets/sfx/typing.mp3", offset_s: 4.0, duration_s: 1.5, volume: 0.18 }],
]);

const round = (value) => Number(value.toFixed(3));
const pad2 = (value) => String(value).padStart(2, "0");

function parseFrames(markdown) {
  const frames = [];
  const sections = markdown.split(/^## Frame /m).slice(1);
  for (const section of sections) {
    const number = Number(section.match(/^(\d+)/)?.[1]);
    const duration = Number(section.match(/^- duration:\s*([\d.]+)s?\s*$/m)?.[1]);
    const voiceover = section.match(/^- voiceover:\s*"([\s\S]*?)"\s*$/m)?.[1];
    if (!number || !Number.isFinite(duration) || !voiceover) {
      throw new Error(`Could not parse frame metadata near: ${section.slice(0, 80)}`);
    }
    frames.push({ number, duration, voiceover });
  }
  return frames;
}

function punctuationPause(token) {
  if (/[.!?]$/.test(token)) return 0.22;
  if (/[,;:]$/.test(token)) return 0.11;
  return 0.025;
}

function wordWeight(token) {
  const letters = token.replace(/[^A-Za-z0-9]/g, "").length;
  return Math.max(1, Math.pow(Math.max(letters, 1), 0.68));
}

function alignWords(text, spokenDuration) {
  const tokens = text.trim().split(/\s+/).filter(Boolean);
  const lead = 0.08;
  const tail = 0.05;
  const pauses = tokens.map(punctuationPause);
  const weights = tokens.map(wordWeight);
  const available = spokenDuration - lead - tail - pauses.reduce((a, b) => a + b, 0);
  const unit = available / weights.reduce((a, b) => a + b, 0);
  let cursor = lead;
  return tokens.map((textValue, index) => {
    const start = cursor;
    const end = Math.min(spokenDuration - tail, start + weights[index] * unit);
    cursor = end + pauses[index];
    return { id: `w${index}`, text: textValue, start: round(start), end: round(end) };
  });
}

const frames = parseFrames(storyboard);
const voices = frames.map((frame) => {
  const spokenDuration = spokenDurationByFrame.get(frame.number);
  if (!spokenDuration) throw new Error(`Missing measured speech duration for frame ${frame.number}`);
  return {
    frame: frame.number,
    path: `assets/voice/${pad2(frame.number)}.wav`,
    duration_s: frame.duration,
    spoken_duration_s: round(spokenDuration),
    words: alignWords(frame.voiceover, spokenDuration),
  };
});

const productMeta = {
  timing_method: "deterministic script alignment; ASR unavailable on this Windows host",
  bgm: null,
  voices,
  sfx: frames.map((frame) => ({ frame: frame.number, ...sfxByFrame.get(frame.number) })),
};

const engineMeta = {
  timing_method: productMeta.timing_method,
  tts_provider: "kokoro",
  voice_id: "am_michael",
  bgm: null,
  bgm_pending: false,
  bgm_provider: null,
  bgm_pid: null,
  bgm_log: null,
  bgm_mode: "none",
  bgm_target_duration_s: null,
  bgm_seed_duration_s: null,
  bgm_loop_count: null,
  voices: voices.map((voice) => ({
    id: pad2(voice.frame),
    path: voice.path,
    duration_s: voice.duration_s,
    spoken_duration_s: voice.spoken_duration_s,
    words: voice.words,
  })),
  sfx: productMeta.sfx.map(({ frame, ...cue }) => ({ id: pad2(frame), ...cue })),
  total_duration_s: round(frames.reduce((sum, frame) => sum + frame.duration, 0)),
};

writeFileSync(join(projectDir, "audio_meta.json"), `${JSON.stringify(productMeta, null, 2)}\n`);
writeFileSync(join(projectDir, "audio_engine_meta.json"), `${JSON.stringify(engineMeta, null, 2)}\n`);

const wordCount = voices.reduce((sum, voice) => sum + voice.words.length, 0);
console.log(`audio metadata: ${voices.length} voices, ${wordCount} words, ${engineMeta.total_duration_s}s`);
