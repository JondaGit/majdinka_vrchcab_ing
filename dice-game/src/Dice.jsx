import './Dice.css';

const dotPatterns = {
  0: [],
  1: [[50, 50]],
  2: [[25, 25], [75, 75]],
  3: [[25, 25], [50, 50], [75, 75]],
  4: [[25, 25], [75, 25], [25, 75], [75, 75]],
  5: [[25, 25], [75, 25], [50, 50], [25, 75], [75, 75]],
  6: [[25, 25], [75, 25], [25, 50], [75, 50], [25, 75], [75, 75]]
};

export default function Dice({ value, locked, onClick, rolling }) {
  const dots = dotPatterns[value] || [];

  return (
    <button
      className={`dice ${locked ? 'locked' : ''} ${rolling && !locked ? 'rolling' : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className="dice-face">
        {dots.map(([x, y], i) => (
          <div
            key={i}
            className="dot"
            style={{ left: `${x}%`, top: `${y}%` }}
          />
        ))}
      </div>
      {locked && <div className="lock-indicator">🔒</div>}
    </button>
  );
}
