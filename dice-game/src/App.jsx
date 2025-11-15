import { useState } from 'react';
import Dice from './Dice';
import ScoreSheet from './ScoreSheet';
import { createEmptyScoreSheet, calculateTotalScore } from './gameLogic';
import './App.css';

function App() {
  const [gameState, setGameState] = useState('setup');
  const [players, setPlayers] = useState([]);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [playerCount, setPlayerCount] = useState(1);
  const [playerNames, setPlayerNames] = useState(['']);

  const [dice, setDice] = useState([0, 0, 0, 0, 0]);
  const [lockedDice, setLockedDice] = useState([false, false, false, false, false]);
  const [rollsLeft, setRollsLeft] = useState(3);
  const [rolling, setRolling] = useState(false);
  const [hasSelectedCategory, setHasSelectedCategory] = useState(false);

  const startGame = () => {
    if (playerCount < 1 || playerCount > 100) {
      alert('Počet hráčů musí být mezi 1 a 100');
      return;
    }

    const newPlayers = Array.from({ length: playerCount }, (_, i) => ({
      name: playerNames[i] || `Hráč ${i + 1}`,
      scoreSheet: createEmptyScoreSheet(),
      roundsPlayed: 0
    }));

    setPlayers(newPlayers);
    setGameState('playing');
    setCurrentPlayerIndex(0);
    setRollsLeft(3);
    resetDice();
  };

  const resetDice = () => {
    setDice([0, 0, 0, 0, 0]);
    setLockedDice([false, false, false, false, false]);
  };

  const rollDice = () => {
    if (rollsLeft <= 0) return;

    setRolling(true);
    setRollsLeft(rollsLeft - 1);

    setTimeout(() => {
      setDice(prevDice =>
        prevDice.map((d, i) =>
          lockedDice[i] ? d : Math.floor(Math.random() * 6) + 1
        )
      );
      setRolling(false);
    }, 500);
  };

  const toggleLock = (index) => {
    if (rollsLeft === 3) return;
    setLockedDice(prev => {
      const newLocked = [...prev];
      newLocked[index] = !newLocked[index];
      return newLocked;
    });
  };

  const selectCategory = (type, key, score) => {
    // Pouze označíme výběr, ale nezapisujeme do scoreSheet
    setHasSelectedCategory({ type, key, score });
  };

  const confirmAndNextPlayer = () => {
    if (!hasSelectedCategory) return;

    const { type, key, score } = hasSelectedCategory;
    const updatedPlayers = [...players];
    const player = updatedPlayers[currentPlayerIndex];

    if (type === 'number') {
      player.scoreSheet.numbers[key] = score.valid
        ? { bonus: score.bonus }
        : 'crossed';
    } else {
      player.scoreSheet.categories[key] = score > 0 ? score : 'crossed';
    }

    player.roundsPlayed++;
    setPlayers(updatedPlayers);

    // Kontrola konce hry
    if (player.roundsPlayed >= 15) {
      if (currentPlayerIndex === players.length - 1) {
        setGameState('finished');
        setHasSelectedCategory(false);
        return;
      }
    }

    // Další hráč
    setCurrentPlayerIndex((currentPlayerIndex + 1) % players.length);
    setRollsLeft(3);
    setHasSelectedCategory(false);
    resetDice();
  };

  const cancelSelection = () => {
    setHasSelectedCategory(false);
  };

  const restartGame = () => {
    setGameState('setup');
    setPlayers([]);
    setCurrentPlayerIndex(0);
    setPlayerCount(1);
    setPlayerNames(['']);
    resetDice();
    setRollsLeft(3);
  };

  const updatePlayerCount = (value) => {
    const newCount = parseInt(value);
    if (newCount < 1 || newCount > 100) return;

    setPlayerCount(newCount);

    if (playerNames.length < newCount) {
      setPlayerNames([...playerNames, ...Array(newCount - playerNames.length).fill('')]);
    } else {
      setPlayerNames(playerNames.slice(0, newCount));
    }
  };

  const currentPlayer = players[currentPlayerIndex];
  const canRoll = rollsLeft > 0 && !rolling && !hasSelectedCategory;
  const canSelect = rollsLeft < 3 && !hasSelectedCategory;

  return (
    <main>
      <header>
        <h1>🎲 joujou, kostky kostkujou</h1>
      </header>

      {gameState === 'setup' && (
        <div className="setup-screen">
          <h2>Nastavení hry</h2>

          <div className="form-group">
            <label htmlFor="player-count">Počet hráčů (1-100):</label>
            <input
              id="player-count"
              type="number"
              min="1"
              max="100"
              value={playerCount}
              onChange={(e) => updatePlayerCount(e.target.value)}
            />
          </div>

          <div className="player-names">
            <h3>Jména hráčů:</h3>
            {Array.from({ length: playerCount }).map((_, i) => (
              <div key={i} className="form-group">
                <label htmlFor={`player-${i}`}>Hráč {i + 1}:</label>
                <input
                  id={`player-${i}`}
                  type="text"
                  value={playerNames[i] || ''}
                  onChange={(e) => {
                    const newNames = [...playerNames];
                    newNames[i] = e.target.value;
                    setPlayerNames(newNames);
                  }}
                  placeholder={`Hráč ${i + 1}`}
                />
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-large" onClick={startGame}>
            Začít hru
          </button>
        </div>
      )}

      {gameState === 'playing' && currentPlayer && (
        <div className="game-screen">
          <div className="player-info">
            <h2>{currentPlayer.name}</h2>
            <p>Kolo: {currentPlayer.roundsPlayed + 1} / 15</p>
            <p className="rolls-left">
              Zbývající hody: <strong>{rollsLeft}</strong>
            </p>
          </div>

          <div className="dice-area">
            <div className="dice-container">
              {dice.map((value, i) => (
                <Dice
                  key={i}
                  value={value}
                  locked={lockedDice[i]}
                  onClick={() => toggleLock(i)}
                  rolling={rolling}
                />
              ))}
            </div>

            {hasSelectedCategory ? (
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button className="btn btn-secondary" style={{ flex: 1 }} onClick={cancelSelection}>
                  Zrušit výběr
                </button>
                <button className="btn btn-primary" style={{ flex: 1 }} onClick={confirmAndNextPlayer}>
                  Další hráč
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary btn-large"
                onClick={rollDice}
                disabled={!canRoll}
              >
                {rollsLeft === 3 ? 'Hodit kostkujou' : `Hodit znovu (${rollsLeft})`}
              </button>
            )}

            {rollsLeft < 3 && rollsLeft > 0 && !hasSelectedCategory && (
              <p className="hint">Klikni na kostkuju pro zamčení/odemčení</p>
            )}
          </div>

          <ScoreSheet
            scoreSheet={currentPlayer.scoreSheet}
            currentDice={dice}
            onSelectCategory={selectCategory}
            canSelect={canSelect}
            selectedCategory={hasSelectedCategory}
          />

          <div className="game-controls">
            <button className="btn btn-secondary" onClick={restartGame}>
              Ukončit hru
            </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="finished-screen">
          <h2>🏆 Konec hry!</h2>

          <div className="final-scores">
            {[...players]
              .sort((a, b) => {
                const scoreA = calculateTotalScore(a.scoreSheet);
                const scoreB = calculateTotalScore(b.scoreSheet);
                return scoreB - scoreA;
              })
              .map((player, i) => (
                <div key={i} className="player-final-score">
                  <span className="rank">#{i + 1}</span>
                  <span className="player-name">{player.name}</span>
                  <span className="score">
                    {calculateTotalScore(player.scoreSheet)} bodů
                  </span>
                </div>
              ))}
          </div>

          <button className="btn btn-primary btn-large" onClick={restartGame}>
            Nová hra
          </button>
        </div>
      )}
    </main>
  );
}

export default App;
