// The Dial — band server. One process. Live band state in memory; the only
// things ever persisted are station identities and confirmed QSL cards.
// Simulates 40 meters: 7.000–7.200 MHz in 0.5 kHz channels (0..400).

import http from 'node:http';
import crypto from 'node:crypto';
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import { assignStation, gridToLatLon, distanceKm } from './geo.js';
import { startSpaceWeather, getCond, onCondChange } from './spaceweather.js';
import { pathQuality, rstFor, garble, MIN_COPY } from './propagation.js';
import { load, save } from './store.js';
import { awardsFor } from './awards.js';

const PORT = Number(process.env.PORT || 8787);
const CHANNELS = 400; // 0.5 kHz steps across 200 kHz
const MAX_TEXT = 160;
const TX_INTERVAL_MS = 1500;
const CARRIER_SPREAD = 3; // channels either side that hear a carrier
const QSL_WINDOW_MS = 10 * 60 * 1000; // copy + request validity

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, '../dist');

// ---------------- durable identity + cards ----------------

const registry = load('stations', {}); // token -> {callsign, grid, createdAt}
const byCallsign = new Map(Object.entries(registry).map(([, s]) => [s.callsign, s]));
const cards = load('cards', []);

async function stationFor(ip, token) {
  if (token && registry[token]) {
    const s = registry[token];
    const { lat, lon } = gridToLatLon(s.grid);
    return { token, callsign: s.callsign, grid: s.grid, lat, lon };
  }
  let st = await assignStation(ip);
  for (let i = 0; i < 20 && byCallsign.has(st.callsign); i += 1) {
    st = await assignStation(ip); // roll until the callsign is unique
  }
  const fresh = crypto.randomUUID();
  registry[fresh] = { callsign: st.callsign, grid: st.grid, createdAt: new Date().toISOString() };
  byCallsign.set(st.callsign, registry[fresh]);
  save('stations', registry);
  return { token: fresh, ...st };
}

// ---------------- QSL machinery ----------------

// `${from}>${to}` -> {ts, rst, ch}: to's most recent legible copy of from.
const recentCopy = new Map();
// `${from}>${to}` -> ts: from has asked to to confirm the contact.
const qslReq = new Map();

setInterval(() => {
  const cutoff = Date.now() - QSL_WINDOW_MS;
  for (const [k, v] of recentCopy) if (v.ts < cutoff) recentCopy.delete(k);
  for (const [k, ts] of qslReq) if (ts < cutoff) qslReq.delete(k);
}, 60_000).unref();

function cardPerspective(card, call) {
  const mine = card.a.call === call ? card.a : card.b;
  const theirs = card.a.call === call ? card.b : card.a;
  return {
    id: card.id,
    serial: card.serial,
    at: card.at,
    mhz: card.mhz,
    km: card.km,
    k: card.k,
    kSource: card.kSource,
    me: mine,
    them: theirs,
  };
}

function mintCard(aCall, bCall) {
  const copyOfAbyB = recentCopy.get(`${aCall}>${bCall}`);
  const copyOfBbyA = recentCopy.get(`${bCall}>${aCall}`);
  const A = byCallsign.get(aCall);
  const B = byCallsign.get(bCall);
  if (!A || !B) return null;
  const ch = copyOfBbyA?.ch ?? copyOfAbyB?.ch ?? 148;
  const km = Math.round(distanceKm(gridToLatLon(A.grid), gridToLatLon(B.grid)));
  const cond = getCond();
  const card = {
    id: crypto.randomBytes(8).toString('hex'),
    serial: cards.length + 1,
    at: new Date().toISOString(),
    mhz: Number(((7000 + ch / 2) / 1000).toFixed(4)),
    km,
    k: cond.k,
    kSource: cond.source,
    a: { call: aCall, grid: A.grid, rs: copyOfAbyB?.rst ?? '59' }, // rs = report a RECEIVED
    b: { call: bCall, grid: B.grid, rs: copyOfBbyA?.rst ?? '59' },
  };
  cards.push(card);
  save('cards', cards);
  qslReq.delete(`${aCall}>${bCall}`);
  qslReq.delete(`${bCall}>${aCall}`);
  return card;
}

