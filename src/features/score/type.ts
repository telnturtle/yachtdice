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
  subtotal: 'subtotal',
  bonus: 'bonus',
  choice: 'choice',
  fourOfAKind: 'fourOfAKind',
  fullHouse: 'fullHouse',
  smallStraight: 'smallStraight',
  largeStraight: 'largeStraight',
  yacht: 'yacht',
  total: 'total',
} as const

export type TCategories = typeof CATEGORIES[keyof typeof CATEGORIES]
export type TCategoriesWritable =
  | 'aces'
  | 'deuces'
  | 'threes'
  | 'fours'
  | 'fives'
  | 'sixes'
  | 'choice'
  | 'fourOfAKind'
  | 'fullHouse'
  | 'smallStraight'
  | 'largeStraight'
  | 'yacht'
