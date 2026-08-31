// WebSocket link to the band server, with backoff reconnect while powered.
// A stored station token keeps your callsign yours across sessions.

// `?op=<name>` runs a second operator identity in the same browser
// (handy for working yourself from two tabs).
export function tokenKey() {
  const op = new URLSearchParams(location.search).get('op');
  return op ? `thedial.token.${op.replace(/\W/g, '').slice(0, 16)}` : 'thedial.token';
}

function wsUrl() {
  // In dev the client is served by Vite on :5173 and the band lives on :8787;
  // in production one process serves both, so ride the page's own host.
  const host = location.port === '5173' ? `${location.hostname}:8787` : location.host;
  const base = `${location.protocol === 'https:' ? 'wss' : 'ws'}://${host}/ws`;
  try {
    const token = localStorage.getItem(tokenKey());
    return token ? `${base}?token=${encodeURIComponent(token)}` : base;
  } catch {
    return base;
  }
}

export class BandLink {
  constructor(handlers) {
    this.handlers = handlers;
    this.ws = null;
    this.wantUp = false;
    this.retry = 0;
    this.timer = null;
  }

  connect() {
    this.wantUp = true;
    this._open();
  }

  disconnect() {
    this.wantUp = false;
    clearTimeout(this.timer);
    this.ws?.close();
    this.ws = null;
  }

  _open() {
    if (!this.wantUp) return;
    this.handlers.status?.(this.retry === 0 ? 'connecting' : 'lost');
    const ws = new WebSocket(wsUrl());
    this.ws = ws;
    ws.onopen = () => {
      this.retry = 0;
      this.handlers.status?.('up');
    };
    ws.onmessage = (ev) => {
      let msg;
      try {
        msg = JSON.parse(ev.data);
      } catch {
        return;
      }
      this.handlers[msg.t]?.(msg);
    };
    ws.onclose = () => {
      if (!this.wantUp) return;
      this.handlers.status?.('lost');
      const delay = Math.min(8000, 500 * 2 ** this.retry);
      this.retry += 1;
      clearTimeout(this.timer);
      this.timer = setTimeout(() => this._open(), delay);
    };
    ws.onerror = () => ws.close();
  }

  send(msg) {
    if (this.ws?.readyState === WebSocket.OPEN) this.ws.send(JSON.stringify(msg));
  }
}
