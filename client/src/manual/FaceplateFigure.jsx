/* FIG. 1 — the TD-40 faceplate as a patent-style ink line drawing:
   ruled outline, reference numerals on curved leader lines, hatched
   end-cheeks. Pure vector geometry in one ink; the parts list in the
   figcaption ties the numerals to the real controls. */

const INK = '#3d3327';

function Numeral({ x: xIn, y: yIn, n, tx: txIn, ty: tyIn }) {
  // gently bowed leader from the numeral bubble to a dot on the part;
  // the bow is a fixed fraction of the leader length so short leaders
  // stay nearly straight and nothing sweeps across the drawing
  const x = Number(xIn);
  const y = Number(yIn);
  const tx = Number(txIn);
  const ty = Number(tyIn);
  const dx = tx - x;
  const dy = ty - y;
  const mx = x + dx / 2 - dy * 0.12;
  const my = y + dy / 2 + dx * 0.12;
  return (
    <g stroke={INK} fill="none" strokeWidth="1.1">
      <path d={`M ${x} ${y} Q ${mx.toFixed(1)} ${my.toFixed(1)} ${tx} ${ty}`} />
      <circle cx={tx} cy={ty} r="2.2" fill={INK} stroke="none" />
      <circle cx={x} cy={y} r="10" fill="#f2e9d4" />
      <text
        x={x}
        y={y + 4}
        textAnchor="middle"
        fontSize="12"
        fontWeight="700"
        fill={INK}
        stroke="none"
        className="qf-silk"
      >
        {n}
      </text>
    </g>
  );
}

export default function FaceplateFigure() {
  return (
    <svg viewBox="0 0 800 460" className="faceplate-fig" role="img" aria-label="Line drawing of the TD-40 front panel with reference numerals 1 through 8, identified in the parts list below">
      <defs>
        <pattern id="hatch" width="7" height="7" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="0" y2="7" stroke={INK} strokeWidth="1" />
        </pattern>
      </defs>

      <g stroke={INK} fill="none" strokeWidth="1.8">
        {/* chassis + cheeks */}
        <rect x="50" y="40" width="700" height="340" rx="8" />
        <rect x="50" y="40" width="26" height="340" fill="url(#hatch)" />
        <rect x="724" y="40" width="26" height="340" fill="url(#hatch)" />

        {/* corner screws */}
        {[[88, 54], [712, 54], [88, 366], [712, 366]].map(([cx, cy]) => (
          <g key={`${cx}-${cy}`}>
            <circle cx={cx} cy={cy} r="5" />
            <line x1={cx - 3.5} y1={cy} x2={cx + 3.5} y2={cy} />
          </g>
        ))}

        {/* badge */}
        <line x1="100" y1="72" x2="215" y2="72" strokeWidth="3" />
        <line x1="100" y1="82" x2="300" y2="82" strokeWidth="1" />

        {/* geomag meter, top right */}
        <rect x="615" y="55" width="80" height="46" rx="3" />
        <path d="M 630 92 A 28 28 0 0 1 680 92" strokeWidth="1.2" />
        <line x1="655" y1="92" x2="668" y2="72" strokeWidth="1.2" />
        <circle cx="590" cy="66" r="4" />
        <circle cx="590" cy="86" r="4" />

        {/* signal meter */}
        <rect x="95" y="115" width="140" height="88" rx="4" />
        <path d="M 115 188 A 55 55 0 0 1 215 188" strokeWidth="1.2" />
        <line x1="165" y1="188" x2="128" y2="146" strokeWidth="1.6" />

        {/* power toggle + lamp */}
        <circle cx="110" cy="242" r="5" />
        <rect x="130" y="233" width="44" height="18" rx="9" />
        <circle cx="142" cy="242" r="7" />

        {/* small knobs */}
        {[[115, 292, 18], [170, 292, 15], [222, 292, 15]].map(([cx, cy, r]) => (
          <g key={cx}>
            <circle cx={cx} cy={cy} r={r} />
            <line x1={cx} y1={cy - r + 3} x2={cx} y2={cy - r + 9} />
          </g>
        ))}

        {/* jacks */}
        <circle cx="128" cy="332" r="8" />
        <circle cx="128" cy="332" r="3.5" />
        <circle cx="185" cy="332" r="8" />
        <circle cx="185" cy="332" r="3.5" />

        {/* dial window: scale ticks + hairline + waterfall band */}
        <rect x="265" y="112" width="290" height="66" rx="3" />
        {[280, 305, 330, 355, 380, 405, 430, 455, 480, 505, 530].map((x, i) => (
          <line key={x} x1={x} y1="120" x2={x} y2={i % 2 ? 130 : 136} strokeWidth="1.1" />
        ))}
        <line x1="410" y1="114" x2="410" y2="146" strokeWidth="2.2" />
        <line x1="270" y1="148" x2="550" y2="148" strokeWidth="1" strokeDasharray="2 3" />

        {/* VFO knob */}
        <circle cx="410" cy="272" r="62" />
        <circle cx="410" cy="272" r="55" strokeWidth="1" />
        <line x1="410" y1="216" x2="410" y2="234" strokeWidth="2.2" />
        <circle cx="410" cy="238" r="8" strokeWidth="1.2" />

        {/* traffic glass */}
        <rect x="580" y="115" width="130" height="160" rx="4" />
        {[136, 152, 168, 190, 206].map((y) => (
          <line key={y} x1="592" y1={y} x2={y % 2 ? 668 : 696} y2={y} strokeWidth="1" />
        ))}

        {/* message key row */}
        <rect x="580" y="292" width="76" height="22" rx="3" />
        <rect x="662" y="292" width="22" height="22" rx="3" />
        <rect x="690" y="292" width="20" height="22" rx="3" />

        {/* bottom plates */}
        <rect x="95" y="340" width="380" height="26" rx="2" strokeWidth="1.2" />
        <rect x="500" y="340" width="180" height="26" rx="2" strokeWidth="1.2" />
      </g>

      {/* reference numerals: bubbles live in the margins, leaders stay short */}
      <Numeral n="1" x="26" y="260" tx="126" ty="243" />
      <Numeral n="2" x="410" y="440" tx="410" ty="336" />
      <Numeral n="3" x="300" y="16" tx="330" ty="112" />
      <Numeral n="4" x="26" y="122" tx="95" ty="136" />
      <Numeral n="5" x="560" y="16" tx="618" ty="58" />
      <Numeral n="6" x="774" y="164" tx="712" ty="172" />
      <Numeral n="7" x="620" y="440" tx="620" ty="316" />
      <Numeral n="8" x="540" y="440" tx="560" ty="366" />

      {/* witnessed margin, the drafting-room formality */}
      <text x="750" y="458" textAnchor="end" fontSize="10" fill="#b13527" className="qf-tty">
        WITNESSED · BAND POST DRAFTING RM.
      </text>
    </svg>
  );
}
