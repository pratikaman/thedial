export function InstructionPlate() {
  return (
    <div className="plate">
      <span className="rivet tl" /><span className="rivet tr" />
      <span className="rivet bl" /><span className="rivet br" />
      <h2>Operating Instructions</h2>
      <p>
        1. SET POWER TO ON &nbsp;·&nbsp; 2. ROTATE VFO TO A TRACE OR A CLEAR FREQUENCY
        &nbsp;·&nbsp; 3. PRESS CQ TO CALL ANY STATION — ANSWER A CQ BY KEYING A MESSAGE
        &nbsp;·&nbsp; 4. EXCHANGE SIGNAL REPORT AND GRID &nbsp;·&nbsp; 5. SIGN 73 TO CLOSE.
        <br />
        RANGE DEPENDS ON DISTANCE AND THE GEOMAGNETIC FIELD (K). TRAFFIC FADES IN 60
        SECONDS AND IS NOT RECORDED ANYWHERE. NEW TO ALL THIS?{' '}
        <a className="shack-link" href="/manual" target="_blank" rel="noreferrer">
          READ THE OPERATOR&rsquo;S PRIMER&nbsp;→
        </a>
      </p>
    </div>
  );
}

export function StationPlate({ station, powered, linkStatus }) {
  return (
    <div className="plate station-plate">
      <span className="rivet tl" /><span className="rivet tr" />
      <span className="rivet bl" /><span className="rivet br" />
      <h2>Station</h2>
      {powered && station ? (
        <>
          <p>{station.callsign}</p>
          <p className="sub">
            GRID {station.grid}
            {linkStatus !== 'up' ? ' · LINK DOWN' : ' · ON THE AIR'}
            {' · '}
            <a
              className="shack-link"
              href={`/shack/${station.callsign}`}
              target="_blank"
              rel="noreferrer"
            >
              SHACK →
            </a>
          </p>
        </>
      ) : (
        <>
          <p>— — —</p>
          <p className="sub">STANDBY</p>
        </>
      )}
    </div>
  );
}
