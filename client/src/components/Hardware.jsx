import { useEffect, useRef } from 'react';

export function Screw({ pos }) {
  // Slot angle varies per screw so the panel reads as hand-assembled.
  const angle = useRef(Math.floor(Math.random() * 180));
  return (
    <svg className={`screw ${pos}`} viewBox="0 0 13 13" aria-hidden="true">
      <defs>
        <radialGradient id={`sg-${pos}-${angle.current}`} cx="38%" cy="32%">
          <stop offset="0%" stopColor="#c9c6b8" />
          <stop offset="55%" stopColor="#8f8c7d" />
          <stop offset="100%" stopColor="#4e4b3e" />
        </radialGradient>
      </defs>
      <circle cx="6.5" cy="6.5" r="6" fill={`url(#sg-${pos}-${angle.current})`} />
      <line
        x1="2.5" y1="6.5" x2="10.5" y2="6.5"
        stroke="#2b2822" strokeWidth="1.6"
        transform={`rotate(${angle.current} 6.5 6.5)`}
      />
    </svg>
  );
}

export function Toggle({ on, onChange, label, disabled }) {
  return (
    <button
      type="button"
      className="toggle"
      role="switch"
      aria-checked={on}
      aria-pressed={on}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!on)}
    >
      <span className="bat" />
    </button>
  );
}

export function Lamp({ on, red, label }) {
  return (
    <span
      className={`lamp ${on ? 'on' : ''} ${red ? 'red' : ''}`}
      role="status"
      aria-label={`${label}: ${on ? 'lit' : 'dark'}`}
    />
  );
}

/* Analog meter: cream face, inked arc, sprung needle. `valueRef.target`
   is read every frame; kicks decay inside the meter so callers just set
   valueRef.kick. */
export function Meter({
  valueRef, powered, labels, redFrom = 0.8, caption, width = 220, height = 118,
  ambient = false, small = false,
}) {
  const tickFont = small ? 14 : 9.5;
  const capFont = small ? 13 : 10;
  const needleRef = useRef(null);

  useEffect(() => {
    let raf;
    let disp = 0;
    let vel = 0;
    const loop = (now) => {
      const v = valueRef.current;
      if (ambient) v.kick = (v.kick ?? 0) * 0.94;
      const wobble = ambient && powered ? Math.sin(now / 900) * 0.012 + Math.random() * 0.01 : 0;
      const floor = ambient && powered ? 0.09 : 0;
      const target = powered ? Math.min(1, floor + (v.kick ?? 0) + (v.steady ?? 0) + wobble) : 0;
      vel += (target - disp) * 0.16;
      vel *= 0.78;
      disp += vel;
      if (needleRef.current) {
        needleRef.current.setAttribute('transform', `rotate(${-52 + disp * 104} 110 108)`);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [valueRef, powered, ambient]);

  const arc = (r, a0, a1) => {
    const p = (a) => [110 + r * Math.sin((a * Math.PI) / 180), 108 - r * Math.cos((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    return `M ${x0} ${y0} A ${r} ${r} 0 0 1 ${x1} ${y1}`;
  };

  const ticks = labels.map((lab, i) => {
    const a = -52 + (i / (labels.length - 1)) * 104;
    const rad = (a * Math.PI) / 180;
    const x1 = 110 + 84 * Math.sin(rad);
    const y1 = 108 - 84 * Math.cos(rad);
    const x2 = 110 + 74 * Math.sin(rad);
    const y2 = 108 - 74 * Math.cos(rad);
    const lx = 110 + 64 * Math.sin(rad);
    const ly = 108 - 64 * Math.cos(rad) + 3;
    return (
      <g key={lab}>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--meter-ink)" strokeWidth="2" />
        <text x={lx} y={ly} textAnchor="middle" fontSize={tickFont} fontWeight="600"
          fontFamily="var(--f-silk)" fill="var(--meter-ink)">{lab}</text>
      </g>
    );
  });

  return (
    <div className="meter-bezel">
      <svg viewBox="0 0 220 118" width={width} height={height} role="img" aria-label={caption}>
        <rect x="2" y="2" width="216" height="114" rx="4" fill="var(--meter-face)" />
        {/* lamp wash across the face when powered */}
        <rect x="2" y="2" width="216" height="114" rx="4"
          fill="var(--amber)" opacity={powered ? 0.1 : 0} style={{ transition: 'opacity .9s ease-out' }} />
        <path d={arc(79, -52, 52)} fill="none" stroke="var(--meter-ink)" strokeWidth="1.6" />
        <path d={arc(79, -52 + redFrom * 104, 52)} fill="none" stroke="var(--meter-red)" strokeWidth="4" />
        {ticks}
        <text x="110" y="100" textAnchor="middle" fontSize={capFont} fontWeight="700"
          fontFamily="var(--f-silk)" letterSpacing="2" fill="var(--meter-ink)">{caption}</text>
        <line ref={needleRef} x1="110" y1="108" x2="110" y2="32"
          stroke="#1a140c" strokeWidth="2.2" transform="rotate(-52 110 108)" />
        <circle cx="110" cy="108" r="7" fill="#1a140c" />
        {/* glass */}
        <rect x="2" y="2" width="216" height="60" rx="4" fill="url(#meterGlass)" opacity="0.55" />
        <defs>
          <linearGradient id="meterGlass" x1="0" y1="0" x2="0.3" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

/* Small rotary control: drag up/down or scroll to set 0..1. */
export function SmallKnob({ value, onChange, label, size = 62, disabled }) {
  const ref = useRef(null);
  const drag = useRef(null);

  const angle = -135 + value * 270;

  const startDrag = (e) => {
    if (disabled) return;
    e.preventDefault();
    ref.current.setPointerCapture(e.pointerId);
    drag.current = { y: e.clientY, v: value };
  };
  const moveDrag = (e) => {
    if (!drag.current) return;
    const dv = (drag.current.y - e.clientY) / 140;
    onChange(Math.min(1, Math.max(0, drag.current.v + dv)));
  };
  const endDrag = () => { drag.current = null; };

  return (
    <div className="knob-cluster">
      <button
        type="button"
        ref={ref}
        className="knob"
        style={{ width: size, height: size }}
        aria-label={label}
        role="slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(value * 100)}
        disabled={disabled}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onWheel={(e) => {
          if (disabled) return;
          onChange(Math.min(1, Math.max(0, value - Math.sign(e.deltaY) * 0.06)));
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          if (e.key === 'ArrowUp' || e.key === 'ArrowRight') onChange(Math.min(1, value + 0.05));
          if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') onChange(Math.max(0, value - 0.05));
        }}
      >
        <span className="pointer" style={{ transform: `rotate(${angle}deg)` }} />
      </button>
      <span className="silk-label dim">{label}</span>
    </div>
  );
}

/* Fixed selector: this rig has one band and one mode, and says so. */
export function FixedSelector({ label, positions, index }) {
  return (
    <div className="knob-cluster" role="img" aria-label={`${label} selector, fixed at ${positions[index]}`}>
      <div className="knob" style={{ width: 52, height: 52 }} aria-hidden="true">
        <span
          className="pointer"
          style={{ transform: `rotate(${-40 + (index / Math.max(1, positions.length - 1)) * 80}deg)` }}
        />
      </div>
      <span className="silk-label dim">{label} · {positions[index]}</span>
    </div>
  );
}
