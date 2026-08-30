import FaceplateFigure from './FaceplateFigure.jsx';
import './manual.css';

/* The Logbook Primer — the guide as the opening pages of a station
   logbook: a worked example QSO with margin annotations, a numbered
   patent-style figure of the faceplate, and a glossary index card.
   Read-mode surface on the world's paper side (seed guide5eed). */

const GLOSSARY = [
  ['CQ', 'A call to anyone listening. Answering one is how contacts start.'],
  ['DE', '"This is" — DE VU2QXK means "this is VU2QXK".'],
  ['K', 'Go ahead — the invitation for anyone (or the named station) to reply.'],
  ['QSO', 'A contact: a two-way exchange between stations.'],
  ['QSL', 'Confirmation of a contact. Here: both press QSL, a card is minted.'],
  ['QSB', 'Fading. Signals breathe over minutes; a path that was clean can sink.'],
  ['RS', 'Voice signal report: Readability 1–5, Strength 1–9. RS 59 is perfect copy.'],
  ['73', 'Best regards — the ham goodbye. Sign it before you spin away.'],
  ['DX', 'A distant station. The farther the path, the prouder the contact.'],
  ['GRID', 'Maidenhead grid square — a coarse ~100 km location code like JN18.'],
  ['QTH', 'Location. "QTH GRID ML88" tells them where you are, roughly.'],
  ['OM', 'Old man — any fellow operator, affectionately, regardless of anything.'],
  ['FB', 'Fine business — "great". "FB SIG" praises a strong signal.'],
  ['ES / FER', '"And" / "for" — telegraph shorthand that never went away.'],
  ['QRM', 'Man-made interference — another station keying too close to you.'],
  ['TNX / UR / HW?', 'Thanks / your / "how do you copy?" — telegraphic shorthand.'],
  ['ELMER', 'A mentor who teaches newcomers. This page is your paper Elmer.'],
];

const LOG_LINES = [
  {
    time: '0142Z',
    text: 'CQ CQ CQ DE VK2TAE VK2TAE K',
    note: 'A CQ is "anyone out there?" — DE gives the callsign, K hands you the mic. Bright traces on the dial glass are exactly this.',
  },
  {
    time: '0143Z',
    text: 'VK2TAE DE VU2QXK UR RS 47 47 QTH GRID ML88 HW? K',
    note: 'Answer with their call, then yours. RS 47 = readable 4/5, strength 7/9 — the meter tells you what to send. HW? asks how they copy you.',
  },
  {
    time: '0144Z',
    text: 'VU2QXK DE VK2TAE UR RS 35 35 QSB ES QRM GRID QF56 TNX FER CALL 73 K',
    note: 'They copy you worse (RS 35) — the path is not symmetric. QSB = fading, ES = "and", QRM = interference from other stations. They sign 73: best regards, the ham goodbye.',
  },
  {
    time: '0145Z',
    text: 'VK2TAE DE VU2QXK RR FB TNX 73 SK',
    note: 'Send your 73 back before you spin away. RR = "roger", SK = "end of contact" — now both sides have signed off.',
  },
  {
    time: '0146Z',
    text: '— BOTH STATIONS PRESS QSL —',
    note: 'Card Nº minted, filed to both shacks. The card is the only thing this band ever keeps.',
    quiet: true,
  },
];

