/**
 * Node resolve hook for running the app's TypeScript directly in unit tests.
 *
 * Two things the app's own config gets for free from Next/Turbopack and Node
 * does not:
 *   1. `@/x` — the tsconfig path alias
 *   2. extensionless relative imports (`./branch.config` → `branch.config.ts`)
 *
 * Without this, a test could not import a config module that reaches for a
 * sibling the way every other module in the project does.
 */

import { fileURLToPath, pathToFileURL } from "node:url";
import { existsSync } from "node:fs";
import { dirname, resolve as resolvePath } from "node:path";

const ROOT = resolvePath(dirname(fileURLToPath(import.meta.url)), "..", "..");

const CANDIDATE_SUFFIXES = ["", ".ts", ".tsx", "/index.ts", "/index.tsx"];

export async function resolve(specifier, context, nextResolve) {
  if (specifier.startsWith("@/")) {
    const target = resolvePath(ROOT, specifier.slice(2));
    const hit = CANDIDATE_SUFFIXES.map((s) => target + s).find((p) => existsSync(p) && !p.endsWith("/"));
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true, format: "module-typescript" };
    }
  }

  if (specifier.startsWith(".") && !/\.[cm]?[jt]sx?$/.test(specifier)) {
    const target = resolvePath(dirname(context.parentURL ?? fileURLToPath(import.meta.url)), specifier);
    const hit = CANDIDATE_SUFFIXES.map((s) => target + s).find((p) => existsSync(p) && !p.endsWith("/"));
    if (hit) {
      return { url: pathToFileURL(hit).href, shortCircuit: true, format: "module-typescript" };
    }
  }

  return nextResolve(specifier, context);
}
