import { useCallback, useEffect, useRef, useState } from 'react';
import { RigAudio } from './audio.js';
import { BandLink, tokenKey } from './link.js';
import { Screw, Toggle, Lamp, Meter, SmallKnob, FixedSelector } from './components/Hardware.jsx';
import VFOKnob from './components/VFOKnob.jsx';
import DialWindow from './components/DialWindow.jsx';
import TrafficWindow from './components/TrafficWindow.jsx';
import { InstructionPlate, StationPlate } from './components/Plates.jsx';

const clampKhz = (k) => Math.min(200, Math.max(0, k));

export default function App() {
  const [powered, setPowered] = useState(false);
  const [station, setStation] = useState(null);
  const [linkStatus, setLinkStatus] = useState('off');
  const [cond, setCond] = useState({ k: 2, source: 'estimate' });
  const [messages, setMessages] = useState([]);
  const [note, setNote] = useState('');
  const [volume, setVolume] = useState(0.7);
  const [txLit, setTxLit] = useState(false);
  const [freqLabel, setFreqLabel] = useState('7.074.0 MHz');
  const [qsl, setQsl] = useState({}); // callsign -> 'sent' | 'offered' | 'confirmed'
  const [qslOffers, setQslOffers] = useState([]); // pending requests: {from, ts}

  const freqRef = useRef({ khz: 74 });
  const velRef = useRef({ v: 0 });
  const activityRef = useRef({ list: [], transients: [] });
  const sMeterRef = useRef({ kick: 0 });
  const condMeterRef = useRef({ steady: 2 / 9 });
  const audioRef = useRef(null);
  const linkRef = useRef(null);
  const tuneTimer = useRef(null);
  const noteTimer = useRef(null);
  const idRef = useRef(0);

  if (!audioRef.current) audioRef.current = new RigAudio();

  const showNote = useCallback((text) => {
    setNote(text);
    clearTimeout(noteTimer.current);
    noteTimer.current = setTimeout(() => setNote(''), 4000);
  }, []);

  // One link for the app's life — created in a ref (not useMemo) so a dev
  // hot-reload can never split "receiving" and "sending" across two instances.
  if (!linkRef.current) {
    linkRef.current = new BandLink({
      status: (s) => setLinkStatus(s),
      hello: (m) => {
        setStation({ callsign: m.callsign, grid: m.grid });
        freqRef.current.khz = m.khz;
        try {
          localStorage.setItem(tokenKey(), m.token);
        } catch {
          // private mode: identity lasts one session, which is fine
        }
      },
      cond: (m) => {
        setCond(m);
        condMeterRef.current.steady = m.k / 9;
      },
      band: (m) => {
        activityRef.current.list = m.a;
      },
      rx: (m) => {
        idRef.current += 1;
        setMessages((prev) => [...prev.slice(-40), { ...m, id: idRef.current, ts: Date.now() }]);
        if (!m.self) {
          sMeterRef.current.kick = Math.max(sMeterRef.current.kick, 0.25 + m.q * 0.65);
          audioRef.current.rxBurst(m.q);
        }
        activityRef.current.transients.push({ ch: m.ch, e: Math.max(0.5, m.q), t: performance.now() });
      },
      carrier: (m) => {
        sMeterRef.current.kick = Math.max(sMeterRef.current.kick, 0.15 + m.s * 0.4);
        activityRef.current.transients.push({ ch: m.ch, e: m.s, t: performance.now() });
      },
      sys: (m) => showNote(m.text),
      'qsl-offer': (m) => {
        setQsl((prev) => ({ ...prev, [m.from]: 'offered' }));
        setQslOffers((prev) =>
          prev.some((o) => o.from === m.from) ? prev : [...prev, { from: m.from, ts: Date.now() }],
        );
      },
      'qsl-card': (m) => {
        setQsl((prev) => ({ ...prev, [m.card.them.call]: 'confirmed' }));
        setQslOffers((prev) => prev.filter((o) => o.from !== m.card.them.call));
        idRef.current += 1;
        setMessages((prev) => [
          ...prev.slice(-40),
          { kind: 'qsl', card: m.card, id: idRef.current, ts: Date.now() },
        ]);
      },
    });
  }

  // POWER — the one gesture that wakes audio, link, lamps.
  const setPower = useCallback((on) => {
    setPowered(on);
    if (on) {
      audioRef.current.powerOn();
    } else {
      audioRef.current.powerOff();
      setStation(null);
      setMessages([]);
      setQsl({});
      setQslOffers([]);
      setLinkStatus('off');
      activityRef.current.list = [];
      activityRef.current.transients = [];
    }
  }, []);

  // Link lives exactly as long as the rig is powered. As an effect pair it
  // also survives dev hot-reloads (teardown + reconnect) instead of dying.
  useEffect(() => {
    if (!powered) return undefined;
    linkRef.current.connect();
    return () => linkRef.current.disconnect();
  }, [powered]);

  const scheduleTune = useCallback(() => {
    clearTimeout(tuneTimer.current);
    tuneTimer.current = setTimeout(() => {
      linkRef.current.send({ t: 'tune', khz: freqRef.current.khz });
    }, 180);
  }, []);

  const tuneBy = useCallback(
    (d) => {
      const f = freqRef.current;
      f.khz = clampKhz(f.khz + d);
      scheduleTune();
      const whole = Math.floor(f.khz);
      const frac = Math.round((f.khz - whole) * 10) % 10;
      setFreqLabel(`7.${String(whole).padStart(3, '0')}.${frac} MHz`);
    },
    [scheduleTune],
  );

  // Arrow keys tune from anywhere except text inputs.
  useEffect(() => {
    const onKey = (e) => {
      if (!powered) return;
      const tag = document.activeElement?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'BUTTON') return;
      const step = e.shiftKey ? 5 : 0.5;
      if (e.key === 'ArrowRight') { tuneBy(step); e.preventDefault(); }
      if (e.key === 'ArrowLeft') { tuneBy(-step); e.preventDefault(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [powered, tuneBy]);

  const keyTx = useCallback((kind, text) => {
    audioRef.current.txKey();
    setTxLit(true);
    setTimeout(() => setTxLit(false), 600);
    linkRef.current.send(kind === 'cq' ? { t: 'cq' } : { t: 'tx', text });
  }, []);

  const changeVolume = useCallback((v) => {
    setVolume(v);
    audioRef.current.setVolume(v);
  }, []);

  const sendQsl = useCallback((call) => {
    linkRef.current.send({ t: 'qsl', to: call });
    setQsl((prev) => (prev[call] === 'confirmed' ? prev : { ...prev, [call]: prev[call] === 'offered' ? 'offered' : 'sent' }));
  }, []);

  const canTx = powered && linkStatus === 'up';

  return (
    <div className={`room ${powered ? 'powered' : ''}`}>
      <div className="rig">
        <div className="cheek left" aria-hidden="true" />
        <main className="faceplate">
          <Screw pos="tl" /><Screw pos="tr" /><Screw pos="bl" /><Screw pos="br" />

          <header className="rig-top">
            <div className="badge">
              <h1>THE DIAL</h1>
              <span className="model">MODEL TD-40 · 40 METER BAND COMMUNICATOR</span>
            </div>
            <div className="top-right">
              <div className="cond-cluster">
                <div>
                  <Meter
                    valueRef={condMeterRef}
                    powered={powered}
                    labels={['0', '3', '5', '7', '9']}
                    redFrom={5 / 9}
                    caption="GEOMAG K"
                    width={120}
                    height={64}
                    small
                  />
                </div>
                <div className="lamp-group" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 6 }}>
                  <span className="lamp-group">
                    <Lamp on={powered && cond.source === 'noaa'} label="NOAA live data" />
                    <span className="silk-label dim">NOAA LIVE</span>
                  </span>
                  <span className="lamp-group">
                    <Lamp on={powered && cond.source === 'estimate'} red label="Estimated conditions" />
                    <span className="silk-label dim">ESTIMATE</span>
                  </span>
                </div>
              </div>
            </div>
          </header>

          <section className="rig-main">
            <div className="deck">
              <div className="control-row">
                <span className="silk-label">Power</span>
                <span className="lamp-group">
                  <Lamp on={powered} label="Power" />
                  <Toggle on={powered} onChange={setPower} label="Power" />
                </span>
              </div>
              <Meter
                valueRef={sMeterRef}
                powered={powered}
                labels={['1', '3', '5', '7', '9', '+20']}
                redFrom={4 / 5}
                caption="SIGNAL"
                ambient
              />
              <div className="control-row" style={{ justifyContent: 'space-around' }}>
                <SmallKnob value={volume} onChange={changeVolume} label="AF Gain" disabled={!powered} />
                <FixedSelector label="Mode" positions={['LSB', 'USB', 'CW']} index={0} />
                <FixedSelector label="Band" positions={['40M']} index={0} />
              </div>
              <div className="control-row" style={{ justifyContent: 'space-around' }}>
                <div className="knob-cluster">
                  <span className="jack" role="img" aria-label="Phones jack" />
                  <span className="silk-label dim">Phones</span>
                </div>
                <div className="knob-cluster">
                  <span className="jack" role="img" aria-label="Key jack" />
                  <span className="silk-label dim">Key</span>
                </div>
              </div>
              <div className="control-row foot">
                <span className="silk-label dim">On Air</span>
                <Lamp on={txLit} red label="Transmitting" />
              </div>
            </div>

            <div className="deck vfo-deck">
              <DialWindow
                freqRef={freqRef}
                velRef={velRef}
                activityRef={activityRef}
                powered={powered}
                audio={audioRef.current}
              />
              <VFOKnob onDelta={tuneBy} velRef={velRef} freqLabel={freqLabel} disabled={!powered} />
              <div className="vfo-skirt">
                <span className="silk-label dim">◄ 7.000</span>
                <span className="silk-label">VFO · Kilocycle Change</span>
                <span className="silk-label dim">7.200 ►</span>
              </div>
            </div>

            <div className="deck traffic-deck">
              <span className="silk-label">Received Traffic</span>
              <TrafficWindow
                messages={messages}
                powered={powered}
                linkStatus={linkStatus}
                note={note}
                canTx={canTx}
                qsl={qsl}
                qslOffers={qslOffers}
                onQsl={sendQsl}
                onSend={(text) => keyTx('tx', text)}
                onCq={() => keyTx('cq')}
              />
            </div>
          </section>

          <footer className="rig-bottom">
            <InstructionPlate />
            <StationPlate station={station} powered={powered} linkStatus={linkStatus} />
          </footer>
        </main>
        <div className="cheek right" aria-hidden="true" />
      </div>
    </div>
  );
}
