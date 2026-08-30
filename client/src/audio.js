// The rig's voice. Everything is synthesized: band noise, the heterodyne
// whine while tuning, carrier beat notes, RTTY-style receive warbles, the
// CW sidetone when keying. Built on first POWER-ON (the user gesture that
// satisfies autoplay policy); fully usable muted.

export class RigAudio {
  constructor() {
    this.ctx = null;
    this.master = null;
    this.noiseGain = null;
    this.whineOsc = null;
    this.whineGain = null;
    this.beatOsc = null;
    this.beatGain = null;
    this.volume = 0.7;
    this.crackleTimer = null;
  }

  get running() {
    return !!this.ctx && this.ctx.state === 'running';
  }

  async powerOn() {
    if (!this.ctx) this._build();
    await this.ctx.resume();
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(0.0001, t);
    // tubes warming up
    this.master.gain.exponentialRampToValueAtTime(Math.max(0.001, this.volume), t + 1.4);
    this._startCrackle();
  }

  async powerOff() {
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(t);
    this.master.gain.setValueAtTime(this.master.gain.value, t);
    this.master.gain.exponentialRampToValueAtTime(0.0001, t + 0.35);
    clearInterval(this.crackleTimer);
    setTimeout(() => this.ctx?.suspend(), 450);
  }

  setVolume(v) {
    this.volume = v;
    if (this.running) {
      this.master.gain.setTargetAtTime(Math.max(0.001, v), this.ctx.currentTime, 0.05);
    }
  }

  _build() {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    this.ctx = ctx;
    this.master = ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(ctx.destination);

    // --- band noise: white noise through a bandpass, gently breathing ---
    const len = ctx.sampleRate * 2;
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i += 1) data[i] = Math.random() * 2 - 1;
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 1050;
    bp.Q.value = 0.45;
    this.noiseGain = ctx.createGain();
    this.noiseGain.gain.value = 0.05;
    noise.connect(bp).connect(this.noiseGain).connect(this.master);
    noise.start();
    // slow QSB breathing on the noise floor
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.11;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(this.noiseGain.gain);
    lfo.start();

    // --- tuning whine ---
    this.whineOsc = ctx.createOscillator();
    this.whineOsc.type = 'sine';
    this.whineOsc.frequency.value = 400;
    this.whineGain = ctx.createGain();
    this.whineGain.gain.value = 0;
    this.whineOsc.connect(this.whineGain).connect(this.master);
    this.whineOsc.start();

    // --- carrier beat note (approaching a signal) ---
    this.beatOsc = ctx.createOscillator();
    this.beatOsc.type = 'sine';
    this.beatOsc.frequency.value = 300;
    this.beatGain = ctx.createGain();
    this.beatGain.gain.value = 0;
    this.beatOsc.connect(this.beatGain).connect(this.master);
    this.beatOsc.start();
  }

  _startCrackle() {
    clearInterval(this.crackleTimer);
    this.crackleTimer = setInterval(() => {
      if (!this.running || Math.random() > 0.4) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createBufferSource();
      const n = this.ctx.sampleRate * 0.04;
      const b = this.ctx.createBuffer(1, n, this.ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < n; i += 1) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
      osc.buffer = b;
      const hp = this.ctx.createBiquadFilter();
      hp.type = 'highpass';
      hp.frequency.value = 1800;
      const g = this.ctx.createGain();
      g.gain.value = 0.03 + Math.random() * 0.05;
      osc.connect(hp).connect(g).connect(this.master);
      osc.start(t);
    }, 2800);
  }

  // Called every frame while the VFO moves; velocity in kHz/s.
  tuning(velocity) {
    if (!this.running) return;
    const v = Math.min(1, Math.abs(velocity) / 40);
    const t = this.ctx.currentTime;
    this.whineGain.gain.setTargetAtTime(v * 0.045, t, 0.04);
    this.whineOsc.frequency.setTargetAtTime(280 + v * 1100, t, 0.05);
  }

  // Beat note against the nearest carrier: |offset| in kHz, strength 0..1.
  beat(offsetKhz, strength) {
    if (!this.running) return;
    const t = this.ctx.currentTime;
    const within = Math.abs(offsetKhz) < 1.6;
    const g = within ? Math.max(0, strength) * 0.035 * (1 - Math.abs(offsetKhz) / 1.6) : 0;
    this.beatGain.gain.setTargetAtTime(g, t, 0.08);
    this.beatOsc.frequency.setTargetAtTime(90 + Math.abs(offsetKhz) * 420, t, 0.06);
  }

  // RTTY-flavored warble on receive; louder when the copy is clean.
  rxBurst(q) {
    if (!this.running) return;
    const t0 = this.ctx.currentTime;
    const g = this.ctx.createGain();
    g.gain.value = 0.028 + q * 0.03;
    g.connect(this.master);
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.connect(g);
    const bits = 7 + Math.floor(Math.random() * 5);
    for (let i = 0; i < bits; i += 1) {
      osc.frequency.setValueAtTime(Math.random() > 0.5 ? 2125 : 2295, t0 + i * 0.045);
    }
    g.gain.setValueAtTime(g.gain.value, t0 + bits * 0.045);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + bits * 0.045 + 0.06);
    osc.start(t0);
    osc.stop(t0 + bits * 0.045 + 0.1);
  }

  // CW sidetone + relay thunk when keying a transmission.
  txKey() {
    if (!this.running) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.value = 700;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.22);
    osc.connect(g).connect(this.master);
    osc.start(t0);
    osc.stop(t0 + 0.3);
  }
}
