import { calculateCategoryScore, calculateNumberScore, calculateTotalScore } from './gameLogic';
import './ScoreSheet.css';

const categoryNames = {
  pair: 'Dvojice',
  three: 'Trojice',
  four: 'Čtveřice',
  twoPairs: '2+2',
  fullHouse: '3+2',
  lowStraight: 'Nízká postupka',
  highStraight: 'Vysoká postupka',
  yahtzee: 'Poker',
  chance: 'Součet'
};

export default function ScoreSheet({ scoreSheet, currentDice, onSelectCategory, canSelect, selectedCategory }) {
  const handleNumberSelect = (number) => {
    if (scoreSheet.numbers[number] !== null) return;
    if (!canSelect && !selectedCategory) return; // Povolit kliknutí pokud už je něco vybráno

    const result = calculateNumberScore(currentDice, number);
    onSelectCategory('number', number, result);
  };

  const handleCategorySelect = (category) => {
    if (scoreSheet.categories[category] !== null) return;
    if (!canSelect && !selectedCategory) return; // Povolit kliknutí pokud už je něco vybráno

    const score = calculateCategoryScore(currentDice, category);
    onSelectCategory('category', category, score);
  };

  const getNumberDisplay = (number) => {
    if (scoreSheet.numbers[number] === null) return '';
    if (scoreSheet.numbers[number] === 'crossed') return '✗';
    const { bonus } = scoreSheet.numbers[number];
    return bonus > 0 ? `✓ +${bonus}` : '✓';
  };

  const getCategoryDisplay = (category) => {
    const value = scoreSheet.categories[category];
    if (value === null) return '';
    if (value === 'crossed') return '✗';
    return value;
  };

  const getPreviewScore = (type, key) => {
    if (!canSelect) return null;
    // Ignorovat preview pokud ještě nebyly kostky hozeny
    if (currentDice.some(d => d === 0)) return null;

    if (type === 'number') {
      if (scoreSheet.numbers[key] !== null) return null;
      const result = calculateNumberScore(currentDice, key);
      return result.valid ? (result.bonus > 0 ? `✓ +${result.bonus}` : '✓') : '✗';
    } else {
      if (scoreSheet.categories[key] !== null) return null;
      const score = calculateCategoryScore(currentDice, key);
      return score > 0 ? score : '✗';
    }
  };

  const totalScore = calculateTotalScore(scoreSheet);
  const topSectionComplete = [1, 2, 3, 4, 5, 6].every(
    num => scoreSheet.numbers[num] !== null && scoreSheet.numbers[num] !== 'crossed'
  );

  return (
    <div className="score-sheet">
      <div className="section">
        <h3>Čísla (1-6)</h3>
        <p className="section-description">
          Minimálně 3 stejná čísla = ✓, každé další = +hodnota
        </p>
        <div className="numbers-grid">
          {[1, 2, 3, 4, 5, 6].map(number => (
            <button
              key={number}
              type="button"
              className={`score-cell ${
                canSelect && scoreSheet.numbers[number] === null ? 'available' : ''
              } ${scoreSheet.numbers[number] !== null ? 'filled' : ''} ${
                selectedCategory && selectedCategory.type === 'number' && selectedCategory.key === number ? 'selected' : ''
              }`}
              onClick={() => handleNumberSelect(number)}
              disabled={scoreSheet.numbers[number] !== null}
            >
              <span className="label">{number}</span>
              <span className="value">
                {getNumberDisplay(number)}
                {canSelect && scoreSheet.numbers[number] === null && (
                  <span className="preview">{getPreviewScore('number', number) || ''}</span>
                )}
              </span>
            </button>
          ))}
        </div>
{(() => {
          const allFilled = [1, 2, 3, 4, 5, 6].every(num => scoreSheet.numbers[num] !== null);

          if (topSectionComplete) {
            // Všechny splněny
            return (
              <div className="bonus-display">
                Bonus: 50 + {[1,2,3,4,5,6].reduce((sum, n) =>
                  sum + (scoreSheet.numbers[n]?.bonus || 0), 0
                )} bodů
              </div>
            );
          } else if (allFilled) {
            // Všechny vyplněny ale ne všechny splněny
            return (
              <div className="bonus-display" style={{ background: '#999' }}>
                0 bodů
              </div>
            );
          } else {
            // Ještě nejsou všechny vyplněny
            return (
              <div className="bonus-hint">
                Splň všech 6 čísel (žádné škrtnutí!) pro bonus 50 bodů + plusy
              </div>
            );
          }
        })()}
      </div>

      <div className="section">
        <h3>Kategorie</h3>
        <div className="categories-list">
          {Object.entries(categoryNames).map(([key, name]) => (
            <button
              key={key}
              type="button"
              className={`score-cell ${
                canSelect && scoreSheet.categories[key] === null ? 'available' : ''
              } ${scoreSheet.categories[key] !== null ? 'filled' : ''} ${
                selectedCategory && selectedCategory.type === 'category' && selectedCategory.key === key ? 'selected' : ''
              }`}
              onClick={() => handleCategorySelect(key)}
              disabled={scoreSheet.categories[key] !== null}
            >
              <span className="label">{name}</span>
              <span className="value">
                {getCategoryDisplay(key)}
                {canSelect && scoreSheet.categories[key] === null && (
                  <span className="preview">{getPreviewScore('category', key) || ''}</span>
                )}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="total-score">
        <strong>Celkem:</strong> {totalScore} bodů
      </div>
    </div>
  );
}
