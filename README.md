# The Dial

An ephemeral radio band on the web. Tune an analog VFO across a simulated
40-meter band, hunt for signals on the waterfall, call CQ, and talk to
whoever answers. How far your signal carries depends on distance and the
**actual sun** — the server polls NOAA's planetary K-index and closes the
band during geomagnetic storms.

Nothing is stored. Messages garble with distance, fade in 60 seconds, and
if you weren't tuned in, you missed them.

## Run it

```bash
npm install
npm run dev        # Vite client on :5173 + band server on :8787
```

Open http://localhost:5173, flip **POWER**, and spin the dial. Your callsign
is yours for good (a station token in localStorage). To work yourself from a
second tab, open `http://localhost:5173/?op=b` — the `op` parameter runs a
separate operator identity; local connections get random world locations so
propagation is worth testing solo.

## New to ham radio?

Read the **Operator's Primer** at `/manual` (linked from the rig's
instruction plate): what the band is, why copy garbles, a worked example
QSO annotated line by line, a numbered diagram of every control, and the
lingo glossary (CQ, DE, K, RS, QSB, 73…).

## QSL cards & the shack

After you exchange legible copy with a station, press **QSL?** on their
transmission. When both sides confirm (within 10 minutes), a card is minted —
the only thing The Dial ever stores. Your card wall lives at
`/shack/YOURCALL` (the **SHACK →** link on the station plate): a rotary file,
one card at a time, with award plates (First Contact, DX Hound, Storm Rider,
Ragchewer, Worked 3 Continents). Card art is deterministic per contact —
airmail borders, postage stamp, postmark, and a red STORM overprint if you
worked someone through a K≥5 geomagnetic storm.

## Always on the air

Four beacon bots keep the band alive (7.026 DK0WCY — announces the live
K index — 7.033 4U1UN, 7.039 JA2IGY, 7.048 ZS6DN), and something that never
identifies itself reads five-digit groups on 7.157. Nobody knows what it
means.

## Production

```bash
npm run build      # builds client into dist/
npm run server     # one process: serves dist/ and the band on :8787
```

## How it works

- `server/` — one Node process, all state in memory. Propagation quality per
  pair = distance (Maidenhead grid centers) x band openness (live NOAA
  K-index) x deterministic hourly fading. Text is garbled server-side per
  recipient; clean text never reaches a station that couldn't copy it.
- `client/` — React + Vite. The whole UI is one 70s ham-rig faceplate:
  Canvas dial scale + waterfall, Web Audio band noise/tuning whine/RTTY
  warbles (all synthesized), analog needle meters.

## Ham-culture glossary

CQ = calling any station · QSO = a contact · RS = voice signal report
(readability 1–5, strength 1–9) · QSB = fading · grid square = coarse
Maidenhead location · 73 = best regards.
