export function Player({ jumping }: { jumping: boolean }) {
  return (
    <div className={`player-shell ${jumping ? "is-jumping" : ""}`} aria-hidden="true">
      <div className="player-shadow" />
      <div className="player-sprite">
        <span className="antenna" />
        <span className="head"><i /><b /></span>
        <span className="body" />
        <span className="arm arm-left" />
        <span className="arm arm-right" />
        <span className="leg leg-left" />
        <span className="leg leg-right" />
      </div>
    </div>
  );
}
