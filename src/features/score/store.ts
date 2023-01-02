import create from 'zustand'
import { TCategories } from './type'
import { computeTopsides, computeUnwritableCategories, isNumber } from './util'

// type _ = Object.create(null){ [K in keyof TCategories]?: number };
export interface PlayerScore /* extends _*/ {
  id: number
  aces?: number
  deuces?: number
  threes?: number
  fours?: number
  fives?: number
  sixes?: number
  subtotal?: number
  bonus?: number
  choice?: number
  fourOfAKind?: number
  fullHouse?: number
  smallStraight?: number
  largeStraight?: number
  yacht?: number
  total: number
}

export interface ScoreState {
  dices?: number[]
  players: PlayerScore['id'][]
  nowPlayer: PlayerScore['id']
  rounds: number
  left: number
  playerScores: Map<PlayerScore['id'], PlayerScore>
  diceTouchDisabled: boolean
  setDices: (dices?: number[]) => void
  // computedScoresPerRoll
  newGame: (players?: PlayerScore['id'][]) => void
  // endRolls: () => void;
  endRound: () => void
  writeScore: (cat: TCategories) => void
  setDiceTouchDisabled: (b: boolean) => void
}

const INITIAL_PLAYER_SCORE: PlayerScore = Object.freeze({ id: 1, total: 0 })

const INITIAL_SCORE_STATE: Omit<
  ScoreState,
  'setDices' | 'newGame' | 'endRolls' | 'endRound' | 'writeScore' | 'setDiceTouchDisabled'
> = Object.freeze({
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
  diceTouchDisabled: false,
})

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
      }
    }),
  endRound: () =>
    set((state) => {
      const index = state.players.indexOf(state.nowPlayer)
      const lastPlayer: boolean = index === state.players.length - 1
      return {
        nowPlayer: state.players[(index + 1) % state.players.length],
        rounds: state.rounds + (lastPlayer ? +1 : 0),
        dices: undefined,
      }
    }),
  writeScore: (cat: TCategories) =>
    set((state) => {
      console.log({ dices: state.dices, s: (state.playerScores.get(state.nowPlayer) as PlayerScore)[cat] })
      if (!state.dices || (state.playerScores.get(state.nowPlayer) as PlayerScore)[cat]) return state
      const computed = computeTopsides(state.dices)
      const n = computed[cat]
      console.log(computed)
      console.log({ n })
      const prevPS: PlayerScore = state.playerScores.get(state.nowPlayer) as PlayerScore
      const nextPS: PlayerScore = { ...prevPS, [cat]: n }
      const { subtotal, bonus, total } = computeUnwritableCategories(nextPS)
      nextPS.subtotal = subtotal
      nextPS.bonus = bonus
      nextPS.total = total
      console.log('nextPS', nextPS)
      const nextPSs: typeof state['playerScores'] = new Map(state.playerScores.set(state.nowPlayer, nextPS))
      return { playerScores: nextPSs }
    }),
  setDiceTouchDisabled: (b: boolean) =>
    set((state) => {
      return { diceTouchDisabled: b }
    }),
}))
