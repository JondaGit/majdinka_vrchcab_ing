// Logika hry s kostkami

export function countDice(dice) {
  const counts = {};
  dice.forEach(d => {
    if (d > 0) { // Ignorovat nehozené kostky (0)
      counts[d] = (counts[d] || 0) + 1;
    }
  });
  return counts;
}

export function calculateNumberScore(dice, number) {
  const count = dice.filter(d => d === number).length;
  if (count >= 3) {
    const bonus = count > 3 ? (count - 3) * number : 0;
    return { valid: true, bonus };
  }
  return { valid: false, bonus: 0 };
}

export function calculateCategoryScore(dice, category) {
  const counts = countDice(dice);
  const values = Object.keys(counts).map(Number);
  const countsArray = Object.values(counts);

  switch(category) {
    case 'pair': {
      const pair = values.find(v => counts[v] >= 2);
      return pair ? pair * 2 : 0;
    }

    case 'three': {
      const three = values.find(v => counts[v] >= 3);
      return three ? three * 3 : 0;
    }

    case 'four': {
      const four = values.find(v => counts[v] >= 4);
      return four ? four * 4 : 0;
    }

    case 'twoPairs': {
      const pairs = values.filter(v => counts[v] >= 2);
      if (pairs.length >= 2) {
        pairs.sort((a, b) => b - a);
        return pairs[0] * 2 + pairs[1] * 2;
      }
      return 0;
    }

    case 'fullHouse': {
      const hasThree = countsArray.some(c => c >= 3);
      const hasTwo = countsArray.some(c => c >= 2);
      if (hasThree && countsArray.filter(c => c >= 2).length >= 1) {
        return dice.reduce((sum, d) => sum + d, 0);
      }
      return 0;
    }

    case 'lowStraight': {
      const sorted = [...new Set(dice.filter(d => d > 0))].sort((a, b) => a - b);
      if (sorted.join('') === '12345') {
        return dice.reduce((sum, d) => sum + d, 0);
      }
      return 0;
    }

    case 'highStraight': {
      const sorted = [...new Set(dice.filter(d => d > 0))].sort((a, b) => a - b);
      if (sorted.join('') === '23456') {
        return dice.reduce((sum, d) => sum + d, 0);
      }
      return 0;
    }

    case 'yahtzee': {
      const hasYahtzee = countsArray.some(c => c === 5);
      if (hasYahtzee) {
        return dice.reduce((sum, d) => sum + d, 0) + 50;
      }
      return 0;
    }

    case 'chance': {
      return dice.reduce((sum, d) => sum + d, 0);
    }

    default:
      return 0;
  }
}

export function calculateTotalScore(scoreSheet) {
  let total = 0;

  // První sekce (čísla 1-6)
  // Všechna čísla musí být SPLNĚNA (ne škrtnuta) pro získání bodů
  const topSectionComplete = [1, 2, 3, 4, 5, 6].every(
    num => scoreSheet.numbers[num] !== null && scoreSheet.numbers[num] !== 'crossed'
  );

  if (topSectionComplete) {
    let bonus = 50;
    for (let i = 1; i <= 6; i++) {
      if (scoreSheet.numbers[i] && scoreSheet.numbers[i] !== 'crossed') {
        bonus += scoreSheet.numbers[i].bonus;
      }
    }
    total += bonus;
  }

  // Druhá sekce (kategorie)
  Object.values(scoreSheet.categories).forEach(score => {
    if (score !== null && score !== 'crossed') {
      total += score;
    }
  });

  return total;
}

export function createEmptyScoreSheet() {
  return {
    numbers: {
      1: null,
      2: null,
      3: null,
      4: null,
      5: null,
      6: null
    },
    categories: {
      pair: null,
      three: null,
      four: null,
      twoPairs: null,
      fullHouse: null,
      lowStraight: null,
      highStraight: null,
      yahtzee: null,
      chance: null
    }
  };
}
