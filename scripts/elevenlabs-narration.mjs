export const CUES = Object.freeze([
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
]);

export const ELEVENLABS_NARRATION = Object.freeze({
  voiceId: "wBXNqKUATyqu0RtYt25i",
  modelId: "eleven_multilingual_v2",
  outputFormat: "mp3_44100_128",
});

export function requireInteractiveTerminal({ stdinIsTTY, stdoutIsTTY }) {
  if (!stdinIsTTY || !stdoutIsTTY) {
    throw new Error(
      "Run this generator from an interactive terminal so the API key can be entered securely.",
    );
  }
}

export function buildSpeechRequest(
  cue,
  apiKey,
  voiceId = ELEVENLABS_NARRATION.voiceId,
) {
  if (!apiKey) throw new Error("An ElevenLabs API key is required.");
  if (!voiceId) throw new Error("An ElevenLabs voice ID is required.");

  return {
    url: `https://api.elevenlabs.io/v1/text-to-speech/${encodeURIComponent(voiceId)}?output_format=${ELEVENLABS_NARRATION.outputFormat}`,
    init: {
      method: "POST",
      headers: {
        Accept: "audio/mpeg",
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text: cue.text,
        model_id: ELEVENLABS_NARRATION.modelId,
      }),
    },
  };
}

export function requestSpeech(fetchImpl, cue, apiKey, voiceId) {
  const { url, init } = buildSpeechRequest(cue, apiKey, voiceId);
  return fetchImpl(url, init);
}

export function assertMp3(buffer, fileName) {
  const startsWithId3 = buffer.subarray(0, 3).toString("ascii") === "ID3";
  const startsWithFrame =
    buffer.length >= 2 && buffer[0] === 0xff && (buffer[1] & 0xe0) === 0xe0;

  if (!startsWithId3 && !startsWithFrame) {
    throw new Error(`${fileName} is not a valid MP3 file.`);
  }
}

const MPEG1_BITRATES = {
  1: [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320],
  2: [0, 32, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320, 384],
  3: [0, 32, 64, 96, 128, 160, 192, 224, 256, 288, 320, 352, 384, 416, 448],
};

const MPEG2_BITRATES = {
  1: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  2: [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160],
  3: [0, 32, 48, 56, 64, 80, 96, 112, 128, 144, 160, 176, 192, 224, 256],
};

/**
 * Returns the duration represented by valid MPEG audio frames. ElevenLabs'
 * MP3 output is frame-based, so this avoids requiring ffmpeg or another
 * machine-specific audio tool for generation.
 */
export function getMp3DurationSeconds(buffer) {
  let offset = 0;
  let durationSeconds = 0;
  let frameCount = 0;

  while (offset + 4 <= buffer.length) {
    const header = buffer.readUInt32BE(offset);
    const hasSync = ((header & 0xffe00000) >>> 0) === 0xffe00000;
    const versionBits = (header >>> 19) & 0x3;
    const layerBits = (header >>> 17) & 0x3;
    const bitrateIndex = (header >>> 12) & 0xf;
    const sampleRateIndex = (header >>> 10) & 0x3;

    if (
      !hasSync ||
      versionBits === 1 ||
      layerBits === 0 ||
      bitrateIndex === 0 ||
      bitrateIndex === 15 ||
      sampleRateIndex === 3
    ) {
      offset += 1;
      continue;
    }

    const mpeg1 = versionBits === 3;
    const sampleRateDivisor = versionBits === 3 ? 1 : versionBits === 2 ? 2 : 4;
    const sampleRate = [44100, 48000, 32000][sampleRateIndex] / sampleRateDivisor;
    const bitrateKbps = (mpeg1 ? MPEG1_BITRATES : MPEG2_BITRATES)[layerBits][bitrateIndex];
    const padding = (header >>> 9) & 0x1;
    const layer1 = layerBits === 3;
    const layer3 = layerBits === 1;
    const samplesPerFrame = layer1 ? 384 : layer3 && !mpeg1 ? 576 : 1152;
    const frameCoefficient = layer1 ? 12 : layer3 && !mpeg1 ? 72 : 144;
    const frameLength = Math.floor(
      (frameCoefficient * bitrateKbps * 1000) / sampleRate + padding,
    ) * (layer1 ? 4 : 1);

    if (frameLength <= 4 || offset + frameLength > buffer.length) {
      offset += 1;
      continue;
    }

    durationSeconds += samplesPerFrame / sampleRate;
    frameCount += 1;
    offset += frameLength;
  }

  if (frameCount === 0) {
    throw new Error("MP3 duration could not be read from audio frames.");
  }

  return durationSeconds;
}

function formatNumber(value, digits = 3) {
  return Number(value.toFixed(digits)).toString();
}

export function renderManifest(
  results,
  voiceId = ELEVENLABS_NARRATION.voiceId,
) {
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

  return `/* This file is generated by scripts/generate-narration.mjs. */

export const NARRATION_GENERATION = {
  provider: "ElevenLabs",
  voiceId: ${JSON.stringify(voiceId)},
  modelId: ${JSON.stringify(ELEVENLABS_NARRATION.modelId)},
  outputFormat: ${JSON.stringify(ELEVENLABS_NARRATION.outputFormat)},
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

export function renderCredits(
  results,
  generatedAt,
  voiceId = ELEVENLABS_NARRATION.voiceId,
) {
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
MP3 files are pre-generated runtime assets; the game does not synthesize speech
in the browser and does not require ElevenLabs at runtime.

## Provider and model provenance

- Provider: ElevenLabs
- Voice ID: \`${voiceId}\`
- Model: \`${ELEVENLABS_NARRATION.modelId}\`
- Delivery format: \`${ELEVENLABS_NARRATION.outputFormat}\`
- Total authored narration: ${totalDuration.toFixed(3)} seconds across ${results.length} clips
- Reproduction entry point: \`node scripts/generate-narration.mjs\`

These MP3s contain newly synthesized performances of text authored for Kaiju QA.
No third-party music, field recording, actor recording, or franchise audio is
redistributed in this narration set. Keep this credit file with redistributed
builds that include the generated clips.

## Generated clips

| Cue ID | File | Duration | SHA-256 | Script |
| --- | --- | ---: | --- | --- |
${rows}
`;
}
