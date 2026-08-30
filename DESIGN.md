---
name: The Dial
description: An ephemeral radio band on the web — one 1970s ham rig gated by the actual sun, and the paper QSL cards that outlive it.
colors:
  room: "#0b0a08"
  room-edge: "#060505"
  panel: "#26272c"
  panel-hi: "#2e3036"
  panel-lo: "#1c1d21"
  bevel-light: "rgba(255, 255, 255, 0.07)"
  silk: "#efe8d8"
  silk-dim: "#b8b09c"
  amber: "#ffb45c"
  amber-hot: "#ffd9a3"
  amber-deep: "#c97b1f"
  amber-meta: "#d99f56"
  glass: "#17100a"
  glass-off: "#0d0b09"
  lamp-red: "#e0503a"
  alum: "#a9a698"
  alum-lo: "#85826f"
  engrave: "#2b2822"
  meter-face: "#f2e9d4"
  meter-ink: "#2b2419"
  meter-red: "#b13527"
  paper-warm: "#f4ecdb"
  ink-iron: "#3d3327"
  ink-airmail: "#2b4a8e"
  ink-fine: "#6b5f49"
typography:
  display:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "30px"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "0.06em"
  headline:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "20px"
    fontWeight: 700
    letterSpacing: "0.22em"
  label:
    fontFamily: "Barlow Semi Condensed, Arial Narrow, system-ui, sans-serif"
    fontSize: "11px"
    fontWeight: 600
    letterSpacing: "0.14em"
  body:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.45
  print-body:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.7
  meta:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "10.5px"
    fontWeight: 400
    letterSpacing: "0.1em"
  readout:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "15px"
    fontWeight: 700
    letterSpacing: "0.08em"
  drum:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "20px"
    fontWeight: 700
  big-call:
    fontFamily: "Courier Prime, Courier New, monospace"
    fontSize: "26px"
    fontWeight: 700
    letterSpacing: "0.12em"
rounded:
  counter: "3px"
  plate: "4px"
  glass: "5px"
  deck: "6px"
  chassis: "10px"
  hardware: "50%"
spacing:
  cluster: "7px"
  row: "10px"
  deck: "14px"
  bay: "18px"
components:
  push-button:
    textColor: "{colors.silk}"
    rounded: "{rounded.glass}"
    padding: "0 16px"
  glass-window:
    backgroundColor: "{colors.glass-off}"
    rounded: "{rounded.glass}"
  glass-window-powered:
    backgroundColor: "{colors.glass}"
    rounded: "{rounded.glass}"
  deck:
    rounded: "{rounded.deck}"
    padding: "14px"
  plate:
    backgroundColor: "{colors.alum}"
    textColor: "{colors.engrave}"
    rounded: "{rounded.plate}"
    padding: "10px 30px"
  toggle:
    rounded: "13px"
    width: "46px"
    height: "26px"
  lamp:
    rounded: "{rounded.hardware}"
    width: "10px"
    height: "10px"
  message-input:
    textColor: "{colors.amber-hot}"
    typography: "{typography.body}"
    padding: "9px 12px"
  award-plate:
    textColor: "{colors.silk-dim}"
    rounded: "{rounded.plate}"
    padding: "9px 10px 8px"
  award-plate-earned:
    backgroundColor: "{colors.alum}"
    textColor: "{colors.engrave}"
    rounded: "{rounded.plate}"
    padding: "9px 10px 8px"
  qsl-chip:
    textColor: "{colors.amber-meta}"
    rounded: "{rounded.counter}"
    padding: "1px 7px"
  qsl-chip-offered:
    backgroundColor: "{colors.amber-deep}"
    textColor: "#140d04"
    rounded: "{rounded.counter}"
    padding: "1px 7px"
  drum-counter:
    backgroundColor: "{colors.glass}"
    textColor: "{colors.amber-hot}"
    typography: "{typography.drum}"
    rounded: "{rounded.plate}"
    padding: "6px 10px"
  flip-knob:
    rounded: "{rounded.hardware}"
    width: "96px"
    height: "96px"
  back-link:
    textColor: "{colors.amber-meta}"
    typography: "{typography.label}"
  paper-sheet:
    backgroundColor: "{colors.meter-face}"
    textColor: "{colors.meter-ink}"
    rounded: "{rounded.plate}"
    padding: "clamp(22px, 4vw, 46px) clamp(18px, 4vw, 52px)"
  rubber-stamp:
    textColor: "{colors.meter-red}"
    rounded: "{rounded.counter}"
    padding: "8px 12px"
  index-card:
    backgroundColor: "{colors.paper-warm}"
    rounded: "{rounded.counter}"
    padding: "18px 20px"
---

# Design System: The Dial

## Overview

**Creative North Star: "The Amber Shack Rig"**

The band is an instrument you operate. The product's main surface is one 1970s Japanese ham rig — brushed charcoal aluminum faceplate, walnut end-cheeks, visible screws and riveted plates — filling the viewport of a nearly black room. It deliberately refuses the dark-dashboard chat idiom: no sidebar, no scrollback, no page chrome. Every interface element is a piece of panel hardware (a lamp, a knob, a meter, a backlit glass window), and every piece of hardware reports a true state.

