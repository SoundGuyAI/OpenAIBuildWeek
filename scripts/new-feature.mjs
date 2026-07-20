import { execFileSync } from "node:child_process";
import { access, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const slug = process.argv[2];
const root = process.cwd();

if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
  console.error("Usage: npm run feature:new -- kebab-case-feature-slug");
  process.exit(1);
}

const git = (args, options = {}) =>
  execFileSync("git", args, { cwd: root, encoding: "utf8", ...options });

const tryGit = (args) => {
  try {
    return git(args, { stdio: ["ignore", "pipe", "ignore"] }).trim();
  } catch {
    return null;
  }
};

const pathExists = async (candidate) => {
  try {
    await access(candidate);
    return true;
  } catch {
    return false;
  }
};

const fail = (message) => {
  console.error(message);
  process.exit(1);
};

const gitRoot = tryGit(["rev-parse", "--show-toplevel"]);
if (!gitRoot || path.resolve(gitRoot) !== path.resolve(root)) {
  fail("Run this command from the repository root.");
}

const status = git(["status", "--porcelain"]);
if (status.trim()) {
  fail("The worktree must be clean before creating a feature branch.");
}

if (tryGit(["show-ref", "--verify", "refs/heads/main"]) === null) {
  fail("Local branch 'main' does not exist.");
}

const branchName = `feature/${slug}`;
if (tryGit(["show-ref", "--verify", `refs/heads/${branchName}`]) !== null) {
  fail(`Branch '${branchName}' already exists.`);
}

const planDirectory = path.join(root, "plans", slug);
const evidenceDirectory = path.join(root, "evidence", slug);
if (await pathExists(planDirectory)) {
  fail(`Plan directory already exists: plans/${slug}`);
}
if (await pathExists(evidenceDirectory)) {
  fail(`Evidence directory already exists: evidence/${slug}`);
}

const conversationDirectory = path.join(root, "docs", "conversation");
const conversationFiles = await readdir(conversationDirectory, {
  withFileTypes: true,
});
const hasConversationLog = conversationFiles.some(
  (entry) =>
    entry.isFile() && entry.name.endsWith(".md") && entry.name !== "README.md",
);
if (!hasConversationLog) {
  fail(
    "Create an active conversation log and append the exact user prompt before creating the feature branch.",
  );
}

const createdAt = new Date().toISOString();
const replacements = (template) =>
  template
    .replaceAll("{{FEATURE_SLUG}}", slug)
    .replaceAll("{{CREATED_AT}}", createdAt);

const planTemplate = await readFile(
  path.join(root, "plans", "_template", "PLAN.md"),
  "utf8",
);
const evidenceTemplate = await readFile(
  path.join(root, "evidence", "_template", "README.md"),
  "utf8",
);

const upstream = tryGit([
  "rev-parse",
  "--abbrev-ref",
  "--symbolic-full-name",
  "main@{upstream}",
]);
if (upstream) {
  const behind = Number(git(["rev-list", "--count", `main..${upstream}`]).trim());
  if (behind > 0) {
    fail(
      `Local main is ${behind} commit(s) behind ${upstream}. Run 'git switch main' and 'git pull --ff-only', then retry.`,
    );
  }
}

git(["switch", "main"], { stdio: "inherit" });
git(["switch", "-c", branchName], { stdio: "inherit" });

await mkdir(planDirectory, { recursive: false });
await mkdir(evidenceDirectory, { recursive: false });
await mkdir(path.join(planDirectory, "agent-notes"), { recursive: false });

const assignmentManifest = `# Agent assignments: ${slug}

Branch: \`${branchName}\`  
Created: ${createdAt}  
Status: planning

The orchestrator must replace placeholders and confirm disjoint write scopes
before dispatch. Record a concrete reason in the final column when skipping an
applicable expert.

## Orchestrator-only paths

- Active file in \`docs/conversation/\`
- \`plans/${slug}/PLAN.md\`
- \`plans/${slug}/AGENT_ASSIGNMENTS.md\`
- \`evidence/${slug}/README.md\`
- Branch operations, shared configuration, integration files, and urgent blockers

## Dispatch table

| Agent ID | Expert role | Exclusive write scope | Depends on | Done when | Status or skip reason |
| --- | --- | --- | --- | --- | --- |
| design | Game design | \`plans/${slug}/agent-notes/game-design.md\` | Logged prompt | Testable player intent and acceptance recommendations | Pending |
| sdk | IWSDK/architecture | \`plans/${slug}/agent-notes/sdk-research.md\` | Logged prompt | SDK choices are sourced, bounded, and testable | Pending |
| implementation-1 | Implementation | **Assign exact source and owned test paths before dispatch** | Approved plan | Owned slice and narrow checks pass | Unassigned |
| browser-qa | Browser E2E | Owned spec under \`tests/e2e/\`, \`evidence/${slug}/browser-qa.md\`, desktop/mobile artifacts | Integrated build | Desktop/mobile matrix and error inspection complete | Pending |
| xr-qa | XR QA | \`evidence/${slug}/xr-qa.md\`, VR artifacts | Integrated build | IWER/runtime matrix complete or device gap recorded | Pending |
| experience | Experience quality | \`evidence/${slug}/experience-review.md\` | Integrated build | Accessibility/comfort/performance findings ranked | Pending or explain skip |
| reviewer | Independent review | \`evidence/${slug}/review.md\` | Tests and evidence complete | Diff reviewed; blockers and residual risks recorded | Pending |

## Scope rules

- One active writer owns each path; no active write scopes may overlap.
- Specialists may read broadly but must request out-of-scope edits.
- Update this manifest before ownership changes.
- Implementation and independent review must have different owners.
`;

