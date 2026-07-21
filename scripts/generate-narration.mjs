import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
} from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUTPUT_DIR = path.join(ROOT, "public", "audio", "narration");
const MANIFEST_PATH = path.join(
  ROOT,
  "src",
  "kaiju-qa",
  "narration-manifest.ts",
);
const CREDITS_PATH = path.join(ROOT, "docs", "assets", "AUDIO_CREDITS.md");

const VOICE = "bf_emma";
const SPEED = 0.92;
const PYTHON = "C:\\Python313\\python.exe";

const CUES = [
  {
    id: "tutorial-intro",
    text: "Welcome to Kaiju QA. This little helper means well. Your job is to prove it is safe.",
  },
  {
    id: "place-car",
    text: "Grab the stalled car and snap it into the glowing street.",
  },
  {
    id: "baseline",
    text: "Pull the test lever. One happy path is not permission to ship.",
  },
  {
    id: "place-tower",
    text: "Place the fragile tower beside the route. Same behavior, tougher evidence.",
  },
  {
    id: "tower-fail",
    text: "The tower failed. Try the broad freeze rule, then rerun every test.",
  },
  {
    id: "regression",
    text: "Tower safe. Ambulance blocked. The fix broke an old pass.",
  },
  {
    id: "targeted",
    text: "Swap in the striped slow zone. Change only where the hazard exists.",
  },
  {
    id: "release",
    text: "Three passes, no regressions. Press the release stamp.",
  },
  {
    id: "school",
    text: "School crossing. Protect walkers without slowing the emergency route.",
  },
  {
    id: "harbor",
    text: "Harbor load test. Check the heavy cargo boundary, not just the easy crate.",
  },
  {
    id: "storm",
    text: "Storm shift. Add the rain condition and preserve every rescue route.",
  },
  {
    id: "finale",
    text: "Evidence accepted. Release earned. Our baby kaiju is ready for the city.",
  },
];

function runNpx(args, { label }) {
  const env = {
    ...process.env,
    HYPERFRAMES_PYTHON: PYTHON,
  };
  const options = {
    cwd: ROOT,
    env,
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true,
  };

  const result =
    process.platform === "win32"
      ? spawnSync(
          process.env.ComSpec ?? "cmd.exe",
          ["/d", "/s", "/c", "npx", ...args],
          options,
        )
      : spawnSync("npx", args, options);

  if (result.error) {
    throw new Error(`${label} could not start: ${result.error.message}`);
  }
  if (result.status !== 0) {
    const details = [result.stdout, result.stderr]
      .filter(Boolean)
      .join("\n")
      .trim();
    throw new Error(
      `${label} failed with exit code ${result.status}.${details ? `\n${details}` : ""}`,
    );
  }

  return `${result.stdout ?? ""}\n${result.stderr ?? ""}`.trim();
}

function readWavMetadata(buffer, fileName) {
  if (
    buffer.length < 44 ||
    buffer.toString("ascii", 0, 4) !== "RIFF" ||
    buffer.toString("ascii", 8, 12) !== "WAVE"
  ) {
    throw new Error(`${fileName} is not a valid RIFF/WAVE file.`);
  }

  let offset = 12;
  let format;
  let dataBytes;

  while (offset + 8 <= buffer.length) {
    const chunkId = buffer.toString("ascii", offset, offset + 4);
    const chunkSize = buffer.readUInt32LE(offset + 4);
    const chunkStart = offset + 8;
    const chunkEnd = chunkStart + chunkSize;

    if (chunkEnd > buffer.length) {
      throw new Error(`${fileName} contains a truncated ${chunkId} chunk.`);
    }

    if (chunkId === "fmt " && chunkSize >= 16) {
      format = {
        audioFormat: buffer.readUInt16LE(chunkStart),
        channels: buffer.readUInt16LE(chunkStart + 2),
        sampleRate: buffer.readUInt32LE(chunkStart + 4),
        byteRate: buffer.readUInt32LE(chunkStart + 8),
        bitsPerSample: buffer.readUInt16LE(chunkStart + 14),
      };
    } else if (chunkId === "data") {
      dataBytes = chunkSize;
    }

    offset = chunkEnd + (chunkSize % 2);
  }

  if (!format || dataBytes === undefined || format.byteRate <= 0) {
    throw new Error(`${fileName} is missing usable WAV format or data metadata.`);
  }

  const durationSeconds = dataBytes / format.byteRate;
  if (!Number.isFinite(durationSeconds) || durationSeconds <= 0) {
    throw new Error(`${fileName} has an invalid duration.`);
  }

  return {
    ...format,
    dataBytes,
    durationSeconds,
  };
}

function formatNumber(value, digits = 3) {
  return Number(value.toFixed(digits)).toString();
}

