import create from 'zustand';
import { TCategories } from './type';

type _ = { [K in keyof TCategories]?: number };
export interface PlayerScore extends _ {
  id: number;
  aces?: number;
  deuces?: number;
  threes?: number;
  fours?: number;
  fives?: number;
  sixes?: number;
  bonus?: number;
  choice?: number;
  fourOfAKind?: number;
  fullHouse?: number;
  smallStraight?: number;
  largeStraight?: number;
  yacht?: number;
  total: number;
}

export interface ScoreState {
  dices?: number[];
  players: PlayerScore['id'][];
  nowPlayer: PlayerScore['id'];
  rounds: number;
  left: number;
  playerScores: Map<PlayerScore['id'], PlayerScore>;
  setDices: (dices?: number[]) => void;
  // computedScoresPerRoll
  newGame: (players?: PlayerScore['id'][]) => void;
  // endRolls: () => void;
  endRound: () => void;
}

const INITIAL_PLAYER_SCORE: PlayerScore = Object.freeze({ id: 1, total: 0 });

const INITIAL_SCORE_STATE: Omit<ScoreState, 'setDices' | 'newGame' | 'endRolls' | 'endRound'> = Object.freeze({
  players: [1, 2],
  nowPlayer: 1,
  rounds: 1,
  left: 3,
  playerScores: new Map()
    .set(1, {
      ...INITIAL_PLAYER_SCORE,
      id: 1,
    })
    .set(2, { ...INITIAL_PLAYER_SCORE, id: 2 }),
});

export const useScoreStore = create<ScoreState>((set) => ({
  ...INITIAL_SCORE_STATE,
  setDices: (dices) => set((state) => ({ dices })),
  newGame: (players = [1, 2]) =>
    set((state) => {
      return {
        ...INITIAL_SCORE_STATE,
        players,
        nowPlayer: players[0],
        playerScores: new Map(players.map((id) => [id, { ...INITIAL_PLAYER_SCORE, id }])),
      };
    }),
  endRound: () =>
    set((state) => {
      const index = state.players.indexOf(state.nowPlayer);
      const lastPlayer: boolean = index === state.players.length - 1;
      return {
        nowPlayer: state.players[(index + 1) % state.players.length],
        rounds: state.rounds + (lastPlayer ? +1 : 0),
      };
    }),
}));
