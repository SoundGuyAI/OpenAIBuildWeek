#!/usr/bin/env node

import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { chromium } from "@playwright/test";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SCRIPT_DIR, "..");
const CONCEPTS_PATH = path.join(
  ROOT,
  "docs",
  "design",
  "game-concepts",
  "proposals.json",
);
const CONCEPTS_DIR = path.dirname(CONCEPTS_PATH);
const DEFAULT_OUTPUT = path.join(
  ROOT,
  "output",
  "pdf",
  "webxr-game-concept-proposals.pdf",
);

const COLORS = {
  navy: "#10141d",
  panel: "#171e2a",
  panelAlt: "#202a38",
  cream: "#f4f0e6",
  muted: "#b7c0cc",
  inkMuted: "#445064",
  cyan: "#31d9e6",
  tangerine: "#ff8a3d",
  jade: "#38d996",
  violet: "#9a6cff",
  magenta: "#f257a6",
  cobalt: "#478cff",
  ochre: "#d9a441",
};

const PLATES = [
  {
    file: "assets/generated/01-systems-agents-strategy.webp",
    title: "Systems, agents, and social strategy",
    accent: COLORS.cyan,
    alt: "Composite concept art showing spectral trains at left, a miniature treaty landscape at upper right, an agent workflow table at lower center, and a surreal dream factory at lower right.",
    callouts: [
      { number: 7, title: "Ghostline Dispatcher", left: 7, top: 49 },
      { number: 13, title: "Tiny Treaty Table", left: 69, top: 27 },
      { number: 1, title: "Loop Engineer", left: 42, top: 72 },
      { number: 14, title: "Dream Assembly Line", left: 77, top: 75 },
    ],
  },
  {
    file: "assets/generated/02-perception-evidence-invisible-worlds.webp",
    title: "Perception, evidence, and invisible worlds",
    accent: COLORS.violet,
    alt: "Composite concept art showing a sculpture museum at left, an echo-mapped cave at lower center, a rewinding artifact room at upper right, and an evidence-only creature habitat at lower right.",
    callouts: [
      { number: 6, title: "Museum of Stillness", left: 7, top: 47 },
      { number: 2, title: "Echo Cartographer", left: 42, top: 73 },
      { number: 8, title: "Reverse Archaeology", left: 67, top: 25 },
      { number: 18, title: "Invisible Zoo Keeper", left: 76, top: 74 },
    ],
  },
  {
    file: "assets/generated/03-forces-shadows-folds-scale.webp",
    title: "Forces, shadows, folds, and scale",
    accent: COLORS.cobalt,
    alt: "Composite concept art showing projected shadow structures at left, a folded rescue city at upper right, a gravity-thread constellation at lower center, and a scale-transfer puzzle at lower right.",
    callouts: [
      { number: 9, title: "Shadowwright", left: 7, top: 48 },
      { number: 19, title: "Origami Rescue", left: 66, top: 24 },
      { number: 3, title: "Gravity Loom", left: 42, top: 73 },
      { number: 20, title: "Size Thief", left: 77, top: 73 },
    ],
  },
  {
    file: "assets/generated/04-weather-ecology-light-cycles.webp",
    title: "Weather, ecology, light, and inherited cycles",
    accent: COLORS.jade,
    alt: "Composite concept art showing an evolving terrarium at left, a tabletop weather island at lower center, a clockwork sun room at upper right, and an inherited moon message machine at right.",
    callouts: [
      { number: 10, title: "Minute Garden", left: 7, top: 48 },
      { number: 4, title: "Pocket Weather Bureau", left: 42, top: 73 },
      { number: 17, title: "Second-Hand Sun", left: 68, top: 24 },
      { number: 16, title: "Message in a Moon", left: 78, top: 53 },
    ],
  },
  {
    file: "assets/generated/05-music-photography-language-improv.webp",
    title: "Music, photography, language, and improvisation",
    accent: COLORS.tangerine,
    alt: "Composite concept art showing an impossible portal photograph at left, a musical machine at center, luminous spatial language at upper center, and a genre-changing theater at right.",
    callouts: [
      { number: 11, title: "Portal Paparazzi", left: 7, top: 48 },
      { number: 5, title: "Choir Engine", left: 42, top: 61 },
      { number: 12, title: "Gesture Linguist", left: 47, top: 23 },
      { number: 15, title: "The Unreliable Stage", left: 78, top: 48 },
    ],
  },
];