// ---------------- http: shack API + built client ----------------

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2',
};

function sendJson(res, code, value) {
  res.writeHead(code, {
    'content-type': 'application/json',
    'access-control-allow-origin': '*',
  });
  res.end(JSON.stringify(value));
}

const httpServer = http.createServer((req, res) => {
  const path = req.url.split('?')[0];
  if (path === '/healthz') {
    sendJson(res, 200, { ok: true, stations: clients.size, cards: cards.length, cond: getCond() });
    return;
  }
  if (path.startsWith('/api/shack/')) {
    const call = decodeURIComponent(path.split('/')[3] ?? '').toUpperCase();
    const reg = byCallsign.get(call);
    if (!reg) {
      sendJson(res, 404, { error: 'no such station on this band' });
      return;
    }
    const mine = cards
      .filter((c) => c.a.call === call || c.b.call === call)
      .map((c) => cardPerspective(c, call))
      .reverse();
    sendJson(res, 200, {
      station: { callsign: call, grid: reg.grid, since: reg.createdAt },
      cards: mine,
      awards: awardsFor(mine),
    });
    return;
  }
  if (existsSync(DIST)) {
    const wanted = path === '/' ? '/index.html' : path;
    const file = join(DIST, wanted);
    if (file.startsWith(DIST) && existsSync(file) && extname(file)) {
      res.writeHead(200, { 'content-type': MIME[extname(file)] ?? 'application/octet-stream' });
      res.end(readFileSync(file));
      return;
    }
    // SPA fallback: /shack/CALLSIGN renders client-side
    if (!extname(wanted)) {
      res.writeHead(200, { 'content-type': 'text/html' });
      res.end(readFileSync(join(DIST, 'index.html')));
      return;
    }
  }
  res.writeHead(404);
  res.end('not found');
});

const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
const clients = new Map(); // ws -> station

function wsFor(callsign) {
  for (const [ws, st] of clients) if (st.callsign === callsign) return ws;
  return null;
}

// Light profanity screen: matches get garbled, not censored with asterisks,
// so the result still looks like band noise.
const BLOCKLIST = /\b(fuck|shit|cunt|nigger|faggot)\w*/gi;
function screen(text) {
  return text.replace(BLOCKLIST, (m) => '#'.repeat(m.length));
}

function send(ws, msg) {
  if (ws && ws.readyState === ws.OPEN) ws.send(JSON.stringify(msg));
}

function channelOf(khz) {
  return Math.round(Math.min(200, Math.max(0, khz)) * 2);
}

// ---------------- band activity ----------------

const txHeat = new Float32Array(CHANNELS + 1);

function broadcastBand() {
  const presence = new Map();
  for (const st of clients.values()) {
    presence.set(st.channel, (presence.get(st.channel) ?? 0) + 1);
  }
  const tick = Math.floor(Date.now() / 2500);
  const out = [];
  for (const [ch, n] of presence) {
    // Fuzz position by up to one channel so the scope hints, not doxxes.
    const fuzz = ((ch * 31 + tick * 7) % 3) - 1;
    out.push({ ch: Math.min(CHANNELS, Math.max(0, ch + fuzz)), e: Math.min(1, n * 0.4) });
  }
  for (const b of BEACONS) out.push({ ch: b.channel, e: 0.22 }); // beacons idle warm
  for (let ch = 0; ch <= CHANNELS; ch += 1) {
    txHeat[ch] *= 0.72;
    if (txHeat[ch] > 0.05) out.push({ ch, e: Math.min(1, txHeat[ch]) });
  }
  const msg = JSON.stringify({ t: 'band', a: out });
  for (const ws of clients.keys()) if (ws.readyState === ws.OPEN) ws.send(msg);
}
setInterval(broadcastBand, 2500).unref();

// ---------------- delivery ----------------

