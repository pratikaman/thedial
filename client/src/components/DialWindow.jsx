import { useEffect, useRef } from 'react';

const SPAN = 50; // kHz visible through the glass
const SCALE_H = 46;
const FALL_H = 64;

/* Backlit dial glass: sliding frequency scale over a live waterfall.
   Reads freqRef/activityRef every frame; React never re-renders this. */
export default function DialWindow({ freqRef, velRef, activityRef, powered, audio }) {
  const scaleRef = useRef(null);
  const fallRef = useRef(null);
  const counterRef = useRef(null);
  const poweredRef = useRef(powered);
  poweredRef.current = powered;

  useEffect(() => {
    const scale = scaleRef.current;
    const fall = fallRef.current;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    let w = 0;
    let raf;
    let lastRow = 0;

    const resize = () => {
      w = scale.parentElement.clientWidth;
      for (const c of [scale, fall]) {
        c.width = Math.floor(w * dpr);
        c.style.height = `${c === scale ? SCALE_H : FALL_H}px`;
      }
      scale.height = Math.floor(SCALE_H * dpr);
      fall.height = Math.floor(FALL_H * dpr);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(scale.parentElement);

    const sctx = scale.getContext('2d');
    const fctx = fall.getContext('2d');

    const xOf = (f, khz) => ((f - (khz - SPAN / 2)) / SPAN) * scale.width;

    const drawScale = (khz) => {
      sctx.clearRect(0, 0, scale.width, scale.height);
      if (!poweredRef.current) return;
      const h = scale.height;
      const left = khz - SPAN / 2;
      const right = khz + SPAN / 2;

      for (let i = Math.ceil(left * 2); i <= Math.floor(right * 2); i += 1) {
        if (i < 0 || i > 400) continue;
        const f = i / 2;
        const x = xOf(f, khz);
        const isTen = i % 20 === 0;
        const isFive = i % 10 === 0;
        const isOne = i % 2 === 0;
        if (isTen) {
          sctx.strokeStyle = '#ffb45c';
          sctx.lineWidth = 2 * dpr;
          sctx.beginPath();
          sctx.moveTo(x, h);
          sctx.lineTo(x, h - 20 * dpr);
          sctx.stroke();
          sctx.fillStyle = '#d99f56';
          sctx.font = `600 ${10 * dpr}px 'Barlow Semi Condensed', sans-serif`;
          sctx.textAlign = 'center';
          sctx.fillText(`7.${String(Math.round(f)).padStart(3, '0')}`, x, h - 26 * dpr);
        } else if (isFive) {
          sctx.strokeStyle = '#c9821f';
          sctx.lineWidth = 1.6 * dpr;
          sctx.beginPath();
          sctx.moveTo(x, h);
          sctx.lineTo(x, h - 14 * dpr);
          sctx.stroke();
        } else if (isOne) {
          sctx.strokeStyle = '#8a5c22';
          sctx.lineWidth = 1 * dpr;
          sctx.beginPath();
          sctx.moveTo(x, h);
          sctx.lineTo(x, h - 10 * dpr);
          sctx.stroke();
        } else {
          sctx.strokeStyle = '#5c3f1c';
          sctx.lineWidth = 1 * dpr;
          sctx.beginPath();
          sctx.moveTo(x, h);
          sctx.lineTo(x, h - 5 * dpr);
          sctx.stroke();
        }
      }

      // band edges
      for (const edge of [0, 200]) {
        const x = xOf(edge, khz);
        if (x >= 0 && x <= scale.width) {
          sctx.fillStyle = '#e0503a';
          sctx.fillRect(x - 1.5 * dpr, 0, 3 * dpr, h);
        }
      }

      // fixed cursor hairline
      sctx.fillStyle = '#e0503a';
      sctx.fillRect(scale.width / 2 - dpr, 0, 2 * dpr, h);
    };

    const heat = (e) => {
      // amber intensity ramp
      const t = Math.min(1, e);
      const r = Math.round(20 + t * 235);
      const g = Math.round(13 + t * 170);
      const b = Math.round(4 + t * 110);
      return [r, g, b];
    };

    const drawFall = (khz, now) => {
      if (!poweredRef.current) {
        fctx.clearRect(0, 0, fall.width, fall.height);
        return;
      }
      if (now - lastRow < 33) return; // ~30 rows/sec
      lastRow = now;
      // shift the picture down one row
      fctx.drawImage(fall, 0, 0, fall.width, fall.height - 1, 0, 1, fall.width, fall.height - 1);
      const row = fctx.createImageData(fall.width, 1);
      const act = activityRef.current;
      const cols = new Float32Array(fall.width);
      const put = (fKhz, e) => {
        const x = Math.round(xOf(fKhz, khz));
        for (let dx = -4; dx <= 4; dx += 1) {
          const xx = x + dx;
          if (xx < 0 || xx >= fall.width) continue;
          cols[xx] += e * Math.exp(-(dx * dx) / 5);
        }
      };
      for (const a of act.list) put(a.ch / 2, a.e * 0.85);
      act.transients = act.transients.filter((tr) => now - tr.t < 1600);
      for (const tr of act.transients) put(tr.ch / 2, tr.e * (1 - (now - tr.t) / 1600));
      let nearest = null;
      for (let x = 0; x < fall.width; x += 1) {
        const e = Math.min(1, cols[x] + 0.03 + Math.random() * 0.09);
        const [r, g, b] = heat(e);
        row.data[x * 4] = r;
        row.data[x * 4 + 1] = g;
        row.data[x * 4 + 2] = b;
        row.data[x * 4 + 3] = 255;
      }
      fctx.putImageData(row, 0, 0);

      // beat note against the strongest nearby signal
      for (const a of [...act.list, ...act.transients]) {
        const off = a.ch / 2 - khz;
        if (Math.abs(off) < 1.6 && (!nearest || a.e > nearest.e)) nearest = { off, e: a.e };
      }
      if (audio) {
        if (nearest) audio.beat(nearest.off, nearest.e);
        else audio.beat(9, 0);
      }
    };

    const fmt = (khz) => {
      const whole = Math.floor(khz);
      const frac = Math.round((khz - whole) * 10) % 10;
      return `7.${String(whole).padStart(3, '0')}.${frac}`;
    };

    const loop = (now) => {
      const khz = freqRef.current.khz;
      drawScale(khz);
      drawFall(khz, now);
      if (counterRef.current) counterRef.current.textContent = fmt(khz);
      // tuning whine follows the flywheel
      const v = velRef.current;
      if (audio) audio.tuning(v.v);
      v.v *= 0.88;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [freqRef, velRef, activityRef, audio]);

  return (
    <div className="glass-window dial-glass" aria-hidden="true">
      <canvas ref={scaleRef} />
      <canvas ref={fallRef} />
      <div className="counter">
        <span ref={counterRef}>7.037.0</span> <span className="unit">MHZ</span>
      </div>
    </div>
  );
}
