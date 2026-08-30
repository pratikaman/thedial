// The only persistence The Dial ever has: station identities and QSL cards.
// JSON files with atomic, debounced writes — swap for SQLite at deploy time
// if the band ever gets busy. Chat content never touches this module.

import { readFileSync, writeFileSync, renameSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const DATA_DIR = resolve(dirname(fileURLToPath(import.meta.url)), '../data');
mkdirSync(DATA_DIR, { recursive: true });

const timers = new Map();

export function load(name, fallback) {
  const file = resolve(DATA_DIR, `${name}.json`);
  if (!existsSync(file)) return fallback;
  try {
    return JSON.parse(readFileSync(file, 'utf8'));
  } catch {
    return fallback;
  }
}

function writeNow(name, value) {
  const file = resolve(DATA_DIR, `${name}.json`);
  const tmp = `${file}.tmp`;
  writeFileSync(tmp, JSON.stringify(value, null, 1));
  renameSync(tmp, file);
}

export function save(name, value) {
  clearTimeout(timers.get(name));
  const timer = setTimeout(() => writeNow(name, value), 150);
  timer.unref();
  timers.set(name, timer);
}
