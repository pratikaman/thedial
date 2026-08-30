import { useCallback, useEffect, useRef, useState } from 'react';
import QslCard from './QslCard.jsx';
import './shack.css';

const API = location.port === '5173' ? `http://${location.hostname}:8787` : '';

/* Mechanical drum digit: the strip rolls, the window stays. */
function Drum({ value }) {
  return (
    <span className="drum-window" aria-hidden="true">
      <span className="drum-strip" style={{ transform: `translateY(${-value}em)` }}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </span>
    </span>
  );
}

function DrumCounter({ value, total }) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div
      className="drum-counter"
      role="status"
      aria-label={`Card ${value} of ${total}`}
    >
      {[...pad(value)].map((c, i) => <Drum key={`v${i}`} value={Number(c)} />)}
      <span className="drum-sep">∕</span>
      {[...pad(total)].map((c, i) => <Drum key={`t${i}`} value={Number(c)} />)}
    </div>
  );
}

/* The flip knob: same machined family as the rig's VFO, one detent per card. */
function FlipKnob({ onStep, disabled }) {
  const ref = useRef(null);
  const state = useRef({ angle: 0, lastA: 0, dragging: false, acc: 0 });

  const apply = () => {
    const el = ref.current?.querySelector('.pointer');
    if (el) el.style.transform = `rotate(${state.current.angle}deg)`;
  };

  const angleOf = (e) => {
    const r = ref.current.getBoundingClientRect();
    return (Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180) / Math.PI;
  };

  useEffect(() => {
    const el = ref.current;
    const onWheel = (e) => {
      if (disabled) return;
      e.preventDefault();
      const dir = Math.sign(e.deltaY);
      state.current.angle += dir * 42;
      apply();
      onStep(dir);
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [onStep, disabled]);

  return (
    <button
      type="button"
      ref={ref}
      className="knob flip-knob"
      aria-label="Flip through cards"
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return;
        e.preventDefault();
        ref.current.setPointerCapture(e.pointerId);
        state.current.dragging = true;
        state.current.lastA = angleOf(e);
        state.current.acc = 0;
      }}
      onPointerMove={(e) => {
        const s = state.current;
        if (!s.dragging) return;
        const a = angleOf(e);
        let d = a - s.lastA;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        s.lastA = a;
        s.angle += d;
        s.acc += d;
        apply();
        while (s.acc > 42) { s.acc -= 42; onStep(1); }
        while (s.acc < -42) { s.acc += 42; onStep(-1); }
      }}
      onPointerUp={() => { state.current.dragging = false; }}
      onPointerCancel={() => { state.current.dragging = false; }}
      onKeyDown={(e) => {
        if (disabled) return;
        const dir =
          e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1
          : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1
          : 0;
        if (!dir) return;
        // the knob reports true state: keyboard detents turn it too
        state.current.angle += dir * 42;
        apply();
        onStep(dir);
        e.preventDefault();
      }}
    >
      <span className="pointer" />
      <span className="dimple" />
    </button>
  );
}

function AwardPlate({ award }) {
  return (
    <div
      className={`award-plate ${award.earned ? 'earned' : ''}`}
      title={award.rule}
      role="listitem"
    >
      <span className={`lamp small ${award.earned ? 'on' : ''}`} aria-hidden="true" />
      <span className="award-name">{award.name}</span>
      <span className="award-rule">{award.rule}</span>
      <span className="sr-only">{award.earned ? 'earned' : 'not yet earned'}</span>
    </div>
  );
}

export default function Shack({ callsign }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let alive = true;
    fetch(`${API}/api/shack/${encodeURIComponent(callsign)}`)
      .then(async (r) => {
        if (!r.ok) throw new Error((await r.json()).error ?? 'unreachable');
        return r.json();
      })
      .then((d) => alive && setData(d))
      .catch((e) => alive && setError(e.message));
    return () => { alive = false; };
  }, [callsign]);

  const total = data?.cards.length ?? 0;

  const step = useCallback(
    (dir) => {
      if (!total) return;
      setIndex((i) => (i + dir + total) % total);
    },
    [total],
  );

  // arrow keys flip from anywhere on the page — except when the knob has
  // focus, which handles (and animates) its own detents
  useEffect(() => {
    const onKey = (e) => {
      if (e.target?.closest?.('.flip-knob')) return;
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  const card = total ? data.cards[index] : null;

  return (
    <div className="shack-room">
      <header className="shack-head">
        <a className="back-link" href="/">← THE DIAL</a>
        <h1>STATION SHACK</h1>
        <a className="back-link" href="/manual" style={{ marginLeft: 'auto' }}>PRIMER</a>
      </header>

      {error && (
        <div className="plate shack-plate error-plate">
          <span className="rivet tl" /><span className="rivet tr" />
          <span className="rivet bl" /><span className="rivet br" />
          <h2>{callsign}</h2>
          <p>{error.toUpperCase()}. WORK THE BAND FIRST — THE SHACK ONLY KNOWS STATIONS THAT HAVE BEEN ON THE AIR.</p>
        </div>
      )}

      {data && (
        <>
          <section className="shack-plates">
            <div className="plate shack-plate">
              <span className="rivet tl" /><span className="rivet tr" />
              <span className="rivet bl" /><span className="rivet br" />
              <h2>Station</h2>
              <p className="big-call">{data.station.callsign}</p>
              <p className="sub">
                GRID {data.station.grid} · {total} CONFIRMED {total === 1 ? 'QSO' : 'QSOS'}
              </p>
            </div>
            <div className="awards-row" role="list" aria-label="Awards">
              {data.awards.map((a) => (
                <AwardPlate key={a.id} award={a} />
              ))}
            </div>
          </section>

          <main className="rolodex">
            {card ? (
              <div className="card-well">
                <div className="card-flip" key={card.id}>
                  <QslCard card={card} />
                </div>
              </div>
            ) : (
              <div className="card-well">
                <div className="empty-sleeve">
                  <p>
                    NO CARDS ON FILE.
                    <br />
                    WORK A STATION, THEN PRESS QSL ON THEIR TRANSMISSION —
                    <br />
                    WHEN BOTH SIDES CONFIRM, THE CARD IS PRINTED HERE FOREVER.
                  </p>
                  <a className="back-link" href="/">GO WORK THE BAND →</a>
                </div>
              </div>
            )}

            <div className="file-controls">
              <FlipKnob onStep={step} disabled={total < 2} />
              <DrumCounter value={total ? index + 1 : 0} total={total} />
              <span className="silk-label dim">ROTARY FILE · ← → TO FLIP</span>
            </div>
          </main>
        </>
      )}
    </div>
  );
}
