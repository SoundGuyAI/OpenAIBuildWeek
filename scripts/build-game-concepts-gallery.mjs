#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DESIGN_DIR = path.join(ROOT, "docs/design/game-concepts");
const DEFAULT_OUTPUT = path.join(ROOT, "public/designs/index.html");
const SHORTLIST = new Set([
  "Loop Engineer",
  "Gravity Loom",
  "Tiny Treaty Table",
  "Origami Rescue",
  "Invisible Zoo Keeper",
]);

const PLATES = [
  ["assets/generated/01-systems-agents-strategy.webp", "Systems, agents, and social strategy", "#31d9e6", "A ghost-train station, three miniature treaty islands, and two people routing a red task through a circular agent-workflow table."],
  ["assets/generated/02-perception-evidence-invisible-worlds.webp", "Perception, evidence, and invisible worlds", "#9a6cff", "A frozen museum exhibit, a glowing moth revealing an invisible cave, a reconstructed artifact chamber, and a keeper reading traces in a frosted habitat."],
  ["assets/generated/03-forces-shadows-folds-scale.webp", "Forces, shadows, folds, and scale", "#478cff", "Geometric sculptures casting a walkable shadow bridge, folded paper streets, glowing gravity threads, and a brass device transferring size between objects."],
  ["assets/generated/04-weather-ecology-light-cycles.webp", "Weather, ecology, light, and inherited cycles", "#38d996", "A generational terrarium, a hand steering weather over a tiny island, a clock-driven sun opening a flower, and a repaired moon-message machine."],
  ["assets/generated/05-music-photography-language-improv.webp", "Music, photography, language, and improvisation", "#ff8a3d", "A photographer framing a moon portal, a conducted music factory, an alien tracing a spatial phrase, and an actor improvising in a transforming room."],
];

const html = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function outputFrom(args) {
  if (!args.length) return DEFAULT_OUTPUT;
  const value = args[0] === "--output" ? args[1] : args[0];
  if (!value) throw new Error("--output requires a path");
  return path.resolve(ROOT, value);
}

function family(category) {
  if (/education|automation|logistics|strategy|ecosystem|simulation|relay/i.test(category)) return "Systems";
  if (/performance|rhythm|photography|language/i.test(category)) return "Expression";
  if (/deduction|stealth|exploration|creature/i.test(category)) return "Discovery";
  return "Spatial puzzles";
}

async function imageUri(relativePath) {
  const bytes = await readFile(path.join(DESIGN_DIR, relativePath));
  return `data:image/webp;base64,${bytes.toString("base64")}`;
}

function assetLink(asset, label) {
  const availability = asset.availability ?? "Free full pack";
  return `<a class="asset-link" href="${html(asset.url)}" target="_blank" rel="noreferrer"><span>${label}</span><b>${html(asset.name)}</b><small>${html(asset.source)} - ${html(asset.license)}</small><small class="availability">${html(availability)}</small><em>${html(asset.use)}</em></a>`;
}

function card(concept, assets, index, accent) {
  const risk = concept.originalityRisk.split(" - ")[0];
  const isRecommended = concept.title === "Loop Engineer";
  const isShortlist = SHORTLIST.has(concept.title);
  const search = [concept.title, concept.category, concept.hook, concept.fantasy, concept.coreVerb,
    family(concept.category), assets.primary.name, assets.supporting.name].join(" ").toLowerCase();
  return `<article class="concept-card${isRecommended ? " is-recommended" : ""}" data-card data-search="${html(search)}" data-family="${html(family(concept.category))}" data-risk="${html(risk)}" data-shortlist="${isShortlist}" style="--accent:${accent}">
    <div class="card-heading"><span class="card-top"><span class="number">${String(index + 1).padStart(2, "0")}</span><span class="verb">${html(concept.coreVerb)}</span></span><span class="badges">${isRecommended ? '<span class="badge recommended">Recommended first build</span>' : isShortlist ? '<span class="badge">Shortlist</span>' : ""}</span><h2>${html(concept.title)}</h2><span class="category">${html(concept.category)}</span></div>
    <button class="card-open" type="button" data-open="${index}" data-concept-id="${html(concept.id)}" aria-haspopup="dialog" aria-label="Open ${html(concept.title)} details">
      <span class="hook">${html(concept.hook)}</span>
      <span class="mini-loop">${concept.gameLoop.map((beat, beatIndex) => `<span><i>${beatIndex + 1}</i>${html(beat)}</span>`).join("")}</span>
      <span class="asset-peek"><small>Prototype with</small><b>${html(assets.primary.name)}</b></span>
      <span class="scores"><span>WOW ${concept.wowScore}/5</span><span>FEAS ${concept.feasibilityScore}/5</span><span>${html(risk)} risk</span></span>
    </button></article>`;
}

