---
version: 1
slug: "client-src-shack-shack-jsx"
primary_target: "client/src/shack/Shack.jsx"
related_targets: ["client/src/shack/QslCard.jsx"]
---

# Surface: Station Shack (/shack/:callsign)

Scope: the product's only permanent place — a station's confirmed QSL cards, awards, and identity. Visitor mode: experience (the card is a trophy; its craft is the point).

Audience & job: the operator admiring their wall and sharing the link; visitors judging a station by its cards. This is the growth mechanic — the first shareable URL.

Structure: "The Rolodex", locked from the surface-scope round (seed shack5eed, code-led, dealt indices 7/5/4, user chose index 4): station plate + five award plates in a row above; ONE giant QSL card under the lamp; machined flip knob (VFO family, 42°/detent) + mechanical drum counter below; arrow keys flip (knob owns its own detents when focused).

The QSL card artifact (QslCard.jsx): deterministic SVG seeded by card id — cream band-post paper (#f2e9d4/#f4ecdb), airmail red/blue (#b13527/#2b4a8e) dashed border or double rule, sender callsign huge in seeded ink, log line, grids + km + K, 3-motif postage stamp, rotated postmark, STORM overprint (printed ink, never glowing) at K>=5. Card ink palette is paper-printing ink, chartered as the world's paper-side material — not panel chroma.

Memorable moment: the card-flip out of the file (rotateX entrance, reduced-motion collapses); award plates as lit vs dead metal.

States: empty sleeve (no cards) with instructions; unknown callsign error plate; loading dark.

Unresolved: paper fiber/ink-bleed texture pass and sonified flip detents (reviewer ceiling notes, optional); pagination beyond the drum's 2 digits (99+ cards).
