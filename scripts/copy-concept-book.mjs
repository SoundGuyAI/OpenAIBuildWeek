import { cp, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const source = resolve(
  repositoryRoot,
  "docs",
  "design",
  "loop-engineer-concepts",
);
const destination = resolve(
  repositoryRoot,
  "dist",
  "docs",
  "design",
  "loop-engineer-concepts",
);

await mkdir(dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true, force: true });

console.log("Copied the Loop Engineer concept book into the production build.");