function deliver(fromWs, station, rawText, { cq = false, beacon = false } = {}) {
  const text = screen(rawText);
  const k = getCond().k;
  const now = Date.now();
  const stamp = new Date(now).toISOString().slice(11, 19);
  txHeat[station.channel] = 1;

  for (const [ws, other] of clients) {
    if (ws === fromWs) continue;
    const gap = Math.abs(other.channel - station.channel);
    if (gap > CARRIER_SPREAD) continue;
    const q = pathQuality({ from: station, to: other, k, cq });
    if (gap === 0 && q >= MIN_COPY) {
      if (!beacon) {
        recentCopy.set(`${station.callsign}>${other.callsign}`, {
          ts: now, rst: rstFor(q), ch: station.channel,
        });
      }
      send(ws, {
        t: 'rx',
        from: station.callsign,
        grid: station.gridShown ?? station.grid,
        ch: station.channel,
        text: garble(text, q, `${station.callsign}>${other.callsign}|${now}`),
        rst: rstFor(q),
        q: Number(q.toFixed(2)),
        cq,
        beacon,
        at: stamp,
      });
    } else {
      // Off-channel splatter or an uncopyable path: energy, no words.
      send(ws, { t: 'carrier', ch: station.channel, s: Number(Math.max(0.15, q * (1 - gap * 0.25)).toFixed(2)) });
    }
  }
  if (fromWs) {
    // Sender hears their own transmission clean, marked self.
    send(fromWs, {
      t: 'rx', self: true, from: station.callsign, grid: station.grid,
      ch: station.channel, text, rst: '59', q: 1, cq, at: stamp,
    });
  }
}

// ---------------- beacons + the numbers station ----------------

function virtualStation(callsign, grid, khz, gridShown) {
  const { lat, lon } = gridToLatLon(grid);
  return { callsign, grid, gridShown, lat, lon, channel: channelOf(khz) };
}

const BEACONS = [
  {
    st: virtualStation('DK0WCY', 'JO44', 26),
    every: 52_000,
    text: () => {
      const c = getCond();
      return `VVV VVV DE DK0WCY DK0WCY GEOMAG K IDX ${c.k} ${c.source === 'noaa' ? 'NOAA DIRECT' : 'LOCAL EST'} AR`;
    },
  },
  {
    st: virtualStation('4U1UN', 'FN30', 33),
    every: 61_000,
    text: () => 'VVV VVV DE 4U1UN 4U1UN BEACON NEW YORK AR',
  },
  {
    st: virtualStation('JA2IGY', 'PM84', 39),
    every: 47_000,
    text: () => 'VVV VVV DE JA2IGY JA2IGY BEACON MIE JAPAN AR',
  },
  {
    st: virtualStation('ZS6DN', 'KG33', 48),
    every: 68_000,
    text: () => 'VVV VVV DE ZS6DN ZS6DN BEACON PRETORIA AR',
  },
].map((b) => ({ ...b, channel: b.st.channel }));

const BEACON_CALLS = new Set(BEACONS.map((b) => b.st.callsign));

for (const [i, b] of BEACONS.entries()) {
  setTimeout(() => {
    deliver(null, b.st, b.text(), { beacon: true });
    setInterval(() => deliver(null, b.st, b.text(), { beacon: true }), b.every).unref();
  }, 4000 + i * 9000).unref();
}

// The numbers station on 7.157. Five-digit groups, no identification.
// The message is in the repo for whoever thinks to look.
const NUMBERS_ST = virtualStation('?????', 'KO30', 157, '····');
const NUMBERS_GROUPS = (() => {
  const phrase = 'THE BAND REMEMBERS NOTHING';
  const digits = [...phrase.replace(/[^A-Z]/g, '')]
    .map((c) => String(c.charCodeAt(0) - 64).padStart(2, '0'))
    .join('');
  const padded = digits.padEnd(Math.ceil(digits.length / 5) * 5, '0');
  const groups = [];
  for (let i = 0; i < padded.length; i += 5) groups.push(padded.slice(i, i + 5));
  return groups;
})();
let numbersIdx = 0;
setTimeout(() => {
  const tickNumbers = () => {
    const g = NUMBERS_GROUPS;
    const a = g[numbersIdx % g.length];
    const b = g[(numbersIdx + 1) % g.length];
    const ends = (numbersIdx + 2) % g.length < 2;
    numbersIdx = (numbersIdx + 2) % g.length;
    deliver(null, NUMBERS_ST, `${a} ${a} ${b} ${b}${ends ? ' KONETS KONETS' : ''}`, { beacon: true });
  };
  tickNumbers();
  setInterval(tickNumbers, 95_000).unref();
}, 20_000).unref();