export default function Manual() {
  return (
    <div className="manual-room">
      <header className="manual-head">
        <a className="back-link" href="/">← THE RIG</a>
        <h1>OPERATOR&rsquo;S PRIMER</h1>
      </header>

      <article className="manual-paper">
        <div className="paper-masthead">
          <div>
            <p className="mast-kicker">THE DIAL · MODEL TD-40 · 40 METER BAND COMMUNICATOR</p>
            <h2 className="mast-title">STATION LOGBOOK &amp; OPERATOR&rsquo;S PRIMER</h2>
          </div>
          <p className="mast-stamp">READ BEFORE<br />KEYING</p>
        </div>

        <div className="spread">
          <section className="page" aria-labelledby="how-title">
            <h3 id="how-title" className="page-title">§1 · HOW THIS BAND WORKS</h3>
            <p>
              This is an homage to amateur (&ldquo;ham&rdquo;) radio — a hundred-year-old
              hobby where strangers find each other by sweeping a shared band of
              frequencies. You do the same here: flip <strong>POWER</strong>, turn the big
              <strong> VFO</strong> knob, and hunt the dial glass for bright traces.
              Whoever is tuned to your frequency <em>right now</em> hears you. Nobody else
              ever will.
            </p>
            <p>
              Nothing on this band is recorded. Received copy fades from the traffic
              glass in about a minute, and there is no scrollback — if you weren&rsquo;t
              tuned in, it never happened for you. That is not a limitation; it is the
              whole point.
            </p>
            <h3 className="page-title">§2 · WHY COPY GARBLES</h3>
            <p>
              Two things stand between you and perfect copy: <strong>distance</strong> and
              <strong> the actual sun</strong>. This server reads NOAA&rsquo;s live planetary
              K-index — the <strong>GEOMAG K</strong> meter on your rig shows it. At K 0–2
              the band is open and far stations print clean. At K 5 and above a
              geomagnetic storm is underway and long paths collapse into static.
            </p>
            <p>
              A station 500 km away will nearly always print clean. The same words from
              12,000 km may surface as half noise — <span className="garble-sample">L#KE TH_S ·OPY
              R~GHT H#RE</span> — and on a stormy night, not at all. When only a needle-kick
              and a trace on the waterfall arrive, someone is out there; you just
              can&rsquo;t reach them tonight. Try again when the sun calms down.
            </p>
            <h3 className="page-title">§3 · THE CONTROLS</h3>
            <p>
              Every control on the faceplate is identified in <strong>FIG. 1</strong> below.
              Arrow keys nudge the VFO (hold SHIFT for 5 kc jumps); the wheel works on the
              knob; <strong>AF GAIN</strong> is your volume. To transmit, type into the
              message key and press <strong>XMIT</strong> — or press <strong>CQ</strong> and
              the rig keys the call for you. The rig is fully operable muted, but the band
              noise is half the atmosphere.
            </p>
          </section>

          <section className="page log-page" aria-labelledby="worked-title">
            <h3 id="worked-title" className="page-title">§4 · A WORKED CONTACT, LINE BY LINE</h3>
            <p className="log-intro">
              A specimen contact. Read it once and you know the full choreography
              of your first QSO:
            </p>
            <ol className="worked-log">
              {LOG_LINES.map((l) => (
                <li key={l.time} className={l.quiet ? 'quiet' : ''}>
                  <div className="log-line">
                    <span className="log-time">{l.time}</span>
                    <span className="log-text">{l.text}</span>
                  </div>
                  <p className="margin-note">{l.note}</p>
                </li>
              ))}
            </ol>
            <p className="log-coda">
              That&rsquo;s all there is. Call CQ when the frequency is clear, answer one
              when it isn&rsquo;t, always exchange a report and grid, always sign 73.
            </p>
          </section>
        </div>

        <figure className="figure-block">
          <FaceplateFigure />
          <figcaption>
            <span className="fig-label">FIG. 1 — TD-40 FRONT PANEL, REFERENCE NUMERALS</span>
            <ol className="fig-parts">
              <li><b>1</b> POWER — wakes the lamps, the noise, and the antenna</li>
              <li><b>2</b> VFO · KILOCYCLE CHANGE — the dial; your place on the band</li>
              <li><b>3</b> DIAL SCALE &amp; WATERFALL — bright traces are people</li>
              <li><b>4</b> SIGNAL METER — kicks when copy lands; read it for your RS</li>
              <li><b>5</b> GEOMAG K — live NOAA space weather; high K closes the band</li>
              <li><b>6</b> TRAFFIC GLASS — received copy surfaces here, then fades</li>
              <li><b>7</b> MESSAGE KEY · XMIT · CQ — your transmitter</li>
              <li><b>8</b> STATION PLATE — your callsign, grid, and shack</li>
            </ol>
          </figcaption>
        </figure>

        <div className="lower-spread">
          <section className="index-card" aria-labelledby="glossary-title">
            <h3 id="glossary-title" className="card-title">GLOSSARY — THE LINGO</h3>
            <dl className="glossary">
              {GLOSSARY.map(([term, def]) => (
                <div className="gl-row" key={term}>
                  <dt>{term}</dt>
                  <dd>{def}</dd>
                </div>
              ))}
            </dl>
          </section>

          <div className="side-sections">
            <section className="page" aria-labelledby="qsl-title">
              <h3 id="qsl-title" className="page-title">§5 · QSL CARDS &amp; YOUR SHACK</h3>
              <p>
                After you exchange legible copy with a station, press <strong>QSL?</strong> on
                their transmission. If they confirm within ten minutes, a card is minted —
                the one permanent thing on this band. Your collection hangs at your
                shack (the <strong>SHACK →</strong> link on your station plate), a rotary
                file with award plates: First Contact, DX Hound (5,000 km+), Storm Rider
                (a contact at K 5+), Ragchewer, Worked 3 Continents.
              </p>
            </section>
            <section className="page" aria-labelledby="beacon-title">
              <h3 id="beacon-title" className="page-title">§6 · ALWAYS ON THE AIR</h3>
              <p>Four beacons transmit around the clock — tune to one to judge conditions:</p>
              <table className="beacon-table">
                <thead>
                  <tr><th scope="col">MHZ</th><th scope="col">CALL</th><th scope="col">SENDS</th></tr>
                </thead>
                <tbody>
                  <tr><td>7.026</td><td>DK0WCY</td><td>The live K index, hourly truth</td></tr>
                  <tr><td>7.033</td><td>4U1UN</td><td>Beacon, New York</td></tr>
                  <tr><td>7.039</td><td>JA2IGY</td><td>Beacon, Mie, Japan</td></tr>
                  <tr><td>7.048</td><td>ZS6DN</td><td>Beacon, Pretoria</td></tr>
                </tbody>
              </table>
              <p className="numbers-note">
                7.157 — unidentified. Five-digit groups. Not our department.
              </p>
            </section>
          </div>
        </div>

        <footer className="paper-foot">
          <span>PRINTED BY THE DIAL BAND POST</span>
          <span>NOTHING ELSE IS</span>
        </footer>
      </article>
    </div>
  );
}
