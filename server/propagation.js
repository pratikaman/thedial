// Path model: distance + real K-index + deterministic hourly fading (QSB).
// Quality q in [0,1] drives both the RST report and how much of the text
// survives. Garbling happens here, per recipient, so clean text never
// reaches a station that couldn't copy it.

import crypto from 'node:crypto';
import { distanceKm } from './geo.js';

// How open the band is under a given planetary K-index.
export function openness(k) {
  const table = [1, 1, 0.9, 0.75, 0.55, 0.35, 0.2, 0.12, 0.08, 0.05];
  return table[Math.min(9, Math.max(0, k))];
}

function hashUnit(...parts) {
  const h = crypto.createHash('sha256').update(parts.join('|')).digest();
  return h.readUInt32BE(0) / 0xffffffff;
}

// Deterministic per pair per hour, same in both directions.
function fading(a, b) {
  const pair = [a, b].sort().join('~');
  const hour = Math.floor(Date.now() / 3_600_000);
  return 0.65 + 0.35 * hashUnit('qsb', pair, hour);
}

export function pathQuality({ from, to, k, cq = false }) {
  const d = distanceKm(from, to);
  const range = 2000 + openness(k) * 16000; // km the band supports right now
  let q = 1 - d / range;
  if (d < 300) q = Math.max(q, 0.85); // ground wave: locals always copy
  q *= fading(from.callsign, to.callsign);
  if (cq) q += 0.15; // a CQ call cuts through
  return Math.min(1, Math.max(0, q));
}

// Voice-style RS report derived from quality: readability 1-5, strength 1-9.
export function rstFor(q) {
  const r = 1 + Math.round(q * 4);
  const s = 1 + Math.round(q * 8);
  return `${r}${s}`;
}

export const MIN_COPY = 0.15; // below this only a carrier is heard

const GARBLE = ['#', '_', '·', '~', '/'];

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function garble(text, q, seedKey) {
  if (q >= 0.85) return text;
  const seed = crypto.createHash('sha256').update(seedKey).digest().readUInt32BE(0);
  const rand = mulberry32(seed);
  const pBad = Math.min(0.92, Math.max(0, (0.88 - q) * 1.15));
  let out = '';
  for (const ch of text) {
    if (rand() >= pBad) {
      out += ch;
    } else if (rand() < 0.3) {
      // dropped entirely
    } else {
      out += ch === ' ' ? ' ' : GARBLE[Math.floor(rand() * GARBLE.length)];
    }
  }
  return out;
}
