#!/usr/bin/env node
// Build-time env injection.
//
// Mirrors what docker-entrypoint.sh does at container start in the Docker
// image (`jq -n env > assets/env.json`), but for static-CDN deploys
// (Netlify, S3+CF, etc.) where there's no entrypoint to run.
//
// Reads recognised keys from process.env at build time and merges them
// over the existing src/assets/env.json. Keys not in process.env are
// left as whatever the committed default already says, so local
// `npm run build` keeps working without any env set.

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const envPath = resolve(here, '..', 'src', 'assets', 'env.json');

// Recognised runtime config keys. Add to this list if EnvService grows
// new getEnv() callers.
const KEYS = ['TILESERVER', 'TAG'];

const fromProcess = Object.fromEntries(
  KEYS.filter((k) => typeof process.env[k] === 'string' && process.env[k] !== '')
      .map((k) => [k, process.env[k]]),
);

let existing = {};
try {
  existing = JSON.parse(await readFile(envPath, 'utf8'));
} catch {
  // env.json missing — treat as empty.
}

const merged = { ...existing, ...fromProcess };
await writeFile(envPath, JSON.stringify(merged, null, 2) + '\n');

const overridden = Object.keys(fromProcess);
console.log(
  overridden.length
    ? `[build-env] wrote ${envPath} with overrides: ${overridden.join(', ')}`
    : `[build-env] no overrides in process.env; ${envPath} unchanged from committed default`,
);
