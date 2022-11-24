import create from 'zustand';

interface PlayerScore {
  id?: number;
  ones?: number;
  two?: number;
  three?: number;
  four?: number;
  five?: number;
  six?: number;
  bonus?: number;
  choice?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yacht?: number;
  total: number;
}

interface ScoreState {
  players: PlayerScore['id'][];
  turn?: PlayerScore['id'];
  rounds: number;
  left: number;
  playerScores: Map<PlayerScore['id'], PlayerScore>;
  // computedScoresPerRoll
  clearAll: () => void;
  endRolls: () => void;
  endRound: () => void;
}

export const useScoreStore = create<ScoreState>((set) => ({
  players: [],
  turn: undefined,
}));