// ---------------- connections ----------------

wss.on('connection', async (ws, req) => {
  const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() ?? req.socket.remoteAddress;
  const token = new URL(req.url, 'http://x').searchParams.get('token') || undefined;
  const station = { ...(await stationFor(ip, token)), channel: channelOf(74), lastTx: 0 };
  clients.set(ws, station);
  send(ws, {
    t: 'hello',
    token: station.token,
    callsign: station.callsign,
    grid: station.grid,
    khz: station.channel / 2,
    stations: clients.size,
  });
  send(ws, { t: 'cond', ...getCond() });

  ws.on('message', (buf) => {
    let msg;
    try {
      msg = JSON.parse(buf.toString());
    } catch {
      return;
    }
    const st = clients.get(ws);
    if (!st) return;

    if (msg.t === 'tune' && Number.isFinite(msg.khz)) {
      st.channel = channelOf(msg.khz);
      return;
    }

    if (msg.t === 'qsl') {
      const target = String(msg.to ?? '').toUpperCase().slice(0, 12);
      if (BEACON_CALLS.has(target) || target === NUMBERS_ST.callsign) {
        send(ws, { t: 'sys', code: 'qsl', text: 'BEACONS DO NOT QSL — THEY ONLY EVER SEND.' });
        return;
      }
      if (target === st.callsign) {
        send(ws, { t: 'sys', code: 'qsl', text: 'THAT IS YOUR OWN STATION — WORK SOMEONE ELSE.' });
        return;
      }
      const copyOfThem = recentCopy.get(`${target}>${st.callsign}`);
      if (!copyOfThem || Date.now() - copyOfThem.ts > QSL_WINDOW_MS) {
        send(ws, { t: 'sys', code: 'qsl', text: `NO RECENT COPY FROM ${target} — WORK THEM FIRST.` });
        return;
      }
      qslReq.set(`${st.callsign}>${target}`, Date.now());
      const reciprocal = qslReq.get(`${target}>${st.callsign}`);
      if (reciprocal && Date.now() - reciprocal < QSL_WINDOW_MS) {
        const card = mintCard(st.callsign, target);
        if (card) {
          send(ws, { t: 'qsl-card', card: cardPerspective(card, st.callsign) });
          send(wsFor(target), { t: 'qsl-card', card: cardPerspective(card, target) });
        }
      } else {
        send(ws, { t: 'sys', code: 'qsl', text: `QSL REQUEST SENT TO ${target} — AWAITING THEIR CONFIRMATION.` });
        send(wsFor(target), { t: 'qsl-offer', from: st.callsign });
      }
      return;
    }

    if (msg.t === 'tx' || msg.t === 'cq') {
      const now = Date.now();
      if (now - st.lastTx < TX_INTERVAL_MS) {
        send(ws, { t: 'sys', code: 'rate', text: 'XMIT INHIBITED — KEY-UP TOO FAST. WAIT A MOMENT.' });
        return;
      }
      const cq = msg.t === 'cq';
      const raw = cq
        ? `CQ CQ CQ DE ${st.callsign} ${st.callsign} K`
        : String(msg.text ?? '').replace(/[\p{Cc}\p{Cf}]/gu, '').trim().slice(0, MAX_TEXT);
      if (!raw) return;
      st.lastTx = now;
      deliver(ws, st, raw, { cq });
    }
  });

  ws.on('close', () => clients.delete(ws));
  ws.on('error', () => clients.delete(ws));
});

onCondChange((cond) => {
  const msg = JSON.stringify({ t: 'cond', ...cond });
  for (const ws of clients.keys()) if (ws.readyState === ws.OPEN) ws.send(msg);
});

startSpaceWeather();
httpServer.listen(PORT, () => {
  console.log(`[thedial] band server on :${PORT} (ws /ws, api /api/shack/:call)`);
});
