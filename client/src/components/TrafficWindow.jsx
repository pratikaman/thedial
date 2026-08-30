import { useEffect, useRef, useState } from 'react';

const FADE_START = 45_000;
const GONE = 75_000;

function opacityFor(age) {
  if (age < FADE_START) return 1;
  return Math.max(0, 1 - (age - FADE_START) / (GONE - FADE_START));
}

/* The traffic glass: received copy surfaces here and fades like a lamp
   cooling. Nothing scrolls back from before you were tuned in. */
const QSL_LABEL = {
  undefined: 'QSL?',
  sent: 'QSL SENT',
  offered: 'CONFIRM QSL',
  confirmed: 'QSL CFM',
};

const OFFER_TTL = 10 * 60 * 1000; // matches the server's QSL window

export default function TrafficWindow({
  messages, powered, linkStatus, note, onSend, onCq, canTx, qsl = {}, qslOffers = [], onQsl,
}) {
  const [draft, setDraft] = useState('');
  const logRef = useRef(null);
  const [, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick((n) => n + 1), 5000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const el = logRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  const now = Date.now();
  const visible = messages.filter((m) => now - m.ts < GONE);

  const key = () => {
    const text = draft.trim();
    if (!text || !canTx) return;
    onSend(text);
    setDraft('');
  };

  return (
    <>
      <div className="glass-window traffic" ref={logRef} role="log" aria-live="polite" aria-label="Received traffic">
        {powered && linkStatus === 'up' && visible.length === 0 && (
          <p className="band-note">
            NO TRAFFIC ON THIS FREQUENCY.
            <br />ROTATE THE VFO TOWARD A TRACE ON THE DIAL, OR PRESS CQ TO CALL.
            <br />COPY FADES IN 60 SECONDS AND IS NEVER RECORDED.
          </p>
        )}
        {powered && linkStatus === 'connecting' && (
          <p className="band-note">TUNING THE ANTENNA — LINKING TO THE BAND…</p>
        )}
        {powered && linkStatus === 'lost' && (
          <p className="sys-note">— LINK LOST — RETRYING —</p>
        )}
        {visible.map((m) => {
          if (m.kind === 'qsl') {
            return (
              <div key={m.id} className="qsl-filed" style={{ opacity: opacityFor(now - m.ts) }}>
                QSL CONFIRMED WITH {m.card.them.call} · CARD Nº{m.card.serial} FILED —{' '}
                <a href={`/shack/${m.card.me.call}`} target="_blank" rel="noreferrer">
                  VIEW SHACK
                </a>
              </div>
            );
          }
          const state = qsl[m.from];
          return (
            <div
              key={m.id}
              className={`qso ${m.self ? 'self' : ''} ${m.cq ? 'cq' : ''} ${m.beacon ? 'beacon' : ''}`}
              style={{ opacity: opacityFor(now - m.ts) }}
            >
              <div className="meta">
                <span>{m.at}Z</span>
                <span className="cs">{m.from}</span>
                <span>{m.grid}</span>
                {!m.self && <span>RS {m.rst}</span>}
                {!m.self && !m.beacon && (
                  <button
                    type="button"
                    className={`qsl-chip ${state === 'offered' ? 'offered' : ''}`}
                    disabled={state === 'sent' || state === 'confirmed' || !canTx}
                    onClick={() => onQsl(m.from)}
                    title="Exchange QSL cards to confirm this contact"
                  >
                    {QSL_LABEL[state]}
                  </button>
                )}
              </div>
              <div className="copy">{m.text}</div>
            </div>
          );
        })}
        {qslOffers
          .filter((o) => now - o.ts < OFFER_TTL && qsl[o.from] !== 'confirmed')
          .map((o) => (
            <div key={o.from} className="qsl-slip">
              <span>{o.from} REQUESTS QSL</span>
              <button
                type="button"
                className="qsl-chip offered"
                disabled={!canTx}
                onClick={() => onQsl(o.from)}
              >
                CONFIRM
              </button>
            </div>
          ))}
        {note && <p className="sys-note">{note}</p>}
      </div>
      <div className="key-row">
        <div className="glass-window">
          <input
            className="msg-input"
            type="text"
            value={draft}
            maxLength={160}
            placeholder={powered ? 'KEY YOUR MESSAGE…' : ''}
            aria-label="Message to transmit"
            disabled={!canTx}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') key();
            }}
          />
        </div>
        <button type="button" className="push-btn" onClick={key} disabled={!canTx || !draft.trim()}>
          XMIT
        </button>
        <button type="button" className="push-btn" onClick={onCq} disabled={!canTx} title="Call CQ — invite any station to answer">
          CQ
        </button>
      </div>
    </>
  );
}