function staticDetail(concept, assets, index) {
  const risk = concept.originalityRisk.split(" - ")[0];
  return `<article class="static-concept"><h2>${String(index + 1).padStart(2, "0")} - ${html(concept.title)}</h2><p><b>${html(concept.hook)}</b></p><p>${html(concept.fantasy)}</p><h3>Four-step loop</h3><ol>${concept.gameLoop.map((beat) => `<li>${html(beat)}</li>`).join("")}</ol><h3>Platform controls</h3><p><b>Desktop:</b> ${html(concept.desktopControls)}</p><p><b>Mobile:</b> ${html(concept.mobileControls)}</p><p><b>XR:</b> ${html(concept.xrControls)}</p><h3>Free asset starter kit</h3><p><a href="${html(assets.primary.url)}">${html(assets.primary.name)}</a> (${html(assets.primary.license)}; ${html(assets.primary.availability ?? "free full pack")}) and <a href="${html(assets.supporting.url)}">${html(assets.supporting.name)}</a> (${html(assets.supporting.license)}; ${html(assets.supporting.availability ?? "free full pack")}).</p><p><b>Still custom:</b> ${html(assets.custom)}</p><h3>Design notes</h3><p><b>Difference:</b> ${html(concept.whyDifferent)}</p><p><b>Comfort:</b> ${html(concept.comfort)}</p><p><b>Hackathon proof:</b> ${html(concept.hackathonScope)}</p><p><b>${html(risk)} originality risk.</b> ${html(concept.technicalRisk)}</p></article>`;
}

function detail(concept, assets, index) {
  const risk = concept.originalityRisk.split(" - ")[0];
  return `<dialog class="concept-dialog" data-dialog="${index}" aria-labelledby="dialog-title-${index}"><div class="dialog-shell">
    <button class="dialog-close" type="button" data-close>Close</button>
    <p class="eyebrow">${String(index + 1).padStart(2, "0")} / ${html(concept.category)}</p>
    <h2 id="dialog-title-${index}">${html(concept.title)}</h2><p class="dialog-hook">${html(concept.hook)}</p><p class="fantasy">${html(concept.fantasy)}</p>
    <section><h3>The first 20 seconds</h3><p>${html(concept.first20Seconds)}</p></section>
    <section><h3>The loop</h3><ol class="dialog-loop">${concept.gameLoop.map((beat) => `<li>${html(beat)}</li>`).join("")}</ol></section>
    <section class="platform-grid"><h3>Same decision, three inputs</h3><p><b>Desktop</b>${html(concept.desktopControls)}</p><p><b>Mobile</b>${html(concept.mobileControls)}</p><p><b>XR</b>${html(concept.xrControls)}</p></section>
    <section><h3>Free asset starter kit</h3><div class="asset-grid">${assetLink(assets.primary, "Primary pack")}${assetLink(assets.supporting, "Supporting pack")}</div><p class="custom-work"><b>Still custom:</b> ${html(assets.custom)}</p></section>
    <section class="detail-grid"><div><h3>What makes it different</h3><p>${html(concept.whyDifferent)}</p></div><div><h3>Hackathon proof</h3><p>${html(concept.hackathonScope)}</p></div><div><h3>Comfort</h3><p>${html(concept.comfort)}</p></div><div><h3>Risk</h3><p><b>${html(risk)} originality risk.</b> ${html(concept.technicalRisk)}</p></div></section>
  </div></dialog>`;
}

