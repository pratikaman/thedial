// Station identity: ITU-style callsigns and Maidenhead grid squares.
// Raw location is used once to derive a 4-char grid (~100x200 km) and a
// country prefix, then discarded. Nothing finer is kept or sent anywhere.

import crypto from 'node:crypto';

// 4-character Maidenhead locator (field + square).
export function latLonToGrid(lat, lon) {
  const la = Math.min(89.9999, Math.max(-90, lat)) + 90;
  const lo = (((lon + 180) % 360) + 360) % 360;
  const fieldLon = String.fromCharCode(65 + Math.floor(lo / 20));
  const fieldLat = String.fromCharCode(65 + Math.floor(la / 10));
  const sqLon = Math.floor((lo % 20) / 2);
  const sqLat = Math.floor(la % 10);
  return `${fieldLon}${fieldLat}${sqLon}${sqLat}`;
}

export function gridToLatLon(grid) {
  const g = grid.toUpperCase();
  const lon = (g.charCodeAt(0) - 65) * 20 + Number(g[2]) * 2 + 1 - 180;
  const lat = (g.charCodeAt(1) - 65) * 10 + Number(g[3]) + 0.5 - 90;
  return { lat, lon };
}

export function distanceKm(a, b) {
  const R = 6371;
  const dLat = ((b.lat - a.lat) * Math.PI) / 180;
  const dLon = ((b.lon - a.lon) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (b.lat * Math.PI) / 180;
  const h =
    Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(h)));
}

// Country code -> real amateur prefix pools. Digit is rolled separately
// except where the prefix conventionally carries it (VU2, EA…).
const PREFIXES = {
  US: { pool: ['W', 'K', 'N'], digits: '0123456789' },
  IN: { pool: ['VU2', 'VU3'], digits: '' },
  DE: { pool: ['DL', 'DJ', 'DK'], digits: '123456789' },
  JP: { pool: ['JA', 'JH', 'JR'], digits: '123456789' },
  GB: { pool: ['G', 'M'], digits: '012345678' },
  FR: { pool: ['F'], digits: '123456789' },
  IT: { pool: ['I', 'IK'], digits: '012345678' },
  ES: { pool: ['EA', 'EB'], digits: '123456789' },
  BR: { pool: ['PY', 'PU'], digits: '123456789' },
  AU: { pool: ['VK'], digits: '12345678' },
  CA: { pool: ['VE', 'VA'], digits: '1234567' },
  RU: { pool: ['UA', 'RA'], digits: '134679' },
  NL: { pool: ['PA', 'PD'], digits: '0123456789' },
  SE: { pool: ['SM', 'SA'], digits: '01234567' },
  PL: { pool: ['SP', 'SQ'], digits: '123456789' },
  UA: { pool: ['UR', 'UT'], digits: '0123456789' },
  ZA: { pool: ['ZS'], digits: '123456' },
  AR: { pool: ['LU'], digits: '123456789' },
  MX: { pool: ['XE'], digits: '123' },
  CN: { pool: ['BG', 'BY'], digits: '123456789' },
  KR: { pool: ['HL', 'DS'], digits: '12345' },
  NZ: { pool: ['ZL'], digits: '1234' },
};

// Fallback stations for connections with no resolvable public location
// (localhost, LAN). Each session draws a different one so propagation is
// worth testing solo with two tabs.
const FALLBACK = [
  { cc: 'IN', lat: 28.61, lon: 77.21 },
  { cc: 'US', lat: 40.71, lon: -74.01 },
  { cc: 'US', lat: 37.77, lon: -122.42 },
  { cc: 'DE', lat: 52.52, lon: 13.4 },
  { cc: 'JP', lat: 35.68, lon: 139.69 },
  { cc: 'GB', lat: 51.51, lon: -0.13 },
  { cc: 'FR', lat: 48.86, lon: 2.35 },
  { cc: 'BR', lat: -23.55, lon: -46.63 },
  { cc: 'AU', lat: -33.87, lon: 151.21 },
  { cc: 'CA', lat: 43.65, lon: -79.38 },
  { cc: 'RU', lat: 55.76, lon: 37.62 },
  { cc: 'ES', lat: 40.42, lon: -3.7 },
  { cc: 'IT', lat: 41.9, lon: 12.5 },
  { cc: 'SE', lat: 59.33, lon: 18.07 },
  { cc: 'PL', lat: 52.23, lon: 21.01 },
  { cc: 'ZA', lat: -33.92, lon: 18.42 },
  { cc: 'AR', lat: -34.6, lon: -58.38 },
  { cc: 'NZ', lat: -36.85, lon: 174.76 },
  { cc: 'KR', lat: 37.57, lon: 126.98 },
  { cc: 'NL', lat: 52.37, lon: 4.9 },
];

const SUFFIX_LETTERS = 'ABCDEFGHIJKLMNOPRSTUVWXYZ'; // no Q: avoids fake Q-codes

function randomOf(str) {
  return str[crypto.randomInt(str.length)];
}

function makeCallsign(cc) {
  const entry = PREFIXES[cc] ?? PREFIXES.US;
  const prefix = entry.pool[crypto.randomInt(entry.pool.length)];
  const digit = entry.digits ? randomOf(entry.digits) : '';
  const len = 2 + crypto.randomInt(2); // 2 or 3 suffix letters
  let suffix = '';
  for (let i = 0; i < len; i += 1) suffix += randomOf(SUFFIX_LETTERS);
  return `${prefix}${digit}${suffix}`;
}

function isPrivate(ip) {
  return (
    !ip ||
    ip === '::1' ||
    ip.startsWith('127.') ||
    ip.startsWith('10.') ||
    ip.startsWith('192.168.') ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) ||
    ip.startsWith('fe80:') ||
    ip.startsWith('fc') ||
    ip.startsWith('fd') ||
    ip.startsWith('::ffff:127.') ||
    ip.startsWith('::ffff:192.168.') ||
    ip.startsWith('::ffff:10.')
  );
}

async function lookupPublic(ip) {
  const clean = ip.replace(/^::ffff:/, '');
  // HTTPS only: the raw IP never travels in cleartext.
  const res = await fetch(`https://ipapi.co/${encodeURIComponent(clean)}/json/`, {
    signal: AbortSignal.timeout(3000),
    headers: { 'user-agent': 'thedial/0.1' },
  });
  const data = await res.json();
  if (!data || data.error || !Number.isFinite(data.latitude)) {
    throw new Error('geo lookup failed');
  }
  return { cc: data.country_code, lat: data.latitude, lon: data.longitude };
}

export async function assignStation(ip) {
  let place;
  if (isPrivate(ip)) {
    place = FALLBACK[crypto.randomInt(FALLBACK.length)];
  } else {
    try {
      place = await lookupPublic(ip);
    } catch {
      place = FALLBACK[crypto.randomInt(FALLBACK.length)];
    }
  }
  const grid = latLonToGrid(place.lat, place.lon);
  // Work from the grid center from here on; the raw point is dropped.
  const { lat, lon } = gridToLatLon(grid);
  return { callsign: makeCallsign(place.cc), grid, lat, lon };
}