const gameDesignNotes = `# Game design expert notes: ${slug}

Status: pending

## Player fantasy and core-loop impact

## Controls: desktop, mobile, and VR

## Success, failure, recovery, and feedback

## Acceptance recommendations and non-goals

## Accessibility, comfort, assumptions, and open questions
`;

const sdkResearchNotes = `# IWSDK and architecture notes: ${slug}

Status: pending

## Question and feature impact

## Pinned-version findings and sources

## Recommended API/pattern

## Browser, mobile, IWER, and headset constraints

## Risks, rejected alternatives, and validation steps
`;

const qaReport = (title, sections) => `# ${title}: ${slug}

Branch: \`${branchName}\`  
Created: ${createdAt}  
Status: pending

## Environment

- Build/commit:
- Browser/runtime/device:
- Viewport/input:

${sections}

## Errors and diagnostics reviewed

## Artifacts

## Untested surfaces and remaining risks
`;

const browserQa = qaReport(
  "Browser QA",
  `## Desktop results

| Scenario | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- |
| Core player loop |  |  | Pending | \`01-desktop.webp\` |

## Mobile results

| Scenario | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- |
| Touch player loop |  |  | Pending | \`02-mobile.webp\` |`,
);

const xrQa = qaReport(
  "XR QA",
  `## IWER/runtime results

| Scenario | Expected | Observed | Result | Artifact |
| --- | --- | --- | --- | --- |
| Enter, interact, exit, and re-enter |  |  | Pending | \`03-vr.webp\` |

## Physical headset results or gap
`,
);

const experienceReview = `# Experience quality review: ${slug}

Status: pending

## Accessibility and input discoverability

## VR comfort, motion, reachability, and scene scale

## Audio and non-audio feedback

## Performance and low-end device risks

## Ranked findings and retest criteria
`;

const independentReview = `# Independent review: ${slug}

Status: pending

## Blocking findings

## Non-blocking findings

## Scope and ownership compliance

## Residual risks and untested surfaces
`;

await writeFile(
  path.join(planDirectory, "PLAN.md"),
  replacements(planTemplate),
  { flag: "wx" },
);
await writeFile(
  path.join(planDirectory, "AGENT_ASSIGNMENTS.md"),
  assignmentManifest,
  { flag: "wx" },
);
await writeFile(
  path.join(planDirectory, "agent-notes", "game-design.md"),
  gameDesignNotes,
  { flag: "wx" },
);
await writeFile(
  path.join(planDirectory, "agent-notes", "sdk-research.md"),
  sdkResearchNotes,
  { flag: "wx" },
);
await writeFile(
  path.join(evidenceDirectory, "README.md"),
  replacements(evidenceTemplate),
  { flag: "wx" },
);
await writeFile(path.join(evidenceDirectory, "browser-qa.md"), browserQa, {
  flag: "wx",
});
await writeFile(path.join(evidenceDirectory, "xr-qa.md"), xrQa, {
  flag: "wx",
});
await writeFile(
  path.join(evidenceDirectory, "experience-review.md"),
  experienceReview,
  { flag: "wx" },
);
await writeFile(
  path.join(evidenceDirectory, "review.md"),
  independentReview,
  { flag: "wx" },
);

console.log(`Created ${branchName}`);
console.log(`Plan: plans/${slug}/PLAN.md`);
console.log(`Assignments: plans/${slug}/AGENT_ASSIGNMENTS.md`);
console.log(`Evidence: evidence/${slug}/README.md`);
console.log("Next: fill the plan and assignment manifest before dispatch or code changes.");