function renderManifest(results, toolVersion) {
  const cueIds = results.map(({ id }) => `  ${JSON.stringify(id)},`).join("\n");
  const entries = results
    .map(
      ({ id, text, fileName, durationSeconds, bytes, sha256 }) => `  ${JSON.stringify(id)}: {
    id: ${JSON.stringify(id)},
    fileName: ${JSON.stringify(fileName)},
    src: ${JSON.stringify(`audio/narration/${fileName}`)},
    text: ${JSON.stringify(text)},
    durationSeconds: ${formatNumber(durationSeconds)},
    bytes: ${bytes},
    sha256: ${JSON.stringify(sha256)},
  },`,
    )
    .join("\n");
  const totalDuration = results.reduce(
    (sum, result) => sum + result.durationSeconds,
    0,
  );
  const format = results[0];

  return `/* This file is generated by scripts/generate-narration.mjs. */

export const NARRATION_GENERATION = {
  tool: "hyperframes tts",
  toolVersion: ${JSON.stringify(toolVersion)},
  engine: "Kokoro-82M",
  voice: ${JSON.stringify(VOICE)},
  speed: ${SPEED},
  format: {
    channels: ${format.channels},
    sampleRate: ${format.sampleRate},
    bitsPerSample: ${format.bitsPerSample},
  },
} as const;

export const NARRATION_CUE_IDS = [
${cueIds}
] as const;

export type NarrationCueId = (typeof NARRATION_CUE_IDS)[number];

export interface NarrationCue {
  readonly id: NarrationCueId;
  readonly fileName: string;
  /** Relative to the deployed document, so Vite base paths and GitHub Pages work. */
  readonly src: string;
  readonly text: string;
  readonly durationSeconds: number;
  readonly bytes: number;
  readonly sha256: string;
}

export const NARRATION_MANIFEST = {
${entries}
} as const satisfies Readonly<Record<NarrationCueId, NarrationCue>>;

export const NARRATION_TOTAL_DURATION_SECONDS = ${formatNumber(totalDuration)};

const NARRATION_CUE_ID_SET = new Set<string>(NARRATION_CUE_IDS);

export function isNarrationCueId(value: string): value is NarrationCueId {
  return NARRATION_CUE_ID_SET.has(value);
}

export function getNarrationCue(cueId: NarrationCueId): NarrationCue {
  return NARRATION_MANIFEST[cueId];
}
`;
}

function escapeMarkdown(value) {
  return String(value).replaceAll("|", "\\|").replaceAll("\n", " ");
}

function renderCredits(results, toolVersion, generatedAt) {
  const totalDuration = results.reduce(
    (sum, result) => sum + result.durationSeconds,
    0,
  );
  const rows = results
    .map(
      ({ id, fileName, durationSeconds, text, sha256 }) =>
        `| \`${escapeMarkdown(id)}\` | \`${escapeMarkdown(fileName)}\` | ${durationSeconds.toFixed(3)} s | \`${sha256.slice(0, 12)}...\` | ${escapeMarkdown(text)} |`,
    )
    .join("\n");

  return `# Kaiju QA narration audio credits

Generated ${generatedAt} from project-authored English narration. The committed
WAV files are pre-generated runtime assets; the game does not synthesize speech
in the browser and does not require a TTS service or model download at runtime.

## Tool and model provenance

- Command: \`npx --yes=false hyperframes tts <script.txt> --output <cue.wav> --voice ${VOICE} --speed ${SPEED} --json\`
- Environment: \`HYPERFRAMES_PYTHON=${PYTHON}\`
- Tool: HyperFrames CLI \`${toolVersion}\`, local/offline \`tts\` command (Apache-2.0)
- Synthesis engine: Kokoro-82M
- Voice preset: \`${VOICE}\` (Emma, British English)
- Model bundle: \`kokoro-v1.0.onnx\` and \`voices-v1.0.bin\` from the
  \`thewh1teagle/kokoro-onnx\` \`model-files-v1.0\` release
- Delivery format: ${results[0].sampleRate} Hz, ${results[0].channels} channel, ${results[0].bitsPerSample}-bit WAV
- Total authored narration: ${totalDuration.toFixed(3)} seconds across ${results.length} clips
- Reproduction entry point: \`node scripts/generate-narration.mjs\`

HyperFrames is Apache-2.0 licensed. Its local TTS implementation uses the
MIT-licensed \`kokoro-onnx\` wrapper and downloads that project's v1.0 ONNX model
and voice bundle. The underlying Kokoro-82M model card declares the model and
weights Apache-2.0. Provenance and license references:

- https://github.com/heygen-com/hyperframes/blob/main/LICENSE
- https://github.com/thewh1teagle/kokoro-onnx/blob/main/LICENSE
- https://github.com/thewh1teagle/kokoro-onnx/releases/tag/model-files-v1.0
- https://huggingface.co/hexgrad/Kokoro-82M
- https://github.com/hexgrad/kokoro/blob/main/LICENSE

These WAVs contain newly synthesized performances of text authored for Kaiju QA.
No third-party music, field recording, actor recording, or franchise audio is
redistributed in this narration set. Keep this credit file with redistributed
builds that include the generated clips.

## Generated clips

| Cue ID | File | Duration | SHA-256 | Script |
| --- | --- | ---: | --- | --- |
${rows}
`;
}

