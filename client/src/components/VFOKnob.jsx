import { useEffect, useRef } from 'react';

const KHZ_PER_DEG = 12 / 360; // one full turn sweeps 12 kHz

/* The main tuning knob: weighted, with flywheel inertia. Rotation is
   driven imperatively (style.transform) so dragging never re-renders. */
export default function VFOKnob({ onDelta, velRef, freqLabel, disabled }) {
  const btnRef = useRef(null);
  const state = useRef({ angle: 0, dragging: false, lastA: 0, vel: 0, raf: 0 });

  const applyAngle = () => {
    const el = btnRef.current?.querySelector('.pointer');
    if (el) el.style.transform = `rotate(${state.current.angle}deg)`;
  };

  const angleOf = (e) => {
    const r = btnRef.current.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  // React registers wheel listeners passively; the dial must own the wheel.
  useEffect(() => {
    const el = btnRef.current;
    const onWheel = (e) => {
      if (disabled) return;
      e.preventDefault();
      const d = -Math.sign(e.deltaY) * 0.5;
      state.current.angle += d / KHZ_PER_DEG;
      onDelta(d);
      velRef.current.v = d * 25;
      applyAngle();
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [disabled, onDelta, velRef]);

  useEffect(() => {
    const s = state.current;
    const spin = () => {
      if (!s.dragging && Math.abs(s.vel) > 0.02) {
        s.vel *= 0.955; // flywheel friction
        s.angle += s.vel;
        onDelta(s.vel * KHZ_PER_DEG);
        velRef.current.v = s.vel * KHZ_PER_DEG * 60;
        applyAngle();
      }
      s.raf = requestAnimationFrame(spin);
    };
    s.raf = requestAnimationFrame(spin);
    return () => cancelAnimationFrame(s.raf);
  }, [onDelta, velRef]);

  const down = (e) => {
    if (disabled) return;
    e.preventDefault();
    btnRef.current.setPointerCapture(e.pointerId);
    const s = state.current;
    s.dragging = true;
    s.lastA = angleOf(e);
    s.vel = 0;
  };

  const move = (e) => {
    const s = state.current;
    if (!s.dragging) return;
    const a = angleOf(e);
    let d = a - s.lastA;
    if (d > 180) d -= 360;
    if (d < -180) d += 360;
    s.lastA = a;
    s.angle += d;
    s.vel = d;
    onDelta(d * KHZ_PER_DEG);
    velRef.current.v = d * KHZ_PER_DEG * 60;
    applyAngle();
  };

  const up = () => { state.current.dragging = false; };

  return (
    <button
      type="button"
      ref={btnRef}
      className="knob vfo"
      role="slider"
      aria-label="VFO tuning"
      aria-valuemin={7000}
      aria-valuemax={7200}
      aria-valuetext={freqLabel}
      disabled={disabled}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerCancel={up}
      onKeyDown={(e) => {
        if (disabled) return;
        const step = e.shiftKey ? 5 : 0.5;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') { onDelta(step); e.preventDefault(); }
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') { onDelta(-step); e.preventDefault(); }
      }}
    >
      <span className="pointer" />
      <span className="dimple" />
    </button>
  );
}