function styles() {
  return `:root{color-scheme:dark;--bg:#0a1019;--panel:#141d2a;--panel2:#1b2737;--ink:#f6f1e8;--muted:#afbac8;--line:#34455b;--cyan:#31d9e6;font-family:Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:radial-gradient(circle at 80% 0,#1c2b3f 0,transparent 34rem),var(--bg);color:var(--ink)}button,input,select{font:inherit}.wrap{width:min(1440px,calc(100% - 2rem));margin:auto}.skip{position:absolute;left:-999px;top:0;background:#fff;color:#000;padding:.7rem;z-index:99}.skip:focus{left:1rem}.hero{padding:clamp(2.5rem,7vw,7rem) 0 2rem}.eyebrow{margin:0 0 .7rem;color:var(--cyan);font-size:.75rem;font-weight:900;letter-spacing:.18em;text-transform:uppercase}.hero h1{font-size:clamp(3.4rem,9vw,8rem);line-height:.83;letter-spacing:-.08em;margin:0;max-width:12ch}.hero h1 span{display:block;color:transparent;-webkit-text-stroke:1px #718299}.lede{max-width:68ch;font-size:clamp(1rem,2vw,1.3rem);color:var(--muted);line-height:1.6}.hero-actions{display:flex;gap:.8rem;flex-wrap:wrap;margin-top:1.4rem}.link{display:inline-flex;border:1px solid var(--line);border-radius:999px;padding:.75rem 1rem;text-decoration:none;color:inherit;font-weight:800}.link.primary{background:var(--cyan);color:#071016;border-color:var(--cyan)}.stats{display:grid;grid-template-columns:repeat(4,1fr);gap:.7rem;margin:2rem 0}.stat{background:linear-gradient(135deg,#172230,#101722);border:1px solid var(--line);border-radius:1rem;padding:1rem}.stat b{display:block;font-size:2rem;color:var(--cyan)}.showcase{display:grid;grid-template-columns:minmax(13rem,22rem) 1fr;gap:1rem}.plate-tabs{display:grid;gap:.55rem}.plate-tab{color:inherit;background:var(--panel);border:1px solid var(--line);border-left:5px solid var(--accent);border-radius:.8rem;padding:.8rem;text-align:left;cursor:pointer}.plate-tab span{display:block;color:var(--accent);font-size:.7rem;text-transform:uppercase;font-weight:900;letter-spacing:.12em}.plate-tab b{display:block;margin-top:.25rem}.plate-tab.active{background:var(--panel2);outline:2px solid var(--accent)}.plate-stage{min-height:27rem}.plate{display:none;margin:0;height:100%;border:1px solid var(--line);border-radius:1rem;overflow:hidden;background:var(--panel)}.plate.active{display:grid;grid-template-rows:1fr auto}.plate img{width:100%;height:100%;min-height:22rem;object-fit:cover}.plate figcaption{display:flex;justify-content:space-between;gap:1rem;padding:.8rem 1rem}.plate figcaption span{color:var(--muted);text-align:right}.controls{position:sticky;top:0;z-index:20;margin-top:2.5rem;background:rgba(10,16,25,.94);backdrop-filter:blur(16px);border-block:1px solid var(--line);padding:.8rem 0}.control-row{display:grid;grid-template-columns:minmax(13rem,1.4fr) repeat(3,minmax(9rem,.7fr)) auto;gap:.6rem}.field{display:grid;gap:.25rem}.field label{font-size:.68rem;text-transform:uppercase;letter-spacing:.1em;color:var(--muted);font-weight:900}.field input,.field select{width:100%;min-height:2.8rem;background:#0e1722;color:var(--ink);border:1px solid #465a73;border-radius:.65rem;padding:.55rem .7rem}.clear{align-self:end;min-height:2.8rem;color:inherit;background:transparent;border:1px solid var(--line);border-radius:.65rem;cursor:pointer}.result-line{display:flex;justify-content:space-between;gap:1rem;padding:1rem 0;color:var(--muted)}.result-line b{color:var(--ink)}.gallery{display:grid;grid-template-columns:repeat(auto-fill,minmax(17rem,1fr));gap:.8rem;padding-bottom:5rem}.concept-card{display:flex;flex-direction:column;background:linear-gradient(165deg,var(--panel2),var(--panel));border:1px solid var(--line);border-top:4px solid var(--accent);border-radius:1rem;overflow:hidden;min-height:27rem}.concept-card[hidden]{display:none}.concept-card.is-recommended{box-shadow:0 0 0 2px var(--cyan),0 1.5rem 5rem rgba(49,217,230,.12)}.card-heading{padding:1rem 1rem 0}.card-heading h2{font-size:1.65rem;line-height:1.05;letter-spacing:-.04em;margin:0}.card-open{display:flex;flex-direction:column;flex:1;width:100%;padding:0 1rem 1rem;color:inherit;background:transparent;border:0;text-align:left;cursor:pointer}.card-top,.scores{display:flex;justify-content:space-between;gap:.5rem;width:100%;font-size:.7rem;font-weight:900;text-transform:uppercase}.number{display:grid;place-items:center;width:2rem;height:2rem;border-radius:50%;background:var(--accent);color:#081019}.verb{color:var(--accent);letter-spacing:.1em}.badges{display:block;min-height:1.8rem;margin:.55rem 0}.badge{display:inline-flex;border:1px solid var(--accent);color:var(--accent);border-radius:999px;padding:.22rem .5rem;font-size:.65rem;font-weight:900;text-transform:uppercase}.badge.recommended{background:var(--cyan);border-color:var(--cyan);color:#071016}.category{display:block;color:var(--muted);font-size:.76rem;text-transform:uppercase;letter-spacing:.08em;margin:.3rem 0 .8rem}.hook{font-weight:850;color:var(--accent);font-size:1rem;line-height:1.35}.mini-loop{display:grid;grid-template-columns:1fr 1fr;gap:.35rem;margin:1rem 0}.mini-loop span{display:flex;align-items:center;gap:.35rem;background:#222e3e;border-radius:.5rem;padding:.45rem;font-size:.72rem}.mini-loop i{font-style:normal;display:grid;place-items:center;flex:0 0 1.25rem;height:1.25rem;border-radius:50%;background:var(--accent);color:#081019;font-weight:900}.asset-peek{display:grid;background:#0e1722;border:1px solid var(--line);border-radius:.6rem;padding:.55rem;margin-top:auto}.asset-peek small{color:var(--muted);text-transform:uppercase;font-weight:800}.asset-peek b{color:var(--accent)}.scores{padding-top:.7rem;margin-top:.8rem;border-top:1px solid var(--line);color:var(--accent)}.empty{display:none;text-align:center;padding:4rem 1rem;border:1px dashed var(--line);border-radius:1rem;color:var(--muted);margin-bottom:5rem}.empty.visible{display:block}.concept-dialog{width:min(68rem,calc(100% - 1rem));max-height:calc(100dvh - 1rem);padding:0;background:#101927;color:var(--ink);border:1px solid #52677f;border-radius:1rem}.concept-dialog::backdrop{background:rgba(2,6,12,.84);backdrop-filter:blur(8px)}.dialog-shell{padding:clamp(1.2rem,4vw,3rem)}.dialog-close{position:sticky;top:0;float:right;background:var(--cyan);color:#061116;border:0;border-radius:999px;padding:.65rem .9rem;font-weight:900;cursor:pointer}.concept-dialog h2{font-size:clamp(2.5rem,7vw,5.5rem);line-height:.9;letter-spacing:-.06em;margin:.4rem 0}.dialog-hook{font-size:1.3rem;color:var(--cyan);font-weight:850}.fantasy{font-size:1.1rem;line-height:1.6;max-width:65ch}.dialog-loop{display:grid;grid-template-columns:repeat(4,1fr);gap:.5rem;padding:0;list-style-position:inside}.dialog-loop li,.platform-grid p,.detail-grid>div,.asset-link{background:var(--panel2);border:1px solid var(--line);border-radius:.7rem;padding:.8rem}.platform-grid,.detail-grid,.asset-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:.6rem}.platform-grid h3{grid-column:1/-1}.platform-grid p b{display:block;color:var(--cyan);margin-bottom:.3rem}.asset-link{display:grid;color:inherit;text-decoration:none}.asset-link span{color:var(--cyan);font-size:.7rem;text-transform:uppercase;font-weight:900}.asset-link small{color:var(--muted);margin:.2rem 0}.asset-link .availability{color:#dce5f1;font-weight:800}.asset-link em{font-style:normal;line-height:1.45;margin-top:.35rem}.custom-work{color:var(--muted)}.footer{border-top:1px solid var(--line);padding:2rem 0 4rem;color:var(--muted)}.noscript{max-width:80ch;line-height:1.7}.static-concept{border-top:1px solid var(--line);padding:1.5rem 0}.static-concept h2{font-size:2rem}.static-concept a{color:var(--cyan)}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}:focus-visible{outline:3px solid #fff;outline-offset:3px}
@media(max-width:850px){.showcase{grid-template-columns:1fr}.plate-tabs{grid-template-columns:repeat(5,minmax(8rem,1fr));overflow-x:auto}.plate-tab b{font-size:.75rem}.plate-stage{min-height:22rem}.plate img{min-height:18rem}.control-row{grid-template-columns:1fr 1fr}.field.search{grid-column:1/-1}.platform-grid,.detail-grid,.asset-grid,.dialog-loop{grid-template-columns:1fr 1fr}.stats{grid-template-columns:1fr 1fr}}
@media(max-width:540px){.wrap{width:min(100% - 1rem,1440px)}.hero h1{font-size:3.6rem}.stat b{font-size:1.5rem}.plate figcaption{display:grid}.plate figcaption span{text-align:left}.control-row{grid-template-columns:1fr}.field.search{grid-column:auto}.controls{position:relative}.gallery{grid-template-columns:1fr}.platform-grid,.detail-grid,.asset-grid,.dialog-loop{grid-template-columns:1fr}.concept-dialog h2{font-size:2.8rem}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*::before,*::after{animation:none!important;transition:none!important}}`;
}

