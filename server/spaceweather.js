// Live band conditions from NOAA SWPC. The planetary K-index is the one
// number that gates propagation; when the feed is unreachable we say so
// (source: "estimate") instead of dressing a guess up as a measurement.

const FEED = 'https://services.swpc.noaa.gov/products/noaa-planetary-k-index.json';
const POLL_MS = 15 * 60 * 1000;

let cond = { k: 2, source: 'estimate', at: null };
const listeners = new Set();

async function poll() {
  try {
    const res = await fetch(FEED, { signal: AbortSignal.timeout(8000) });
    const rows = await res.json();
    // The feed has shipped two shapes: [{time_tag, Kp, ...}] and
    // [["time_tag","Kp",...], [..rows]]. Handle both.
    const last = rows[rows.length - 1];
    const kp = Array.isArray(last) ? Number(last[1]) : Number(last.Kp);
    const at = Array.isArray(last) ? last[0] : last.time_tag;
    const k = Math.round(kp);
    if (!Number.isFinite(k) || k < 0 || k > 9) throw new Error('bad Kp');
    const next = { k, source: 'noaa', at };
    const changed = next.k !== cond.k || next.source !== cond.source;
    cond = next;
    if (changed) for (const fn of listeners) fn(cond);
  } catch {
    if (cond.source !== 'estimate') {
      cond = { k: cond.k, source: 'estimate', at: cond.at };
      for (const fn of listeners) fn(cond);
    }
  }
}

export function startSpaceWeather() {
  poll();
  setInterval(poll, POLL_MS).unref();
}

export function getCond() {
  return cond;
}

export function onCondChange(fn) {
  listeners.add(fn);
}
