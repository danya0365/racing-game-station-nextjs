/**
 * Registers the TypeScript resolve hook (see loader.mjs).
 *
 * Run tests with:
 *   node --experimental-strip-types --import ./scripts/test/register.mjs --test "<glob>"
 */

import { register } from "node:module";

register("./loader.mjs", import.meta.url);