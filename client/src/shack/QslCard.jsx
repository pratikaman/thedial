// The QSL card — the one artifact The Dial ever mints. Deterministic art
// seeded by the card id: accent ink, border style, stamp motif, and
// postmark angle vary card to card; the layout is the band post's standard.

function seedFrom(id) {
  let h = 2166136261;
  for (const c of id) {
    h ^= c.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const INKS = ['#b13527', '#2b4a8e', '#3d3327']; // madder red, air-mail blue, iron ink

function fmtDate(iso) {
  const d = new Date(iso);
  const months = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  return `${String(d.getUTCDate()).padStart(2, '0')} ${months[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

function fmtTime(iso) {
  return `${new Date(iso).toISOString().slice(11, 16)}Z`;
}

// Small engraved motifs for the postage stamp corner.
function StampMotif({ kind, x, y }) {
  if (kind === 0) {
    // the dial
    return (
      <g transform={`translate(${x} ${y})`} stroke="currentColor" fill="none" strokeWidth="1.6">
        <circle cx="0" cy="0" r="13" />
        <line x1="0" y1="0" x2="0" y2="-10" />
        <circle cx="0" cy="0" r="2.4" fill="currentColor" stroke="none" />
      </g>
    );
  }
  if (kind === 1) {
    // the meter
    return (
      <g transform={`translate(${x} ${y})`} stroke="currentColor" fill="none" strokeWidth="1.6">
        <rect x="-14" y="-9" width="28" height="18" rx="2" />
        <path d="M -9 6 A 11 11 0 0 1 9 6" />
        <line x1="0" y1="6" x2="7" y2="-4" />
      </g>
    );
  }
  // the antenna
  return (
    <g transform={`translate(${x} ${y})`} stroke="currentColor" fill="none" strokeWidth="1.6">
      <line x1="0" y1="12" x2="0" y2="-6" />
      <path d="M -10 -2 L 0 -12 L 10 -2" />
      <line x1="-7" y1="12" x2="7" y2="12" />
    </g>
  );
}

export default function QslCard({ card }) {
  const rand = mulberry32(seedFrom(card.id));
  const ink = INKS[Math.floor(rand() * INKS.length)];
  const airmail = rand() < 0.65;
  const motif = Math.floor(rand() * 3);
  const postmarkAngle = -16 + rand() * 32;
  const paper = rand() < 0.5 ? '#f2e9d4' : '#f4ecdb';
  const storm = card.k >= 5;

  // airmail border: alternating red/blue slanted dashes, drawn as explicit
  // parallelograms so no transform-origin support is assumed
  const dashes = [];
  if (airmail) {
    const step = 18;
    const slant = 4;
    let i = 0;
    for (let x = 10; x < 540; x += step, i += 1) {
      const c = i % 2 ? '#b13527' : '#2b4a8e';
      dashes.push(<path key={`t${x}`} d={`M ${x + slant} 4 h 11 l -${slant} 8 h -11 Z`} fill={c} />);
      dashes.push(<path key={`b${x}`} d={`M ${x + slant} 348 h 11 l -${slant} 8 h -11 Z`} fill={i % 2 ? '#2b4a8e' : '#b13527'} />);
    }
    i = 0;
    for (let y = 18; y < 336; y += step, i += 1) {
      const c = i % 2 ? '#b13527' : '#2b4a8e';
      dashes.push(<path key={`l${y}`} d={`M 4 ${y + slant} v 11 l 8 -${slant} v -11 Z`} fill={c} />);
      dashes.push(<path key={`r${y}`} d={`M 548 ${y + slant} v 11 l 8 -${slant} v -11 Z`} fill={i % 2 ? '#2b4a8e' : '#b13527'} />);
    }
  }

  return (
    <svg
      viewBox="0 0 560 360"
      className="qsl-card"
      role="img"
      aria-label={`QSL card number ${card.serial} from ${card.them.call}, confirming contact with ${card.me.call}`}
    >
      <rect x="0" y="0" width="560" height="360" rx="6" fill={paper} />
      {/* faint paper grain */}
      <rect x="0" y="0" width="560" height="360" rx="6" fill="url(#paperShade)" opacity="0.5" />
      {airmail ? (
        dashes
      ) : (
        <>
          <rect x="7" y="7" width="546" height="346" rx="3" fill="none" stroke={ink} strokeWidth="2" />
          <rect x="13" y="13" width="534" height="334" rx="2" fill="none" stroke={ink} strokeWidth="0.8" />
        </>
      )}

      <text x="34" y="48" className="qf-silk" fontWeight="700" fontSize="13" letterSpacing="3" fill="#3d3327">
        THE DIAL · 40 METER BAND POST
      </text>
      <text x="34" y="66" className="qf-tty" fontSize="11" fill="#6b5f49">
        Nº {String(card.serial).padStart(6, '0')}
      </text>

      {/* the sender's callsign — the card is their confirmation */}
      <text
        x="280" y="172"
        textAnchor="middle"
        className="qf-silk"
        fontWeight="700"
        fontSize="86"
        letterSpacing="4"
        fill={ink}
      >
        {card.them.call}
      </text>
      <text x="280" y="204" textAnchor="middle" className="qf-silk" fontWeight="600" fontSize="14" letterSpacing="4" fill="#3d3327">
        CONFIRMING QSO WITH {card.me.call}
      </text>

      {/* the log line */}
      <line x1="60" y1="238" x2="500" y2="238" stroke="#3d3327" strokeWidth="1" />
      <g className="qf-tty" fontSize="14" fill="#2b2419">
        <text x="72" y="262">{fmtDate(card.at)}</text>
        <text x="212" y="262">{fmtTime(card.at)}</text>
        <text x="292" y="262">{card.mhz.toFixed(3)} MHZ</text>
        <text x="430" y="262">RS {card.me.rs}</text>
      </g>
      <g className="qf-silk" fontWeight="600" fontSize="9" letterSpacing="2" fill="#6b5f49">
        <text x="72" y="278">DATE</text>
        <text x="212" y="278">UTC</text>
        <text x="292" y="278">FREQUENCY</text>
        <text x="430" y="278">UR REPORT</text>
      </g>

      <text x="72" y="318" className="qf-tty" fontSize="13" fill="#2b2419">
        {card.them.grid} → {card.me.grid} · {card.km.toLocaleString()} KM · GEOMAG K {card.k}
      </text>
      <text x="72" y="336" className="qf-tty" fontSize="12" fill="#6b5f49">
        73 DE {card.them.call}
      </text>

      {/* postage stamp */}
      <g transform="translate(462 34)" color={ink}>
        <rect
          x="0" y="0" width="66" height="82" rx="2"
          fill={paper}
          stroke={ink}
          strokeWidth="1.6"
          strokeDasharray="4 3"
        />
        <rect x="6" y="6" width="54" height="70" fill="none" stroke={ink} strokeWidth="1" />
        <StampMotif kind={motif} x={33} y={36} />
        <text x="33" y="68" textAnchor="middle" className="qf-silk" fontWeight="700" fontSize="12" fill={ink}>
          73
        </text>
      </g>

      {/* postmark */}
      <g transform={`translate(430 78) rotate(${postmarkAngle.toFixed(1)})`} opacity="0.82">
        <circle cx="0" cy="0" r="34" fill="none" stroke="#3d3327" strokeWidth="1.6" strokeDasharray="2 2.5" />
        <circle cx="0" cy="0" r="24" fill="none" stroke="#3d3327" strokeWidth="0.9" />
        <text x="0" y="-27.5" textAnchor="middle" className="qf-silk" fontWeight="600" fontSize="7.5" letterSpacing="1.4" fill="#3d3327">
          BAND POST
        </text>
        <text x="0" y="3" textAnchor="middle" className="qf-tty" fontSize="9" fill="#3d3327">
          {fmtDate(card.at)}
        </text>
        <text x="0" y="31.5" textAnchor="middle" className="qf-silk" fontWeight="600" fontSize="7.5" letterSpacing="1.4" fill="#3d3327">
          EPHEMERA
        </text>
      </g>

      {/* storm overprint */}
      {storm && (
        <g transform="translate(280 258) rotate(-11)">
          <rect x="-104" y="-24" width="208" height="44" fill="none" stroke="#b13527" strokeWidth="3" />
          <text x="0" y="9" textAnchor="middle" className="qf-silk" fontWeight="700" fontSize="26" letterSpacing="8" fill="#b13527" opacity="0.9">
            STORM K{card.k}
          </text>
        </g>
      )}

      <defs>
        <linearGradient id="paperShade" x1="0" y1="0" x2="0.6" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#8a7a5c" stopOpacity="0.18" />
        </linearGradient>
      </defs>
    </svg>
  );
}
