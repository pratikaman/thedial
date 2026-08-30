import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import Shack from './shack/Shack.jsx';
import Manual from './manual/Manual.jsx';
import './styles.css';

const shackMatch = location.pathname.match(/^\/shack\/([A-Za-z0-9/]+)$/);
const isManual = location.pathname === '/manual';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {shackMatch ? (
      <Shack callsign={decodeURIComponent(shackMatch[1]).toUpperCase()} />
    ) : isManual ? (
      <Manual />
    ) : (
      <App />
    )}
  </React.StrictMode>,
);