async function build(output) {
  const concepts = JSON.parse(await readFile(path.join(DESIGN_DIR, "proposals.json"), "utf8"));
  const recommendations = JSON.parse(await readFile(path.join(DESIGN_DIR, "asset-recommendations.json"), "utf8"));
  if (concepts.length !== 20 || recommendations.length !== 20) throw new Error("Expected 20 concepts and 20 asset kits");
  if (new Set(concepts.map((c) => c.title)).size !== 20) throw new Error("Concept titles must be unique");
  if (new Set(concepts.map((c) => c.coreVerb)).size !== 20) throw new Error("Core verbs must be unique");
  const assetsById = new Map(recommendations.map((item) => [item.id, item]));
  for (const concept of concepts) if (!assetsById.has(concept.id)) throw new Error(`Missing assets for ${concept.id}`);
  const images = {};
  for (const [file] of PLATES) images[file] = await imageUri(file);
  const plateIndex = new Map(PLATES.map(([file], index) => [file, index]));
  const cards = concepts.map((concept, index) => card(concept, assetsById.get(concept.id), index, PLATES[plateIndex.get(concept.plateImage)][2])).join("");
  const details = concepts.map((concept, index) => detail(concept, assetsById.get(concept.id), index)).join("");
  const tabs = PLATES.map(([, label, accent], index) => `<button id="plate-tab-${index}" type="button" role="tab" aria-controls="plate-panel-${index}" aria-selected="${index === 0}" tabindex="${index === 0 ? "0" : "-1"}" class="plate-tab${index === 0 ? " active" : ""}" data-plate="${index}" style="--accent:${accent}"><span>Gallery ${index + 1}</span><b>${html(label)}</b></button>`).join("");
  const figures = PLATES.map(([file, label, , description], index) => { const names = concepts.filter((c) => c.plateImage === file).map((c) => c.title).join(" / "); return `<figure id="plate-panel-${index}" role="tabpanel" aria-labelledby="plate-tab-${index}" class="plate${index === 0 ? " active" : ""}" data-plate-panel="${index}"><img src="${images[file]}" alt="${html(description)}"><figcaption><b>${html(label)}</b><span>${html(names)}</span></figcaption></figure>`; }).join("");
  const noScript = concepts.map((concept, index) => staticDetail(concept, assetsById.get(concept.id), index)).join("");
  const document = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#0a1019"><title>Twenty WebXR game worlds</title><style>${styles()}</style></head><body><a class="skip requires-js" href="#gallery">Skip to concepts</a><noscript><a class="skip" href="#static-concepts">Skip to concepts</a></noscript>
  <header class="hero"><div class="wrap"><p class="eyebrow">WebXR hackathon concept atlas</p><h1>Twenty worlds.<span>One web codebase.</span></h1><p class="lede">Explore twenty sharply different games designed so the same meaningful decision works with a mouse, one-thumb touch, or an XR ray and grab. Each pitch now includes a verified free asset starter kit.</p><div class="hero-actions"><a class="link primary requires-js" href="#gallery">Explore concepts</a><noscript><a class="link primary" href="#static-concepts">Explore concepts</a></noscript><a class="link" href="https://github.com/SoundGuyAI/OpenAIBuildWeek/raw/main/output/pdf/webxr-game-concept-proposals.pdf">Download proposal PDF</a><a class="link" href="https://github.com/SoundGuyAI/OpenAIBuildWeek/blob/main/docs/design/game-concepts/WEBXR_GAME_PROPOSALS.md">Read source proposal</a></div><div class="stats"><div class="stat"><b>20</b>distinct concepts</div><div class="stat"><b>20</b>core verbs</div><div class="stat"><b>3</b>equal platforms</div><div class="stat"><b>40</b>free pack picks</div></div></div></header>
  <section class="wrap showcase" aria-labelledby="showcase"><h2 id="showcase" class="sr-only">Concept art galleries</h2><div class="plate-tabs" role="tablist" aria-label="Concept art galleries">${tabs}</div><div class="plate-stage">${figures}</div></section>
  <search class="controls" aria-label="Search and filter concepts"><form class="wrap control-row" id="filters"><div class="field search"><label for="search">Search title, fantasy, pack, or verb</label><input id="search" type="search" placeholder="Try: agent, train, nature..." autocomplete="off"></div><div class="field"><label for="family">Concept family</label><select id="family"><option value="">All families</option><option>Systems</option><option>Expression</option><option>Discovery</option><option>Spatial puzzles</option></select></div><div class="field"><label for="risk">Originality risk</label><select id="risk"><option value="">All risk levels</option><option>Low</option><option>Medium</option><option>High</option></select></div><div class="field"><label for="shortlist">Selection</label><select id="shortlist"><option value="">All concepts</option><option value="true">Shortlist only</option></select></div><button type="reset" class="clear" id="clear">Clear</button></form></search>
  <main class="wrap"><div class="result-line"><p id="result-count" role="status" aria-live="polite"><b>20</b> concepts shown</p><p>Open a card for the full pitch and asset kit.</p></div><section class="gallery" id="gallery" aria-label="Game concept gallery">${cards}</section><div class="empty" id="empty"><h2>No worlds match yet.</h2><p>Clear one filter or try a broader search.</p></div></main>${details}
  <noscript><style>.requires-js,.controls,.showcase,.gallery,.result-line,.concept-dialog{display:none!important}.noscript{max-width:80rem}</style><section class="wrap noscript" id="static-concepts" tabindex="-1"><h2>All twenty complete concepts</h2><p>JavaScript adds filters, tabs, and modal details. Every essential design and asset recommendation remains available below without scripting.</p>${noScript}</section></noscript><footer class="footer"><div class="wrap">Pack links and licenses were checked on July 20, 2026. Recheck the downloaded license when importing an asset.</div></footer>
  <script>const cards=[...document.querySelectorAll('[data-card]')],search=document.querySelector('#search'),family=document.querySelector('#family'),risk=document.querySelector('#risk'),shortlist=document.querySelector('#shortlist'),count=document.querySelector('#result-count'),empty=document.querySelector('#empty'),form=document.querySelector('#filters');let announceTimer;function filter(announce=true){const q=search.value.trim().toLowerCase();let visible=0;for(const card of cards){const show=(!q||card.dataset.search.includes(q))&&(!family.value||card.dataset.family===family.value)&&(!risk.value||card.dataset.risk===risk.value)&&(!shortlist.value||card.dataset.shortlist===shortlist.value);card.hidden=!show;if(show)visible++;}empty.classList.toggle('visible',visible===0);clearTimeout(announceTimer);const update=()=>count.innerHTML='<b>'+visible+'</b> concept'+(visible===1?'':'s')+' shown';if(announce)announceTimer=setTimeout(update,250);else update()}search.addEventListener('input',()=>filter());for(const control of [family,risk,shortlist])control.addEventListener('change',()=>filter());form.addEventListener('reset',()=>setTimeout(()=>{filter(false);search.focus()},0));const tabs=[...document.querySelectorAll('[data-plate]')],panels=[...document.querySelectorAll('[data-plate-panel]')];function selectTab(tab,focus=false){for(const item of tabs){const active=item===tab;item.classList.toggle('active',active);item.setAttribute('aria-selected',active);item.tabIndex=active?0:-1}for(const panel of panels)panel.classList.toggle('active',panel.dataset.platePanel===tab.dataset.plate);if(focus)tab.focus()}for(const tab of tabs){tab.addEventListener('click',()=>selectTab(tab));tab.addEventListener('keydown',(event)=>{const index=tabs.indexOf(tab);let next=null;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=tabs[(index+1)%tabs.length];if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=tabs[(index-1+tabs.length)%tabs.length];if(event.key==='Home')next=tabs[0];if(event.key==='End')next=tabs.at(-1);if(next){event.preventDefault();selectTab(next,true)}})}let lastFocus=null;for(const opener of document.querySelectorAll('[data-open]'))opener.addEventListener('click',()=>{lastFocus=opener;document.querySelector('[data-dialog="'+opener.dataset.open+'"]').showModal()});for(const dialog of document.querySelectorAll('dialog')){dialog.querySelector('[data-close]').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',(event)=>{if(event.target===dialog)dialog.close()});dialog.addEventListener('close',()=>lastFocus?.focus())}const params=new URLSearchParams(location.search),requested=params.get('concept'),presetSearch=params.get('search');if(presetSearch){search.value=presetSearch;filter(false)}if(params.get('focus')==='search')search.focus();if(requested)document.querySelector('[data-concept-id="'+CSS.escape(requested)+'"]')?.click()</script></body></html>`;
  if ((document.match(/data-card data-search/g) ?? []).length !== 20) throw new Error("Generated card count mismatch");
  if ((document.match(/class="asset-link"/g) ?? []).length !== 40) throw new Error("Generated asset-link count mismatch");
  if ((document.match(/class="concept-dialog"/g) ?? []).length !== 20) throw new Error("Generated dialog count mismatch");
  for (const concept of concepts) if (!document.includes(html(concept.title))) throw new Error(`Missing ${concept.title}`);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, document, "utf8");
  console.log(`Built ${output} with 20 concepts and 40 asset recommendations`);
}

await build(outputFrom(process.argv.slice(2)));