The world now has three rooms and two materials. The rig at `/` is lamp-lit metal: there is exactly one light source — the lamps — and all glow in the system (indicator lamps, backlit dial glass, the amber waterfall, the frequency counter, the meter wash, the powered rig's room spill) is lamp light that does not exist until POWER is flipped. The Station Shack at `/shack/:callsign` — "The Rolodex" — is the world's permanent place: a rotary card file under an always-lit overhead lamp, holding the QSL cards a station has earned. The card is printed paper, the world's second material: cream stock and printed ink that never glows, distinct from panel chroma in every way. The Operator's Primer at `/manual` — "The Logbook Primer" — is the paper side's reading room: one typewritten manual sheet from the band post under the same overhead lamp, the world's only Read-mode surface, where comprehension leads and the paper carries the charm. Everything on the air stays ephemeral; the card is the only paper the band ever mints for a station — the primer is factory-printed matter, the one sheet the band post printed for everyone.

Color follows the same physics on both sides: chromatic color on metal is either amber filament light or signal red; everything else is near-neutral metal, cream paint, and dark glass. On paper, color is ink — madder red, air-mail blue, iron — stamped, never lit. Density is instrument-grade: 11px silkscreen captions, hardware clusters packed at 7px gaps, a giant flywheel VFO as the centerpiece. Motion is mechanical, not decorative — sprung meter needles, flywheel inertia, slow warm-up eases, a 60-second cooling fade on received copy, detented flips on the shack's rotary file — and there are no scattered hover effects anywhere.

Surfaces on record (all code-led picks): the rig — `client/index.html`, seed `dial5eed` (FORM block in the file itself); the Station Shack — `client/src/shack/Shack.jsx` + `shack.css` + `QslCard.jsx`, structure "The Rolodex", seed `shack5eed`; the Operator's Primer — `client/src/manual/Manual.jsx` + `manual.css` + `FaceplateFigure.jsx`, structure "The Logbook Primer", seed `guide5eed` (Read mode).

**Key Characteristics:**
- One machine fills the viewport; the room around it is nearly black.
- One light source: amber lamp light is the only glow, and on the rig only when powered.
- Two materials: lamp-lit metal and printed paper. Ink never glows; metal never reads as paper.
- Visible construction: corner screws, riveted plates, seamed decks, knurled knobs, rolling drum digits.
- Honest signal states: measured (NOAA LIVE lamp), estimated (red ESTIMATE lamp), and unreadable copy each read distinctly; unearned awards are dead metal.
- Everything on the air is ephemeral: received copy holds ~45s and is gone by 75s. The QSL card is the world's single permanent artifact — mutually confirmed contacts mint paper in the shack, forever.

## Colors

A tungsten palette: charcoal metal and cream paint lit only by amber filaments, with signal red reserved for alarm and transmission — plus a chartered paper-ink family for the printed side of the world.

### Primary
- **Lamp Amber** (#ffb45c): the filament color itself — lit lamps, the VFO and flip-knob pointer lines, major dial-scale ticks, the meter's powered wash. This is light, never paint.
- **Hot Filament** (#ffd9a3): the hottest point of the glow — received message copy, the frequency counter digits, the shack's drum counter, lamp cores. The brightest thing behind any glass.
- **Ember** (#c97b1f): cooled amber — text selection, the traffic scrollbar thumb, the focused input's inset ring, the QSL chip's border and its filled `.offered` state, the dashed request slip.
- **Meta Amber** (#d99f56): amber at reading intensity for secondary teleprinter text — QSO metadata lines, band notes, dial-scale numerals, the counter's MHZ unit, the shack's back-link and empty-sleeve instructions.

### Secondary
- **Signal Red** (#e0503a): alarm and transmission — the ON AIR lamp, the ESTIMATE conditions lamp, the TX prefix on your own traffic, link-lost notes, the dial's cursor hairline and band-edge markers.
- **Meter Red** (#b13527): the inked red — the meter arcs' red zone (S9+, high K) on the metal side, and on the paper side the card's madder-red ink: airmail dashes, seeded display callsigns, the STORM overprint. Printed ink in both rooms; it does not glow.

### Neutral
- **Charcoal Panel** (#26272c, highlight #2e3036, shadow #1c1d21): the brushed aluminum faceplate, rendered as a vertical gradient with a 1px repeating grain overlay.
- **Silkscreen Cream** (#efe8d8): factory-painted lettering and knob pointer lines; **Dim Silkscreen** (#b8b09c) for secondary captions and unearned award plates.
- **Data-Plate Aluminum** (#a9a698, shadow #85826f) with **Engraving** (#2b2822): the riveted instruction and station plates, the shack's station plate, and earned award plates.
- **Meter Face** (#f2e9d4) with **Meter Ink** (#2b2419): the cream instrument faces and their printed arcs, ticks, and captions. The same two pigments recur on the paper side as card stock and log ink — cream and its ink are one material, lit two ways.
- **Glass** (#17100a powered, #0d0b09 dark): the warm dark brown behind every glass window, including the drum counter's.
- **Room** (#0b0a08 to #060505): the radial-gradient darkness both rooms sit in.
- **Bevel Light** (rgba(255,255,255,0.07)): the 1px top-edge catchlight on every raised part.

### Paper & Ink
The chartered palette of the world's paper side — the QSL card and the Operator's Primer. All of it is printed ink on cream stock: flat, matte, and incapable of glowing. These values are deliberately literal inside the card SVG and the primer's stylesheet (not CSS variables): printed paper is not themed hardware.

- **Card Stock** (#f2e9d4, the Meter Face cream; warm run **paper-warm** #f4ecdb): the card's paper (seeded per card between the two stocks) and the primer's manual sheet; the warm run is also the glossary index card. Shading is printed too — the sheet lies under a white catchlight wash and a faint **paper-shade** wash (rgba(138,122,92,0.16)), nothing more.
- **Iron Ink** (#3d3327): the standing ink — the card's band-post header, confirming line, log rules, and rotated postmark; the primer's masthead title, §-section titles, double rules, and the whole of FIG. 1's one-ink drawing and frame. At reduced alphas it becomes ruling: 0.45 frames the figure, 0.3 rules log entries and table rows, 0.07 rules the index card.
- **Madder Red** (#b13527, shared with Meter Red): airmail border dashes, one of the three seeded display inks, and the STORM K overprint on the card; on the primer, the instructor's red ink — the READ BEFORE KEYING stamp, the worked log's margin annotations, glossary terms, the log page's margin rule (at 0.6 alpha), the figure's witness line, and paper text selection (madder ground, cream text — the metal side selects in Ember).
- **Air-Mail Blue** (#2b4a8e): the only cool hue in the entire world, legal solely as paper-printing ink — airmail border dashes and one of the three seeded display inks. It never appears on lamp-lit metal or through glass, and the primer doesn't use it either: manual pages print in iron and madder only; blue remains the card's ink.
- **Fine Print** (#6b5f49): serial numbers, column captions (DATE / UTC / FREQUENCY / UR REPORT), and the 73 sign-off on the card; the primer's masthead kicker, table headers, quiet log lines, footer, and asides.
- **Log Ink** (#2b2419, shared with Meter Ink): the log line's data on the card — date, time, frequency, report, grids, distance, K — and the primer's typewritten body prose.

### Named Rules
**The One Filament Rule.** Every luminous color is lamp light. The amber family and signal red appear only where a filament, backlit glass, or its physical spill would put them — never as decoration, never on unpowered hardware. Paint (silkscreen, engraving, meter ink, card ink) never glows.

**The Powered Gate Rule.** Light exists only when it is earned by a real state. On the rig, the `.powered` class on the root gates every glow — lamp states, glass backlight, the counter, the meter wash, the room spill — and the unpowered rig must render as convincingly dead metal. In the shack, the permanent room, the overhead lamp is always on, and the gate translates to trophies: an earned award is lit aluminum with a lit lamp; an unearned award is dead metal with a dark lamp.

**The Paper-Ink Rule.** Everything on paper is printed ink: it never glows, never casts a colored halo, and takes nothing from the lamp families. Air-mail blue exists only on paper — the no-cool-hues law still governs every lamp-lit metal surface. The STORM overprint at K≥5 is ink stamped on the card, never light.

## Typography

**Display/Label Font:** Barlow Semi Condensed (with Arial Narrow, system-ui fallback) — the silkscreen.
**Body/Data Font:** Courier Prime (with Courier New fallback) — the teleprinter.

Both are Google-hosted (weights 400–700 for Barlow, 400/700 for Courier Prime), loaded in `client/index.html`.

**Character:** A factory-printed panel voice against a machine-received data voice. The silkscreen is condensed, letter-spaced, and always uppercase; the teleprinter is monospaced and carries everything that arrives over the air — and everything the band post prints on paper.

### Hierarchy
- **Display** (700, 30px, line-height 1, 0.06em tracking): the "THE DIAL" badge only. Drops to 24px on mobile. The paper counterpart is the primer's masthead title — silk 700 at `clamp(18px, 2.6vw, 26px)`, 0.12em, Iron Ink.
- **Headline** (700, 20px, 0.22em tracking, UPPERCASE): room headings — the shack's STATION SHACK and the primer's OPERATOR'S PRIMER. Drops to 16px at ≤820px in both rooms.
- **Label** (600, 11px, 0.14em tracking, UPPERCASE): all silkscreen captions (`.silk-label`). The dim variant is weight 500 in Dim Silkscreen. Plate headings push tracking to 0.22em at weight 700; the model line to 0.18em at weight 500. Award plates carry silk's finest cut: award names at 700/10.5px/0.1em, award rules at 500/10.5px/0.08em (0.85 opacity), both uppercase. On paper, silk keeps its own fine cuts: §-section and card titles at 700/13px/0.18em Iron, glossary terms at 700/11.5px/0.1em Madder, the kicker/table headers/footer at 600–700/10.5px/0.16–0.22em Fine Print — all still uppercase.
- **Body** (400, 14px, line-height 1.45): received copy and the message input, in Courier Prime, Hot Filament.
- **Print Body** (400, 14px, line-height 1.7): the primer's typewritten prose — Log Ink on paper, sentence case, 72ch max measure. Reading rhythm is looser than glass copy (1.7 vs 1.45) because paper is read, not monitored.
- **Print Fine** (the fine-type register, Courier on paper): 13.5px/700 worked-log lines, 13px table data (tabular-nums), 12.5px reference text (FIG. 1 parts list, glossary definitions, asides), 12px/1.6 madder margin annotations. A deliberately tight 1.5px band — canonized as built; each step owns exactly one role, which is why the finish reviewer's suggestion to thin it was not adopted.
- **Meta** (400, 10.5px, 0.1em tracking): QSO metadata rows — time, callsign, grid, RST — in Meta Amber, with callsigns bolded to 700 in Lamp Amber. Band notes and beacon/filed lines sit near this role at 12.5px.
- **Readout** (700, Courier): the machined register scale — 15px/0.08em (frequency counter, station-plate callsign), 20px (the shack's drum counter), 26px/0.12em (the shack plate's big callsign). Larger registers belong to the permanent room.

### Named Rules
**The Silk-and-Teleprinter Rule.** Barlow Semi Condensed is what the factory printed: labels, captions, plate headings, button lettering, card headers and stamps. Courier Prime is what the machine produces: received copy, readouts, callsigns, grids, system notes, the card's log line, the primer's typewritten pages. Data wears mono; labels wear silk. No third face exists — on metal or on paper.

**The All-Caps Panel Rule.** Everything printed on the panel or surfaced through glass is uppercase and letter-spaced (minimum 0.04em, typically 0.1–0.14em). Its scope is silkscreen on metal and glass: sentence case does not appear anywhere on the rig or the shack's hardware. Paper documents answer to the Paper Read Register instead.

**The Paper Read Register.** Sentence-case typewritten body prose is legal on paper documents — the primer reads in Log Ink at 14px/1.7 across a 72ch measure, because a Read-mode page is won by comprehension, not silkscreen discipline (the adaptation was accepted at the primer's finish review on exactly that ground). Silk stays all-caps everywhere it appears, paper included: mastheads, §-section titles, glossary terms, table headers, stamps, footers. §-numbered sections (§1–§6) are the manual's cross-reference machinery — earned by a document that refers to itself ("identified in FIG. 1 below"), not decoration for other surfaces.

**The Typewriter Emphasis Rule.** Emphasis on paper is a typewriter underline (`text-decoration: underline`, 3px offset, `font-style: normal`), never a synthetic oblique — a typewriter cannot slant, and a faked italic would break the material. Strong stays bold, the double-struck word. There is no italic anywhere in the world.

**The SVG Type Rule.** Type inside SVG artifacts is set through CSS classes — `.qf-silk`/`.qf-tty` on the card's faces (styled in `shack.css`) and again on FIG. 1's numerals and witness line (styled in `manual.css`) — never through SVG `font-family` presentation attributes, which silently fall back to the default serif. A serif QSL card is a broken QSL card.

## Layout

Three rooms, one darkness.

**The rig** (`/`): one machine, centered. `.room` is a full-viewport flex center with `clamp()` padding; `.rig` is `min(1360px, 100%)` wide with a minimum height of `min(800px, 100vh − 64px)`, flanked by fixed 26px walnut end-cheeks. The faceplate is a column (padding 18px 22px 16px, 14px gaps): badge strip on top, main deck grid in the middle, riveted plates on the bottom. The main deck is a three-bay grid — `248px / minmax(0,1fr) / 372px` with 18px gutters: controls and S-meter left, dial glass + VFO center, traffic glass and message key right. Decks are recessed panels (6px radius, 14px padding, inset 1px dark ring, 1px top bevel).

**The shack** (`/shack/:callsign`): a column standing in the open room — no chassis. `.shack-room` stacks header, plates row, and the rotary file at 22px gaps on `min(980px, 100%)` rails (padding 26px, `clamp(12px, 4vw, 48px)` sides), under the lamp-pool wash. The plates row is an `auto / minmax(0,1fr)` grid (14px gap): station plate left, five award plates in a `repeat(5, 1fr)` row (10px gap) right. Below, the card well is `min(640px, 94vw)` with 1100px perspective, then the file controls stack (flip knob, drum counter, caption) at 12px gaps. Room-scale rhythm runs 20–22px — looser than panel rhythm, because these things sit on a desk, not on a faceplate.

**The primer** (`/manual`): the reading room — the world's only scrolling surface, because a document has length. A chartered header row (back-link + room headline) sits over one paper sheet on `min(1060px, 100%)` rails at 20px gaps (padding 26px top, `clamp(12px, 4vw, 48px)` sides, 48px bottom), under the same overhead lamp pool as the shack. Inside the sheet (`clamp(22px, 4vw, 46px)` × `clamp(18px, 4vw, 52px)` padding): a double-rule masthead, a two-column spread (1fr/1fr, `clamp(20px, 4vw, 46px)` gutters) of §-sections, the full-width FIG. 1 block, a second spread (index card + side sections), then a double-rule footer. Prose never exceeds 72ch.

Spacing rhythm on the panel: **7px** inside hardware clusters (lamp + label, knob + caption), **10px** between control rows (and between award plates), **14px** as deck padding and stack gap, **18px** between bays.

Responsive: at ≤1080px the traffic deck drops below a two-column (220px/1fr) grid; at ≤820px the rig goes full-bleed — cheeks hidden, chassis radius and shadow removed, single column, VFO fixed at 168px, meter capped at 300px and centered. The shack at ≤820px stacks its plates single-column, reflows awards two-up, drops the headline to 16px, and lets the card fill the width. The primer at ≤820px collapses both spreads and the parts list to one column, squares the index card (rotation removed), dispenses with the rubber stamp, and drops its headline to 16px. The instrument survives; the room disappears.

### Named Rules
**The One Machine Rule.** A surface is one thing in a dark room. On the rig, the machine is the page: no element renders outside the chassis, and no headers, footers, or floating UI exist in the room around it. In the shack, the file, its hardware, and the plates stand directly in the lamp pool — still no page chrome, no card-grid-plus-sidebar layout, nothing that is not hardware or paper. In the primer, the one thing is a sheet of paper; the chartered back-link header is the only other object in the room.

## Elevation & Depth

Depth is machined, not floated. The panel expresses depth two ways: **recession** (inset shadows carve glass windows, meter bezels, jacks, and the toggle track into the metal) and **standoff** (drop shadows under knobs and buttons that physically protrude, always paired with a 1px `bevel-light` top catchlight). The chassis itself sits in the room under two stacked soft black shadows, and when powered gains two amber spill layers — lamp light obeying the One Filament Rule. The paper-side rooms carry the same physics: their grounds are washed by a standing lamp pool, the shack's hardware uses the rig's recess and standoff kit, and the one thing allowed to float is paper — the QSL card and the primer's manual sheet hang under the same deep desk shadow because paper is held up into the light, not bolted down. Paper resting on paper throws shallower: the glossary index card sits on the manual sheet under a lighter drop.

### Shadow Vocabulary
- **Chassis sit** (`0 30px 60px -18px rgba(0,0,0,0.85), 0 8px 18px rgba(0,0,0,0.6)`): the rig on the desk.
- **Powered room spill** (adds `0 0 110px 6px rgba(255,164,72,0.06), 0 46px 150px -12px rgba(255,150,60,0.1)`): dial-lamp light pooling into the room, transitioned over 1.4s.
- **Shack lamp pool** (`radial-gradient(90% 70% at 50% 34%, rgba(255,164,72,0.075), transparent 62%)` over the room gradient): the overhead lamp's wash on the shack room ground — the permanent rooms' always-on counterpart to the rig's powered spill. The primer's reading room carries the same pool, sized to its page (`85% 60% at 50% 30%`, same color stops).
- **Card in hand** (`0 24px 50px -12px rgba(0,0,0,0.85), 0 4px 12px rgba(0,0,0,0.5)`): the QSL card lifted out of the rotary file and the primer's manual sheet — the floating shadow reserved for paper, and for nothing else.
- **Index-card sit** (`0 8px 22px -6px rgba(0,0,0,0.55)`): the glossary index card resting on the manual sheet — paper on paper, a shallower throw than paper in air.
- **Glass recess** (`inset 0 3px 10px rgba(0,0,0,0.85), inset 0 0 0 1px rgba(0,0,0,0.7), 0 1px 0 var(--bevel-light)`): every glass window.
- **Knob standoff** (`0 5px 12px rgba(0,0,0,0.65), inset 0 1px 1px rgba(255,255,255,0.1), inset 0 -2px 6px rgba(0,0,0,0.6)`): rotary hardware off the panel. The VFO and flip knob add the machined chrome skirt: stacked ring shadows (dark ring, steel ring, dark ring — e.g. `0 0 0 4px #17181b, 0 0 0 6px #494b52, 0 0 0 7px #101114` on the flip knob).
- **Lamp glow** (`0 0 8px 1px rgba(255,180,92,0.55)`, red variant `rgba(224,80,58,0.55)`): a lit lamp's tight halo — 8px blur, never larger.
- **Deck recess** (`0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px rgba(0,0,0,0.35)`): the three bays; the same kit renders unearned award plates as dead recessed metal.

### Named Rules
**The Carved-Not-Cast Rule.** Nothing floats and nothing lifts. Recessed things get inset shadows; raised things get a standoff shadow plus a 1px top bevel. Interaction never adds elevation — the push button travels 1px *down* when pressed. Paper is the sole exception: the QSL card and the primer sheet float under the card-in-hand shadow because paper is held, not bolted; hardware never borrows that shadow.

## Shapes

Stamped metal and turned hardware. Every rotary or point element is a perfect circle (`border-radius: 50%`): knobs, lamps, rivets, screws, jacks, the VFO, the shack's flip knob. The toggle is a 46×26px pill with a circular bat. Rectangles carry small machined radii on a fixed scale — 3px (counter chip, QSL chip), 4px (plates, award plates, drum counter, request slip), 5px (glass windows, push buttons), 6px (decks, bezels, the QSL card's paper corner, the empty sleeve), 10px (chassis) — and nothing exceeds 10px except circles.

Dashed strokes are the paper-and-pending vocabulary: the postage stamp's perforated edge (`stroke-dasharray` on the card), the postmark's dotted ring, the empty sleeve's 2px dashed outline (`rgba(217,159,86,0.4)`), and the traffic glass's dashed QSL request slip. A dashed line means awaiting or perforated — never decoration.

Ruled lines are the paper document's furniture: **3px double iron rules** close the primer's masthead and footer; hairline iron rules at 0.3 alpha rule the worked log's entries and the beacon table's rows (a full-iron 1.5px rule under table headers); a 1px madder rule at 0.6 alpha draws the log page's red margin; the index card is ruled at a 27px pitch (26px of paper, 1px of 0.07-alpha iron). And things stamped or laid by hand sit slightly off-axis — the rubber stamp at −4°, the index card at −0.6°, the card's postmark at ±16° and STORM overprint at −11° — while machined hardware never rotates.

Surface finish is part of the form language, built entirely from CSS gradients: brushed grain on the faceplate (1px repeating horizontal lines at 1.4% white), knurling on knob edges (`repeating-conic-gradient` masked to the rim), spun-metal finish and a finger dimple on the VFO and flip knob, layered wood-grain gradients on the walnut cheeks, and domed radial gradients (highlight at ~35%/30%) on every lamp, rivet, screw, and bat. On paper the finish is printed: a faint diagonal paper-shade gradient at 0.5 opacity, nothing more.

## Components

### Power Toggle
- **Shape:** 46×26px pill track, recessed (`inset 0 2px 5px` black), with a 20px domed metal bat.
- **Motion:** the bat throws 20px in 0.16s on `cubic-bezier(0.19, 1, 0.22, 1)` — the mechanical snap curve.
- **Role:** flipping POWER is the signature moment and the audio-unlock gesture: master gain ramps up over 1.4s ("tubes warming"), lamps and glass warm in, the link connects.

### Lamps
- **Style:** 10px circles (7px `small` variant on award plates); dark state is dead metal (#37332a, inset shadow). Lit state is a domed radial gradient (Hot Filament core → Lamp Amber → Ember) plus the tight lamp glow. Red variant for ON AIR and ESTIMATE.
- **Warm-up:** background and glow transition 0.5s ease-out — lamps warm in, they don't switch.
- **Honesty:** every lamp is wired to a real state (power, transmission, data provenance, an earned award). `role="status"` with a lit/dark aria-label on the rig; award lamps pair with visually hidden earned/not-yet-earned text.

### Push Buttons (XMIT / CQ)
- **Shape:** 5px radius, machined vertical gradient (#34363c → #1e2024), 1px bevel-light top edge, standoff shadow.
- **Lettering:** silkscreen — Barlow 700, 12px, 0.14em, Silkscreen Cream.
- **Hover:** gradient lightens one step (#3a3d43 → #24262b); no motion.
- **Active:** travels 1px down, shadow collapses to pressed (`inset 0 2px 4px`).
- **Disabled:** Dim Silkscreen at 0.55 opacity, `cursor: not-allowed`.

### Analog Meters (S-meter, GEOMAG K)
- **Construction:** inline SVG in a recessed bezel (6px radius, 8px padding): Meter Face rectangle, inked 104° arc with a Meter Red zone from `redFrom`, printed ticks and caption in Barlow, black needle sprung from a pivot, glass glare gradient on top.
- **Powered wash:** a 10%-opacity Lamp Amber rectangle fades over the face in 0.9s — the meter is lamp-lit from within.
- **Needle physics:** JS spring driven every frame (acceleration 0.16 toward target, velocity damping 0.78); the ambient S-meter adds a 0.09 floor, slow sine wobble, and decaying kicks (×0.94/frame) on received signals.

### Knobs (AF GAIN, and fixed MODE/BAND selectors)
- **Style:** 52–62px circles, domed gradient, knurled rim, Silkscreen Cream pointer line; caption below in dim silk.
- **Interaction:** vertical pointer-drag, wheel (±0.06), and arrow keys (±0.05); `role="slider"` with value semantics. Cursor is `grab`/`grabbing`.
- **Fixed selectors:** MODE and BAND are honest about being fixed — rendered as `role="img"` labeled "fixed at LSB" / "fixed at 40M". This rig has one band and one mode, and says so.

### VFO Flywheel (signature)
- **Shape:** `clamp(150px, 19vw, 216px)` circle with a machined chrome skirt (stacked ring shadows: 5px black, 3px steel, 1px black), spun-metal conic finish, recessed finger dimple, Lamp Amber pointer.
- **Physics:** rotation drives frequency at 12 kHz per full turn. Drag imparts velocity; on release the flywheel coasts with 0.955/frame friction, still tuning as it spins down. Wheel steps 0.5 kHz; arrows 0.5 kHz (5 with Shift). Rotation is applied imperatively via `style.transform` — dragging never re-renders React.
- **Sound:** velocity feeds a heterodyne tuning whine (280–1380 Hz, gain by speed).

### Dial Glass + Waterfall (signature)
- **Construction:** two stacked canvases behind one glass window — a 46px sliding frequency scale over a 64px waterfall, 50 kHz visible span, fixed Signal Red cursor hairline at center and 3px red band-edge markers at 7.000/7.200.
- **Tick hierarchy in amber intensity:** 10 kHz ticks in Lamp Amber (#ffb45c) with Barlow numerals in Meta Amber; 5 kHz in #c9821f; 1 kHz in #8a5c22; 0.5 kHz in #5c3f1c — brightness *is* significance.
- **Waterfall:** ~30 rows/s scrolling heat map on an amber ramp from near-black (rgb(20,13,4)) to hot filament, with Gaussian signal blooms and a noise floor. Powered-off, both canvases are blank.
- **Counter:** a 3px-radius chip, bottom-right — Courier 700 15px in Hot Filament on near-black with a faint amber inset ring; fades in 0.9s with power.

### Traffic Glass
- **Style:** the largest glass window (min-height 236px), `role="log"` `aria-live="polite"`, thin scrollbar with an Ember thumb.
- **QSO entries:** a Meta row (time Z, bold amber callsign, grid, RST) over Body copy in Hot Filament. Own transmissions are prefixed `TX` in Signal Red with a silk-colored callsign; CQ calls render copy in a brighter cream-amber (#ffe9c9).
- **Beacon rows:** `.qso.beacon` — machine traffic prints dimmer than people: the callsign drops to Meta Amber and the copy runs 12.5px in #d9a35c.
- **The 60-second fade:** copy holds full opacity for 45s, then fades linearly to zero by 75s and is removed. Nothing scrolls back from before you were tuned in.
- **Empty/edge states:** teleprinter band-notes in Meta Amber (no traffic, linking); link-lost notes in Signal Red (`.sys-note`).

### QSL Chip, Slip & Filed Line (traffic extensions)
- **QSL chip** (`.qsl-chip`): a 3px-radius bordered chip riding the QSO meta row — Barlow 600, 9.5px, 0.12em, Meta Amber text with an Ember border on transparent. Hover fills `rgba(201,123,31,0.18)` and brightens to Lamp Amber. `.offered` flips it to a filled Ember chip with near-black (#140d04) text at 700 — the request is out.
- **Request slip** (`.qsl-slip`): a 4px-radius row outlined in 1px *dashed* Ember — silk 600, 10.5px, 0.12em, Lamp Amber — holding an incoming QSL offer and its confirm chip. This is operational state, not traffic: it persists past the 75s fade until answered or the 10-minute window closes.
- **Filed line** (`.qsl-filed`): the confirmation — a ruled teleprinter strip, Courier 12.5px in cream-amber #ffe9c9 between 1px `rgba(255,180,92,0.25)` top and bottom rules, linking to the shack. Links here and `.shack-link` (on the station plate) are underlined with a 3px offset; standalone links go Lamp Amber.

### Award Plates (shack)
- **Construction:** five 4px-radius trophy plates in a row, each with a 7px lamp pinned top-right, an award name (Barlow 700, 10.5px, 0.1em) and its rule (500, 10.5px, 0.08em, 0.85 opacity), all uppercase.
- **Unearned:** dead metal — the deck's dark finish (near-transparent white-to-black gradient, 1px bevel top, inset ring), Dim Silkscreen text, dark lamp.
- **Earned:** the riveted-plate aluminum finish (bright gradient over `alum → alum-lo`), Engraving text, lit amber lamp. The Powered Gate Rule translated to trophies — nothing lights until it is true.

### Flip Knob (shack)
- **Style:** a 96px member of the VFO's machined family — same domed, knurled knob base with the chrome ring skirt, a recessed finger dimple, and a Lamp Amber pointer.
- **Interaction:** detented, not free-spinning — 42° per card, stepped by circular pointer-drag, wheel, or arrow keys. The keyboard turns the pointer too: the knob reports true state no matter how it was flipped. Arrow keys also flip from anywhere on the page (the focused knob owns its own detents). Disabled below two cards at 0.5 opacity.

### Drum Counter (shack)
- **Construction:** a mechanical drum register behind a 4px glass chip (`inset 0 3px 8px` black recess, 1px bevel): each digit is a rolling strip of 0–9 translated behind a 1em window — the strip moves, the window stays. Courier 700, 20px, Hot Filament, with an Ember `∕` separator.
- **Motion:** each detent eases the strip 0.45s on the snap curve; `role="status"` announces "Card N of M". Reduced motion stops the roll.

### QSL Card (signature artifact — protected)
- **What it is:** the one artifact The Dial ever mints, and the only paper in the world. A deterministic SVG (viewBox 560×360, 6px paper corner) seeded per card id (FNV-1a hash → mulberry32): the seed picks the stock (#f2e9d4 or #f4ecdb), the display ink (madder red / air-mail blue / iron), an airmail dashed border (~65% of cards, alternating red/blue parallelogram dashes) or a double-rule frame, one of three engraved stamp motifs (the dial, the meter, the antenna), and the postmark angle (−16°…+16°).
- **Fixed layout:** band-post header and serial number top-left; the *sender's* callsign huge across the middle (86px, seeded ink — the card is their confirmation) over "CONFIRMING QSO WITH …"; a ruled log line (date, UTC, MHz, UR report over Fine Print captions); grids → distance → K line and a 73 sign-off; a perforated postage stamp (dashed edge, motif, "73" denomination) and a rotated dashed postmark top-right. At K≥5, a madder-red **STORM K{n}** boxed overprint stamps across the log at −11° — printed ink at 0.9 opacity, never a glow.
- **The card flip:** the world's single authored entrance — the card swings up out of the file, 0.5s on the snap curve from `rotateX(−58°) translateY(26px)` (transform-origin bottom edge, 1100px perspective), keyed per card so every detent re-flips. Collapses under reduced motion.
- **Type & color mechanics:** faces are `.qf-silk`/`.qf-tty` CSS classes (The SVG Type Rule); every color is a literal print value, not a variable.
- **Protected by the v1.5 finish review:** the card's restraint — cream paper, one huge ink callsign, a real airmail border, the non-glowing STORM overprint — and the single card-flip moment. Do not add foil, glow, gradients-as-decoration, or a second animation to this card.

### Shack States
- **Empty sleeve:** a 6px-radius, 2px-dashed outline (`rgba(217,159,86,0.4)`) where the card would be — centered teleprinter instructions (13.5px, 1.7 line-height, Meta Amber) telling the visitor to go work the band, with a back-link.
- **Error plate:** an unknown callsign gets the riveted aluminum plate (max-width 560px), engraved: the shack only knows stations that have been on the air.

### Cross-Surface Nav (chartered)
- **Back link** (`.back-link`): the world's one navigation device — silk 600, 11px, 0.14em, Meta Amber, underlined at 3px offset; hover brightens to Lamp Amber. It carries the shack header's ← THE DIAL and PRIMER links, the primer header's ← THE RIG, and the empty sleeve's GO WORK THE BAND →.
- **On the rig:** navigation stays engraved — the instruction plate closes with READ THE OPERATOR'S PRIMER → as a `.shack-link` (underlined engraving, opens in a new tab so the rig stays on the air).
- **Arrows travel with their labels:** the arrow is bound by a non-breaking space (`PRIMER&nbsp;→`) so it never wraps alone.

### Manual Paper Sheet (primer)
- **Construction:** one `min(1060px, 100%)` sheet of Card Stock (#f2e9d4) under two printed washes — a white catchlight (`linear-gradient(168deg, rgba(255,255,255,0.35), transparent 40%)`) and the paper-shade wash (`linear-gradient(348deg, rgba(138,122,92,0.16), transparent 55%)`) — 4px corner, card-in-hand shadow, Log Ink text.
- **Masthead:** kicker in silk 600/10.5px/0.22em Fine Print over the clamp display title, closed by a 3px double iron rule; the footer mirrors it (PRINTED BY THE DIAL BAND POST · NOTHING ELSE IS, silk 600/10.5px/0.2em Fine Print above nothing).
- **Register:** everything on the sheet obeys the Paper Read Register and the Typewriter Emphasis Rule; selection is madder ground with cream text.

### Rubber Stamp (primer)
- **Style:** READ BEFORE KEYING — a 2.5px solid Madder border, 3px radius, silk 700/12px/0.18em Madder text, rotated −4° at 0.85 opacity. Inked by hand, not printed: the rotation and the thinned ink are the treatment. Dispensed with at ≤820px.

### Ruled Log Page & Margin Notes (primer — protected)
- **Construction:** §4's worked contact — the page indents 18px behind a 1px Madder margin rule at 0.6 alpha; each exchange sits between hairline iron rules (0.3 alpha).
- **Log lines:** Courier 700, 13.5px, with the timestamp in Fine Print 400; the closing QSL line goes quiet (400, Fine Print).
- **Margin annotations:** under each line, the instructor's red ink — Courier 12px/1.6 in Madder, explaining the line just read. Protected by the finish review: these annotations are the page's comprehension engine.

### Patent Figure (FIG. 1 — sanctioned paper medium, protected)
- **What it charters:** FIG-style technical diagrams are a sanctioned medium on paper — drawn, never rendered. The discipline is the patent office's: **one ink** (#3d3327 Iron), pure vector line geometry, no fills, no shading, no second color beyond the single madder witness line.
- **Construction:** the TD-40 faceplate as ruled outline geometry inside a 1px iron frame (0.45 alpha), end-cheeks hatched by a 45° 7px line pattern, drawn at 1.8px strokes with 1–1.2px detail lines.
- **Reference numerals:** 10px-radius bubbles filled with the paper color live in the margins, tied to their parts by gently bowed quadratic leaders (bow = 0.12 × leader length, so short leaders stay near-straight and nothing sweeps across the drawing) ending in a 2.2px ink dot on the part. Numerals are silk via `.qf-silk` (The SVG Type Rule).
- **Apparatus:** a centered fig-label (silk 700/12px/0.16em) and a two-column Courier 12.5px parts list tie the numerals to the real controls; WITNESSED · BAND POST DRAFTING RM. runs in madder Courier 10px at the sheet corner — the drafting-room formality.

### Glossary Index Card (primer)
- **Style:** a warm-stock (#f4ecdb) card laid on the sheet at −0.6°, ruled at the 26/27px pitch (0.07-alpha iron), 3px radius, under the index-card sit shadow.
- **Rows:** terms in silk 700/11.5px/0.1em Madder against Courier 12.5px definitions on a 108px/1fr grid — a typed card in a red-inked filing system.

### Beacon Table (primer)
- **Style:** the paper data table — silk 700/10.5px/0.16em Fine Print headers over a 1.5px iron rule; Courier 13px rows with `tabular-nums`, separated by hairline iron rules.

### Riveted Plates
- **Style:** aluminum gradient plates (4px radius, 10px 30px padding; the shack's station plate widens to 12px 34px) with four domed 8px rivets inset from the corners; Engraving-colored text — Barlow headings at 0.22em, and a Courier 700 callsign (15px on the rig's station plate, 26px `big-call` in the shack). The plates are printed metal: no glow, ever.

### Screws
- **Style:** four 13px SVG pan-head screws at the faceplate corners, radial-gradient domed, each with a slot line at a randomized angle so the panel reads as hand-assembled.

### Named Rules
**The Warm-Up Rule.** State changes ease like heat. Lamps take 0.5s, glass and counters 0.9s, the room spill 1.4s, all `ease-out`; audio ramps over 1.4s. Only mechanical detents snap: the toggle bat (0.16s), the drum counter's roll (0.45s), and the card flip out of the file (0.5s) all ride `cubic-bezier(0.19, 1, 0.22, 1)`. Heat eases; mechanisms snap. All of these transitions collapse under `prefers-reduced-motion: reduce`.

**The No-Re-render Rule.** Continuous motion (VFO rotation, flip-knob detents, needle springs, canvas scale/waterfall, the counter) is driven imperatively in `requestAnimationFrame` loops or direct `style.transform` writes reading refs — React renders only on discrete state changes (power, messages, link status, the current card index).

## Do's and Don'ts

### Do:
- **Do** gate every glow behind a true state: the `.powered` root class on the rig, the earned flag on award plates — light does not exist on a dead rig or an unearned trophy.
- **Do** build new hardware from the carving kit: inset black shadows for recessed parts, standoff shadow plus 1px `bevel-light` top edge for raised parts, domed radial gradients (highlight at ~35%/30%) for anything turned or riveted.
- **Do** keep lamp glows tight: 8px blur, 1px spread, 0.55 alpha of the lamp's own color — a halo, not a bloom.
- **Do** set all metal-and-glass text uppercase and letter-spaced: silkscreen at 0.14em (0.22em on plate headings and room headlines), teleprinter at 0.04–0.1em. On paper documents, typewritten body prose reads in sentence case (The Paper Read Register); silk stays uppercase everywhere.
- **Do** keep signal provenance visibly honest: NOAA LIVE gets the amber lamp, ESTIMATE gets the red lamp, own transmissions carry the red TX prefix, beacons print dim, and unreadable copy stays garbled.
- **Do** keep the QSL card exactly as restrained as it shipped: cream stock, one huge ink callsign, a real airmail border, a non-glowing STORM overprint, and exactly one authored moment — the card flip. This is the v1.5 finish review's protected keep-line.
- **Do** keep the primer exactly as reviewed: the madder margin annotations on the worked log, FIG. 1's one-ink patent restraint, and the sentence-case typewritten register are the page's comprehension engine — the primer finish review's protected keep-line.
- **Do** set SVG type via CSS classes (`.qf-silk`/`.qf-tty`), never SVG `font-family` presentation attributes.
- **Do** use correct ham vocabulary everywhere copy appears (CQ, QSO, QSL, RST, QSB, 73, grid squares) — fidelity is the respect that makes hams smile.

### Don't:
- **Don't** introduce cool or saturated hues on the metal side. The only chroma on lamp-lit surfaces is amber light and signal red; metals stay near-neutral, paint stays cream. Air-mail blue (#2b4a8e) exists solely as printed ink on the QSL card's paper.
- **Don't** add hover motion — no lifts, scales, or glows on pointer-over. The push button's one-step gradient shift, the QSL chip's fill, and 1px press travel are the entire hover/active vocabulary.
- **Don't** let amber act as paint. Silkscreen lettering is cream (#efe8d8) or dim cream; amber is reserved for light through glass and lit filaments. And don't let ink act as light: nothing printed on paper ever glows.
- **Don't** persist or extend history on the air. Copy holds 45s and is gone by 75s; never add scrollback, timestamps into the past, or any affordance that removes missing things. The QSL card is the sole sanctioned permanence — mutual confirmation mints paper in the shack — and the dashed request slip may outlive the fade only because it is operational state, not traffic.
- **Don't** wire a lamp to nothing. Every indicator reports a true state — power, transmission, provenance, an earned award; decorative panel furniture (jacks, fixed selectors) must be static and honestly labeled as fixed.
- **Don't** slant type. Emphasis on paper is the typewriter underline, never a synthetic oblique; there is no italic anywhere in the world, on either material.
- **Don't** give a FIG-style figure a second ink. Patent figures are one-ink line geometry with paper-filled numeral bubbles; the madder witness line is the sole sanctioned exception. No fills, no shading, no color coding.
- **Don't** exceed the machined radius scale: 3–6px on stamped rectangles and paper, 10px on the chassis, circles for hardware — nothing else.
