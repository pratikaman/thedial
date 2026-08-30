# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

React (Vite) front-end over a single Node + `ws` WebSocket server. Canvas for the tuning dial and waterfall, Web Audio API for all sound (synthesized — no audio assets). No database in v1; live state in memory. User chose React explicitly (community project, familiar ecosystem for contributors). Deploy: local-only for v1; a real deploy (Fly.io/Railway-class single VM) is planned later, so avoid architecture that can't move to one small always-on process.

## Users

People who stumble into a fun internet toy and stay for the strangers: the builder's friends and the wider internet ("fun community project"). No signup — a visitor must be able to spin the dial and hear the band within seconds of landing. Secondary: actual ham operators who will judge the homage on its faithfulness to real culture (callsigns, CQ, RST reports, grid squares).

## Product Purpose

The Dial is an ephemeral web chat that recreates what ham radio *feels* like, without radios: you tune an analog dial across a simulated HF band, hunt for signals, call CQ into the void, and talk to whoever answers. Distance and real space weather decide whether you can copy someone. Success = the moment a stranger's garbled reply surfaces out of the static and it feels *earned*.

## Positioning

The only chat app where scarcity, luck, and the actual sun gate who you can talk to. Messages degrade with distance and live NOAA space-weather data (planetary K-index); nothing is stored or scrollable — if you weren't tuned in, you missed it. No neighboring chat product can truthfully claim "our app works better when the ionosphere is quiet."

## Operating Context

- One simulated band ("40 meters", 7.000–7.200 MHz) quantized into channels; one page, no routes in v1.
- Visitors get an auto-assigned callsign with a real ITU country prefix (via coarse geo-IP) and a 4-character Maidenhead grid square; raw location is discarded immediately.
- Server polls NOAA SWPC JSON feeds (planetary K-index) every ~15 min; conditions modulate per-pair path quality along with distance and hourly deterministic fading.
- Messages are garbled server-side per-recipient before delivery (no client-side clean text), render live, fade after ~60 s, and are never persisted.
- Desktop-first (a rig on a desk); must remain usable on mobile but the primary scene is a laptop with sound on.

## Capabilities and Constraints

- v1 (shipped): dial + waterfall, channels, text TX/RX with propagation garbling (distance + live K-index + deterministic hourly fading), synthesized band noise/tuning audio, CQ call button, RS voice signal reports, ephemeral rendering.
- v1.5 (shipped): QSL card exchange (mutual confirm within a 10-minute window mints a deterministic SVG card — the ONLY persistent data, plus station identity tokens), shack pages at /shack/:callsign (Rolodex structure), awards, four beacon bots (DK0WCY announces the live K index), a numbers station on 7.157, `?op=<name>` for a second operator identity per browser.
- Planned next: half-duplex collision ("doubling"), day/night propagation, scheduled nets, deploy to a small always-on VM (blocked on the user's hosting account).
- Explicitly cut: voice, auth, federation; moderation limited to a profanity filter + per-callsign rate limit.
- Terminology is real ham vocabulary and must be used correctly: CQ, QSO, QSL, QSB (fading), RST, DX, 73, grid square, band conditions.
- Sound is core, not decoration — but the page must handle browser autoplay policy (audio starts on first gesture) and remain fully usable muted.

## Evidence on Hand

- NOAA SWPC public JSON feeds (e.g. planetary K-index) are real, free, keyless. Server must degrade gracefully to a "quiet band" default when the feed is unreachable.
- No logo, brand assets, testimonials, or user counts exist. Do not fabricate community activity; an empty band is presented honestly (beacon bots are a planned, clearly-labeled answer, not fake users).

## Product Principles

1. **Scarcity is the product.** Never add scrollback, history, presence lists, or read receipts — anything that removes luck, hunting, or missing things removes the point.
2. **Real physics, really.** Conditions come from live NOAA data, not a random number dressed up as weather. When the feed is down, say the truth ("no propagation data") rather than faking it.
3. **Faithful homage over parody.** Ham culture details (callsign formats, RST, procedure words) are rendered accurately; getting them right is the respect that makes hams smile instead of wince.
4. **Privacy by coarseness.** Grid squares and country prefixes only; raw IP-derived location is never stored, shown, or logged.
5. **Alive when empty.** Every mechanism must be worth experiencing alone (noise, tuning, beacons later); the app may not depend on a crowd to be interesting.