const SHORTLIST = [
  "Loop Engineer",
  "Gravity Loom",
  "Tiny Treaty Table",
  "Origami Rescue",
  "Invisible Zoo Keeper",
];

const REQUIRED_FIELDS = [
  "id",
  "title",
  "category",
  "hook",
  "fantasy",
  "coreVerb",
  "gameLoop",
  "desktopControls",
  "mobileControls",
  "xrControls",
  "hackathonScope",
  "originalityRisk",
  "wowScore",
  "feasibilityScore",
  "plateImage",
];

function parseOutputPath(argv) {
  if (argv.length === 0) return DEFAULT_OUTPUT;
  if (argv.length === 1 && !argv[0].startsWith("-")) {
    return path.resolve(process.cwd(), argv[0]);
  }
  if (argv.length === 2 && ["--output", "-o"].includes(argv[0])) {
    return path.resolve(process.cwd(), argv[1]);
  }
  throw new Error(
    "Usage: node scripts/build-game-proposals-pdf.mjs [output.pdf]\n" +
      "   or: node scripts/build-game-proposals-pdf.mjs --output output.pdf",
  );
}

function stabilizePdfMetadata(pdfBytes) {
  const source = Buffer.from(pdfBytes).toString("latin1");
  const fixedDates = source.replace(
    /(\/(?:CreationDate|ModDate) \(D:)\d{14}([+-]\d{2}'\d{2}'|Z)(\))/g,
    (_match, prefix, timezone, suffix) =>
      `${prefix}20000101000000${timezone === "Z" ? "Z" : "+00'00'"}${suffix}`,
  );
  const fixedIds = fixedDates.replace(
    /(\/ID\s*\[<)([0-9A-Fa-f]+)(><)([0-9A-Fa-f]+)(>\])/g,
    (_match, prefix, firstId, separator, secondId, suffix) =>
      `${prefix}${"0".repeat(firstId.length)}${separator}${"0".repeat(secondId.length)}${suffix}`,
  );
  const stable = Buffer.from(fixedIds, "latin1");
  if (stable.length !== pdfBytes.length) {
    throw new Error("Deterministic PDF metadata normalization changed the byte length.");
  }
  return stable;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function ensureSentence(value) {
  const text = String(value).trim();
  return /[.!?]$/.test(text) ? text : `${text}.`;
}

function riskLabel(value) {
  const [label] = String(value).split(" - ");
  return label.trim().toUpperCase();
}

function mimeFor(filePath) {
  const extension = path.extname(filePath).toLowerCase();
  if (extension === ".webp") return "image/webp";
  if (extension === ".svg") return "image/svg+xml";
  throw new Error(`Unsupported image type: ${filePath}`);
}

async function dataUri(relativePath) {
  const absolutePath = path.join(CONCEPTS_DIR, relativePath);
  const bytes = await readFile(absolutePath);
  return `data:${mimeFor(absolutePath)};base64,${bytes.toString("base64")}`;
}

async function loadConcepts() {
  const parsed = JSON.parse(await readFile(CONCEPTS_PATH, "utf8"));
  if (!Array.isArray(parsed) || parsed.length !== 20) {
    throw new Error("proposals.json must contain exactly 20 concepts.");
  }

  const ids = new Set();
  const titles = new Set();
  parsed.forEach((concept, index) => {
    const missing = REQUIRED_FIELDS.filter((field) => !(field in concept));
    if (missing.length > 0) {
      throw new Error(`Concept ${index + 1} is missing: ${missing.join(", ")}`);
    }
    if (!Array.isArray(concept.gameLoop) || concept.gameLoop.length !== 4) {
      throw new Error(`Concept ${index + 1} must have exactly four loop beats.`);
    }
    if (ids.has(concept.id) || titles.has(concept.title)) {
      throw new Error(`Concept ${index + 1} has a duplicate id or title.`);
    }
    ids.add(concept.id);
    titles.add(concept.title);
  });

  if (parsed[0].title !== "Loop Engineer") {
    throw new Error("Loop Engineer must remain concept 01.");
  }

  const mappedNumbers = PLATES.flatMap((plate) =>
    plate.callouts.map((callout) => callout.number),
  );
  if (
    mappedNumbers.length !== 20 ||
    new Set(mappedNumbers).size !== 20 ||
    mappedNumbers.some((number) => number < 1 || number > 20)
  ) {
    throw new Error("Gallery callouts must map every concept number exactly once.");
  }

  PLATES.forEach((plate) => {
    plate.callouts.forEach((callout) => {
      const concept = parsed[callout.number - 1];
      if (concept.title !== callout.title) {
        throw new Error(
          `Callout ${callout.number} expected ${callout.title}, found ${concept.title}.`,
        );
      }
      if (concept.plateImage !== plate.file) {
        throw new Error(
          `${concept.title} points to ${concept.plateImage}, not ${plate.file}.`,
        );
      }
    });
  });

  return parsed;
}

function footer(pageNumber, label) {
  return `
    <footer class="page-footer" aria-label="Page ${pageNumber} of 8">
      <span>${escapeHtml(label)}</span>
      <span>${pageNumber} / 8</span>
    </footer>`;
}

function titleAtlas(concepts) {
  return concepts
    .map(
      (concept, index) => `
        <li>
          <span class="atlas-number">${String(index + 1).padStart(2, "0")}</span>
          <span>${escapeHtml(concept.title)}</span>
        </li>`,
    )
    .join("");
}

function loopMarkup(concept) {
  return concept.gameLoop
    .map((beat, index) => `<li><b>${index + 1}</b>${escapeHtml(beat)}</li>`)
    .join("");
}

function controlRow(label, className, value) {
  return `
    <div class="control-row ${className}">
      <strong>${label}</strong>
      <span>${escapeHtml(ensureSentence(value))}</span>
    </div>`;
}

function conceptCard(concept, number, accent) {
  const headingId = `concept-${String(number).padStart(2, "0")}`;
  return `
    <article class="concept-card" data-fit aria-labelledby="${headingId}" style="--accent:${accent}">
      <header class="concept-header">
        <span class="concept-number" aria-hidden="true">${String(number).padStart(2, "0")}</span>
        <div>
          <h2 id="${headingId}">${escapeHtml(concept.title)}</h2>
          <p class="category">${escapeHtml(concept.category)}</p>
        </div>
      </header>
      <p class="hook">${escapeHtml(ensureSentence(concept.hook))}</p>
      <p class="fantasy">${escapeHtml(ensureSentence(concept.fantasy))}</p>
      <ol class="micro-loop" aria-label="Four-step game loop">
        ${loopMarkup(concept)}
      </ol>
      <p class="parity"><strong>Same decision:</strong> ${escapeHtml(concept.coreVerb)}</p>
      <div class="controls" aria-label="Equivalent platform controls">
        ${controlRow("D", "desktop", concept.desktopControls)}
        ${controlRow("M", "mobile", concept.mobileControls)}
        ${controlRow("XR", "xr", concept.xrControls)}
      </div>
      <div class="scores" aria-label="Concept ratings">
        <span>WOW ${concept.wowScore}/5</span>
        <span>FEAS ${concept.feasibilityScore}/5</span>
        <span>${escapeHtml(riskLabel(concept.originalityRisk))} RISK</span>
      </div>
    </article>`;
}

function calloutMarkup(callout) {
  return `
    <div class="art-callout" style="left:${callout.left}%;top:${callout.top}%" aria-hidden="true">
      <span>${String(callout.number).padStart(2, "0")}</span>
      <b>${escapeHtml(callout.title)}</b>
    </div>`;
}

function galleryPage(plate, plateIndex, concepts, imageUri) {
  const galleryConcepts = plate.callouts.map(
    (callout) => concepts[callout.number - 1],
  );
  const galleryHeading = `gallery-${plateIndex + 1}-heading`;
  return `
    <section class="page gallery-page" aria-labelledby="${galleryHeading}" style="--accent:${plate.accent}">
      <div class="gallery-hero">
        <img src="${imageUri}" alt="${escapeHtml(plate.alt)}">
        <div class="image-shade" aria-hidden="true"></div>
        <header class="gallery-title">
          <p>GALLERY ${plateIndex + 1}</p>
          <h1 id="${galleryHeading}">${escapeHtml(plate.title)}</h1>
        </header>
        ${plate.callouts.map(calloutMarkup).join("")}
      </div>
      <div class="concept-grid">
        ${galleryConcepts
          .map((concept, index) =>
            conceptCard(concept, plate.callouts[index].number, plate.accent),
          )
          .join("")}
      </div>
      ${footer(plateIndex + 3, `Gallery ${plateIndex + 1} - one decision, three platform-native inputs`)}
    </section>`;
}

function shortlistItem(concept, rank) {
  return `
    <li class="shortlist-item">
      <span class="rank">${rank}</span>
      <div>
        <h2>${escapeHtml(concept.title)}</h2>
        <p>${escapeHtml(ensureSentence(concept.hackathonScope))}</p>
      </div>
    </li>`;
}

async function buildHtml(concepts) {
  const plateImages = await Promise.all(PLATES.map((plate) => dataUri(plate.file)));
  const [loopImage, platformImage, originalityImage, funnelImage] = await Promise.all([
    dataUri("infographics/universal-loop.svg"),
    dataUri("infographics/platform-braid.svg"),
    dataUri("infographics/originality-map.svg"),
    dataUri("infographics/shortlist-funnel.svg"),
  ]);
  const shortlist = SHORTLIST.map((title) => {
    const concept = concepts.find((candidate) => candidate.title === title);
    if (!concept) throw new Error(`Missing shortlist concept: ${title}`);
    return concept;
  });

  const galleries = PLATES.map((plate, index) =>
    galleryPage(plate, index, concepts, plateImages[index]),
  ).join("");

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Twenty worlds, one WebXR codebase</title>
  <style>
    :root {
      color-scheme: only light;
      --navy: ${COLORS.navy};
      --panel: ${COLORS.panel};
      --panel-alt: ${COLORS.panelAlt};
      --cream: ${COLORS.cream};
      --muted: ${COLORS.muted};
      --ink-muted: ${COLORS.inkMuted};
      --cyan: ${COLORS.cyan};
      --tangerine: ${COLORS.tangerine};
      --jade: ${COLORS.jade};
      --violet: ${COLORS.violet};
      --magenta: ${COLORS.magenta};
      --cobalt: ${COLORS.cobalt};
      --ochre: ${COLORS.ochre};
    }

    /* Chromium quantizes print dimensions to CSS pixels; 405.12pt emits 405pt. */
    @page { size: 720pt 405.12pt; margin: 0; }

    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; background: var(--navy); }
    body {
      width: 960px;
      color: var(--cream);
      font-family: Arial, "Helvetica Neue", sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    h1, h2, p, ol, ul, figure { margin: 0; }
    img { display: block; }
    .page {
      position: relative;
      width: 960px;
      height: 540px;
      overflow: hidden;
      break-after: page;
      page-break-after: always;
    }
    .page:last-child { break-after: auto; page-break-after: auto; }
    .page-footer {
      position: absolute;
      left: 28px;
      right: 28px;
      bottom: 0;
      height: 20px;
      border-top: 1px solid rgba(183, 192, 204, .35);
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: var(--muted);
      font-size: 8px;
      letter-spacing: .02em;
    }

    .cover {
      background:
        radial-gradient(circle at 76% 26%, rgba(154, 108, 255, .25), transparent 27%),
        radial-gradient(circle at 16% 18%, rgba(49, 217, 230, .18), transparent 29%),
        var(--navy);
      padding: 42px 34px 0;
    }
    .cover-eyebrow {
      color: var(--cyan);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: .13em;
    }
    .cover h1 {
      margin-top: 15px;
      max-width: 610px;
      font-size: 43px;
      line-height: .98;
      letter-spacing: -.035em;
    }
    .cover-subtitle {
      margin-top: 16px;
      max-width: 575px;
      color: var(--muted);
      font-size: 15px;
      line-height: 1.28;
    }
    .selection-rule {
      position: absolute;
      top: 42px;
      right: 34px;
      width: 272px;
      padding: 18px 18px 15px;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: 15px;
      background: rgba(32, 42, 56, .94);
      box-shadow: 0 16px 35px rgba(0,0,0,.24);
    }
    .selection-rule h2 { font-size: 16px; }
    .selection-rule ul {
      list-style: none;
      padding: 10px 0 0;
      display: grid;
      gap: 9px;
      font-size: 10px;
      color: var(--cream);
    }
    .selection-rule li { display: flex; align-items: center; gap: 9px; }
    .selection-rule li::before {
      content: "";
      width: 8px;
      height: 8px;
      flex: 0 0 8px;
      border-radius: 99px;
      background: var(--dot);
      box-shadow: 0 0 14px var(--dot);
    }
    .cover-plates {
      position: absolute;
      left: 34px;
      right: 34px;
      bottom: 43px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 8px;
    }
    .cover-plates figure {
      position: relative;
      height: 142px;
      border: 2px solid var(--plate-accent);
      border-radius: 10px;
      overflow: hidden;
      background: var(--panel);
      box-shadow: 0 11px 24px rgba(0,0,0,.3);
    }
    .cover-plates img { width: 100%; height: 100%; object-fit: cover; }
    .cover-plates figcaption {
      position: absolute;
      left: 6px;
      right: 6px;
      bottom: 6px;
      padding: 5px 7px;
      border-radius: 5px;
      background: rgba(16, 20, 29, .88);
      color: white;
      font-size: 7px;
      font-weight: 700;
      line-height: 1.16;
    }

    .parity-page {
      padding: 31px 34px 0;
      background: var(--cream);
      color: var(--navy);
    }
    .parity-page h1 { font-size: 28px; letter-spacing: -.025em; }
    .parity-lede { margin-top: 5px; color: var(--ink-muted); font-size: 10.5px; }
    .parity-visuals {
      margin-top: 14px;
      height: 214px;
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      gap: 12px;
    }
    .parity-visuals figure {
      padding: 8px;
      border: 1px solid rgba(16,20,29,.12);
      border-radius: 13px;
      background: white;
      box-shadow: 0 9px 22px rgba(16,20,29,.08);
    }
    .parity-visuals img { width: 100%; height: 170px; object-fit: contain; }
    .parity-visuals figcaption {
      padding: 3px 7px 0;
      color: var(--ink-muted);
      font-size: 7.5px;
      line-height: 1.2;
    }
    .atlas {
      margin-top: 15px;
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 6px 8px;
      list-style: none;
      padding: 0;
    }
    .atlas li {
      min-height: 30px;
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 7px;
      border-radius: 8px;
      background: var(--navy);
      color: var(--cream);
      font-size: 7.8px;
      font-weight: 700;
    }
    .atlas-number {
      display: grid;
      width: 20px;
      height: 20px;
      flex: 0 0 20px;
      place-items: center;
      border-radius: 99px;
      background: var(--cyan);
      color: var(--navy);
      font-size: 7px;
    }

    .gallery-page { background: var(--navy); }
    .gallery-hero { position: relative; height: 236px; overflow: hidden; }
    .gallery-hero > img { width: 100%; height: 100%; object-fit: cover; }
    .image-shade {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(180deg, rgba(16,20,29,.82) 0, rgba(16,20,29,.1) 33%, rgba(16,20,29,.28) 100%),
        linear-gradient(90deg, rgba(16,20,29,.18), transparent 24%, transparent 76%, rgba(16,20,29,.18));
    }
    .gallery-title { position: absolute; left: 28px; top: 18px; z-index: 2; }
    .gallery-title p {
      color: var(--accent);
      font-size: 8px;
      font-weight: 800;
      letter-spacing: .15em;
    }
    .gallery-title h1 {
      margin-top: 4px;
      color: white;
      font-size: 22px;
      letter-spacing: -.025em;
      text-shadow: 0 2px 14px rgba(0,0,0,.7);
    }
    .art-callout {
      position: absolute;
      z-index: 3;
      max-width: 178px;
      display: flex;
      align-items: center;
      gap: 6px;
      transform: translate(-50%, -50%);
      padding: 4px 7px 4px 4px;
      border: 1px solid rgba(255,255,255,.72);
      border-radius: 999px;
      background: rgba(16,20,29,.88);
      color: white;
      box-shadow: 0 4px 14px rgba(0,0,0,.42);
      white-space: nowrap;
    }
    .art-callout span {
      display: grid;
      width: 21px;
      height: 21px;
      flex: 0 0 21px;
      place-items: center;
      border-radius: 99px;
      background: var(--accent);
      color: var(--navy);
      font-size: 7px;
      font-weight: 900;
    }
    .art-callout b { font-size: 7.7px; letter-spacing: .01em; }
    .concept-grid {
      height: 284px;
      padding: 9px 28px 11px;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .concept-card {
      position: relative;
      min-width: 0;
      height: 264px;
      padding: 9px 9px 7px;
      border: 1px solid rgba(255,255,255,.08);
      border-top: 4px solid var(--accent);
      border-radius: 10px;
      background: var(--panel);
      box-shadow: 0 8px 17px rgba(0,0,0,.22);
      overflow: visible;
    }
    .concept-header { display: flex; align-items: center; gap: 7px; }
    .concept-number {
      display: grid;
      width: 24px;
      height: 24px;
      flex: 0 0 24px;
      place-items: center;
      border-radius: 99px;
      background: rgba(255,255,255,.09);
      color: var(--accent);
      font-size: 8px;
      font-weight: 900;
    }
    .concept-header h2 {
      color: white;
      font-size: 11px;
      line-height: 1.04;
      letter-spacing: -.01em;
    }
    .category {
      margin-top: 2px;
      color: var(--muted);
      font-size: 6px;
      line-height: 1.05;
      text-transform: uppercase;
      letter-spacing: .05em;
    }
    .hook {
      margin-top: 6px;
      color: var(--accent);
      font-size: 7.5px;
      font-weight: 800;
      line-height: 1.16;
    }
    .fantasy {
      margin-top: 3px;
      color: var(--cream);
      font-size: 6.7px;
      line-height: 1.17;
    }
    .micro-loop {
      margin-top: 5px;
      padding: 0;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 3px;
      list-style: none;
    }
    .micro-loop li {
      min-height: 20px;
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 3px 4px;
      border-radius: 5px;
      background: rgba(255,255,255,.055);
      color: var(--cream);
      font-size: 6.1px;
      line-height: 1.1;
    }
    .micro-loop b {
      display: grid;
      width: 12px;
      height: 12px;
      flex: 0 0 12px;
      place-items: center;
      border-radius: 99px;
      background: var(--accent);
      color: var(--navy);
      font-size: 5.5px;
    }
    .parity {
      margin-top: 5px;
      padding: 3px 5px;
      border-radius: 5px;
      background: var(--accent);
      color: var(--navy);
      font-size: 6.4px;
      line-height: 1.1;
      text-transform: uppercase;
      letter-spacing: .035em;
    }
    .controls { margin-top: 4px; display: grid; gap: 2px; }
    .control-row {
      display: grid;
      grid-template-columns: 18px 1fr;
      align-items: start;
      gap: 3px;
      color: var(--muted);
      font-size: 5.8px;
      line-height: 1.14;
    }
    .control-row strong {
      display: grid;
      min-height: 12px;
      place-items: center;
      border-radius: 3px;
      color: var(--navy);
      font-size: 5.3px;
    }
    .desktop strong { background: var(--cyan); }
    .mobile strong { background: var(--magenta); }
    .xr strong { background: var(--jade); }
    .scores {
      position: absolute;
      left: 9px;
      right: 9px;
      bottom: 6px;
      display: flex;
      justify-content: space-between;
      border-top: 1px solid rgba(255,255,255,.08);
      padding-top: 4px;
      color: var(--accent);
      font-size: 5.7px;
      font-weight: 800;
    }

    .shortlist-page {
      padding: 30px 34px 0;
      background: var(--cream);
      color: var(--navy);
    }
    .shortlist-page > h1 { font-size: 27px; letter-spacing: -.025em; }
    .shortlist-lede { margin-top: 5px; color: var(--ink-muted); font-size: 10px; }
    .shortlist-layout {
      margin-top: 14px;
      display: grid;
      grid-template-columns: .86fr 1.14fr;
      gap: 16px;
    }
    .shortlist-list { list-style: none; padding: 0; display: grid; gap: 7px; }
    .shortlist-item {
      min-height: 59px;
      display: grid;
      grid-template-columns: 28px 1fr;
      gap: 9px;
      align-items: start;
      padding: 8px 10px;
      border: 1px solid rgba(16,20,29,.1);
      border-radius: 10px;
      background: white;
      box-shadow: 0 5px 15px rgba(16,20,29,.06);
    }
    .rank {
      display: grid;
      width: 26px;
      height: 26px;
      place-items: center;
      border-radius: 99px;
      background: var(--cyan);
      font-size: 9px;
      font-weight: 900;
    }
    .shortlist-item h2 { font-size: 10px; }
    .shortlist-item p {
      margin-top: 3px;
      color: var(--ink-muted);
      font-size: 7px;
      line-height: 1.18;
    }
    .decision-visuals { display: grid; grid-template-rows: 225px 116px; gap: 8px; }
    .decision-visuals figure {
      padding: 7px;
      border-radius: 12px;
      background: white;
      box-shadow: 0 7px 18px rgba(16,20,29,.08);
    }
    .decision-visuals img { width: 100%; height: 100%; object-fit: contain; }
    .recommendation {
      position: absolute;
      left: 429px;
      right: 34px;
      bottom: 28px;
      padding: 7px 10px;
      border-left: 5px solid var(--tangerine);
      border-radius: 6px;
      background: var(--navy);
      color: var(--cream);
      font-size: 8px;
      line-height: 1.22;
    }
    .recommendation strong { color: var(--tangerine); }
  </style>
</head>
<body>
  <main aria-label="Twenty differentiated WebXR game concepts">
    <section class="page cover" aria-labelledby="cover-heading">
      <p class="cover-eyebrow">WEBXR HACKATHON CONCEPT PORTFOLIO</p>
      <h1 id="cover-heading">Twenty worlds.<br>One web codebase.</h1>
      <p class="cover-subtitle">Differentiated game concepts designed for equal desktop, touch, and immersive XR play.</p>
      <aside class="selection-rule" aria-labelledby="selection-heading">
        <h2 id="selection-heading">The selection rule</h2>
        <ul>
          <li style="--dot:var(--cyan)">Readable in 20 seconds</li>
          <li style="--dot:var(--tangerine)">Satisfying in 3 minutes</li>
          <li style="--dot:var(--jade)">Seated-first and one-handed</li>
          <li style="--dot:var(--violet)">Same decision on every platform</li>
        </ul>
      </aside>
      <div class="cover-plates" aria-label="Five concept-art galleries">
        ${PLATES.map(
          (plate, index) => `
            <figure style="--plate-accent:${plate.accent}">
              <img src="${plateImages[index]}" alt="${escapeHtml(plate.alt)}">
              <figcaption>Gallery ${index + 1}: ${escapeHtml(plate.title)}</figcaption>
            </figure>`,
        ).join("")}
      </div>
      ${footer(1, "Visual proposal - Azure FLUX.2-pro art and semantic information design")}
    </section>

    <section class="page parity-page" aria-labelledby="parity-heading">
      <h1 id="parity-heading">One loop, three inputs, twenty identities</h1>
      <p class="parity-lede">The gesture changes by device. The decision, information, consequence, and ending remain equivalent.</p>
      <div class="parity-visuals">
        <figure>
          <img src="${loopImage}" alt="A five-stage loop: read, choose, act, world responds, and learn before repeating.">
          <figcaption>Every proposal exposes cause and effect quickly enough to invite an informed retry.</figcaption>
        </figure>
        <figure>
          <img src="${platformImage}" alt="Desktop, mobile, and XR input lanes converge on one shared verb and the same world response.">
          <figcaption>Platform-native controls express the same player intent; no platform receives a reduced game.</figcaption>
        </figure>
      </div>
      <ol class="atlas" aria-label="All twenty concept titles">
        ${titleAtlas(concepts)}
      </ol>
      ${footer(2, "Platform contract - native input, shared decision, equal consequence")}
    </section>

    ${galleries}

    <section class="page shortlist-page" aria-labelledby="shortlist-heading">
      <h1 id="shortlist-heading">Shortlist the proof, not the premise</h1>
      <p class="shortlist-lede">Prototype one differentiating loop, test its visible consequence, and preserve a contrasting fallback.</p>
      <div class="shortlist-layout">
        <ol class="shortlist-list" aria-label="Five recommended prototypes">
          ${shortlist.map((concept, index) => shortlistItem(concept, index + 1)).join("")}
        </ol>
        <div class="decision-visuals">
          <figure>
            <img src="${originalityImage}" alt="A numbered map positions all twenty concepts by local-to-systemic action and puzzle certainty-to-expressive emergence.">
          </figure>
          <figure>
            <img src="${funnelImage}" alt="A funnel narrows twenty worlds to five prototypes and then one audience-tested loop.">
          </figure>
        </div>
      </div>
      <p class="recommendation"><strong>Recommended first build: Loop Engineer.</strong> Test whether players can define an outcome, delegate bounded work, inspect evidence, and improve the loop. Keep Gravity Loom as the low-text spectacle fallback.</p>
      ${footer(8, "Decision page - build one proof and preserve one contrasting fallback")}
    </section>
  </main>
</body>
</html>`;
}

async function assertLayout(page) {
  const problems = await page.evaluate(() => {
    const issues = [];
    const pages = [...document.querySelectorAll(".page")];
    if (pages.length !== 8) issues.push(`Expected 8 page sections; found ${pages.length}.`);

    for (const [index, pageElement] of pages.entries()) {
      const style = getComputedStyle(pageElement);
      if (pageElement.clientWidth !== 960 || pageElement.clientHeight !== 540) {
        issues.push(
          `Page ${index + 1} is ${pageElement.clientWidth}x${pageElement.clientHeight}, not 960x540.`,
        );
      }
      if (
        pageElement.scrollHeight > pageElement.clientHeight + 1 ||
        pageElement.scrollWidth > pageElement.clientWidth + 1
      ) {
        issues.push(`Page ${index + 1} overflows its print box (${style.overflow}).`);
      }
    }

    for (const element of document.querySelectorAll("[data-fit]")) {
      if (
        element.scrollHeight > element.clientHeight + 1 ||
        element.scrollWidth > element.clientWidth + 1
      ) {
        const title = element.querySelector("h2")?.textContent?.trim() ?? "Unknown card";
        issues.push(`${title} overflows its concept card.`);
      }
    }

    const headings = [...document.querySelectorAll("article.concept-card h2")].map(
      (heading) => heading.textContent.trim(),
    );
    if (headings.length !== 20 || new Set(headings).size !== 20) {
      issues.push(`Expected 20 unique gallery-card titles; found ${headings.length}.`);
    }

    if (document.documentElement.lang !== "en") {
      issues.push('The document language must be set to "en".');
    }

    for (const image of document.images) {
      if (!image.alt.trim()) issues.push("Every image must have meaningful alt text.");
      if (!image.complete || image.naturalWidth === 0) {
        issues.push(`Image failed to load: ${image.alt || "unnamed image"}.`);
      }
    }

    return issues;
  });

  if (problems.length > 0) {
    throw new Error(`PDF layout validation failed:\n- ${problems.join("\n- ")}`);
  }
}

async function buildPdf(outputPath) {
  const concepts = await loadConcepts();
  const html = await buildHtml(concepts);
  await mkdir(path.dirname(outputPath), { recursive: true });

  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 960, height: 540 } });
    await page.setContent(html, { waitUntil: "load" });
    await page.emulateMedia({ media: "print" });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all(
        [...document.images].map((image) =>
          image.complete ? Promise.resolve() : image.decode(),
        ),
      );
    });
    await assertLayout(page);

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      tagged: true,
      outline: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    await writeFile(outputPath, stabilizePdfMetadata(pdf));
  } finally {
    await browser.close();
  }

  process.stdout.write(`Built ${outputPath} (8 pages, tagged, outlined)\n`);
}

const outputPath = parseOutputPath(process.argv.slice(2));
await buildPdf(outputPath);