async function synthesizeCue(cue) {
  const fileName = `${cue.id}.wav`;
  const outputPath = path.join(OUTPUT_DIR, fileName);
  const temporaryOutputPath = path.join(OUTPUT_DIR, `${cue.id}.tmp.wav`);
  const temporaryTextPath = path.join(OUTPUT_DIR, `${cue.id}.tmp.txt`);

  await rm(temporaryOutputPath, { force: true });
  await writeFile(temporaryTextPath, `${cue.text}\n`, "utf8");

  try {
    runNpx(
      [
        "--yes=false",
        "hyperframes",
        "tts",
        temporaryTextPath,
        "--output",
        temporaryOutputPath,
        "--voice",
        VOICE,
        "--speed",
        String(SPEED),
        "--json",
      ],
      { label: `Narration cue ${cue.id}` },
    );

    const buffer = await readFile(temporaryOutputPath);
    const wav = readWavMetadata(buffer, fileName);
    const fileStat = await stat(temporaryOutputPath);
    const sha256 = createHash("sha256").update(buffer).digest("hex");

    await rm(outputPath, { force: true });
    await rename(temporaryOutputPath, outputPath);

    return {
      ...cue,
      ...wav,
      fileName,
      bytes: fileStat.size,
      sha256,
    };
  } finally {
    await rm(temporaryTextPath, { force: true });
    await rm(temporaryOutputPath, { force: true });
  }
}

async function inspectGeneratedCue(cue) {
  const fileName = `${cue.id}.wav`;
  const outputPath = path.join(OUTPUT_DIR, fileName);
  const buffer = await readFile(outputPath);
  const wav = readWavMetadata(buffer, fileName);
  const fileStat = await stat(outputPath);
  const sha256 = createHash("sha256").update(buffer).digest("hex");

  return {
    ...cue,
    ...wav,
    fileName,
    bytes: fileStat.size,
    sha256,
  };
}

async function main() {
  await mkdir(OUTPUT_DIR, { recursive: true });
  await mkdir(path.dirname(MANIFEST_PATH), { recursive: true });
  await mkdir(path.dirname(CREDITS_PATH), { recursive: true });

  const helpOutput = runNpx(
    ["--yes=false", "hyperframes", "tts", "--help"],
    { label: "HyperFrames TTS version check" },
  );
  const toolVersion = helpOutput.match(/hyperframes tts v([0-9.]+)/i)?.[1];
  if (!toolVersion) {
    throw new Error("Could not determine the HyperFrames TTS version.");
  }

  if (process.argv.includes("--verify")) {
    const results = [];
    for (const cue of CUES) results.push(await inspectGeneratedCue(cue));
    const expectedManifest = renderManifest(results, toolVersion);
    const actualManifest = await readFile(MANIFEST_PATH, "utf8");
    if (actualManifest !== expectedManifest) {
      throw new Error(
        "Narration manifest does not match the generated WAV files. Regenerate the narration set.",
      );
    }
    console.log(
      `Verified ${results.length} narration WAVs and ${path.relative(ROOT, MANIFEST_PATH)}.`,
    );
    return;
  }

  console.log(
    `Generating ${CUES.length} narration clips with HyperFrames ${toolVersion}, ${VOICE} at ${SPEED}x.`,
  );

  const results = [];
  for (const [index, cue] of CUES.entries()) {
    const result = await synthesizeCue(cue);
    results.push(result);
    console.log(
      `[${index + 1}/${CUES.length}] ${cue.id}: ${result.durationSeconds.toFixed(3)}s, ${result.bytes} bytes`,
    );
  }

  const firstFormat = results[0];
  for (const result of results.slice(1)) {
    if (
      result.channels !== firstFormat.channels ||
      result.sampleRate !== firstFormat.sampleRate ||
      result.bitsPerSample !== firstFormat.bitsPerSample
    ) {
      throw new Error(
        `${result.fileName} does not match the narration set's WAV format.`,
      );
    }
  }

  const generatedAt = new Date().toISOString().slice(0, 10);
  await writeFile(
    MANIFEST_PATH,
    renderManifest(results, toolVersion),
    "utf8",
  );
  await writeFile(
    CREDITS_PATH,
    renderCredits(results, toolVersion, generatedAt),
    "utf8",
  );

  const totalDuration = results.reduce(
    (sum, result) => sum + result.durationSeconds,
    0,
  );
  console.log(
    `Wrote ${path.relative(ROOT, MANIFEST_PATH)} and ${path.relative(ROOT, CREDITS_PATH)}.`,
  );
  console.log(
    `Narration complete: ${results.length} clips, ${totalDuration.toFixed(3)} seconds total.`,
  );
}

main().catch((error) => {
  console.error(error instanceof Error ? error.stack ?? error.message : error);
  process.exitCode = 1;
});
