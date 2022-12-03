// export type TCategories =
//   | 'aces'
//   | 'deuces'
//   | 'threes'
//   | 'fours'
//   | 'fives'
//   | 'sixes'
//   | 'bonus'
//   | 'choice'
//   | 'fourOfAKind'
//   | 'fullHouse'
//   | 'smallStraight'
//   | 'largeStraight'
//   | 'yacht'
//   | 'total';

const CATEGORIES = {
  aces: 'aces',
  deuces: 'deuces',
  threes: 'threes',
  fours: 'fours',
  fives: 'fives',
  sixes: 'sixes',
  bonus: 'bonus',
  choice: 'choice',
  fourOfAKind: 'fourOfAKind',
  fullHouse: 'fullHouse',
  smallStraight: 'smallStraight',
  largeStraight: 'largeStraight',
  yacht: 'yacht',
  total: 'total',
} as const;

export type TCategories = typeof CATEGORIES[keyof typeof CATEGORIES];
const t: TCategories = 'bonus'