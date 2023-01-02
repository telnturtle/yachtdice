import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { TCategoriesWritable } from './type'

export interface ScoreState {
  players: PlayerMeta[]
  pIndex: number
  diceShaking: boolean
  leftRolls: number
  leftTurns: number
  rollFreezed: boolean
}

export interface PlayerMeta /* extends _*/ {
  index: number
  name: string
  aces?: number
  deuces?: number
  threes?: number
  fours?: number
  fives?: number
  sixes?: number
  subtotal: number
  bonus: number
  choice?: number
  fourOfAKind?: number
  fullHouse?: number
  smallStraight?: number
  largeStraight?: number
  yacht?: number
  total: number
}

const defalutPlayerMeta: PlayerMeta = {
  index: 0,
  name: 'Player One',
  aces: 0,
  deuces: 0,
  threes: 0,
  fours: 0,
  fives: 0,
  sixes: 0,
  subtotal: 0,
  bonus: 0,
  choice: 0,
  fourOfAKind: 0,
  fullHouse: 0,
  smallStraight: 0,
  largeStraight: 0,
  yacht: 0,
  total: 0,
}

const initialState: ScoreState = {
  players: [{ ...defalutPlayerMeta }, { ...defalutPlayerMeta, index: 1, name: 'Player Two' }],
  pIndex: 0,
  diceShaking: false,
  leftRolls: 3,
  leftTurns: 12,
  rollFreezed: false,
}

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    writeScore: (state, action: PayloadAction<{ cat: TCategoriesWritable; score: number }>) => {
      state.players[state.pIndex][action.payload.cat] = action.payload.score
      state.pIndex = (state.pIndex + 1) % state.players.length
      state.leftTurns -= Number(state.pIndex === 0)
      state.leftRolls = 3
    },
    toggleDiceShaking: (state) => {
      state.diceShaking = !state.diceShaking
    },
    toggleRollFreezed: (state) => {
      state.rollFreezed = !state.rollFreezed
    },
    decreaseLeftRolls: (state) => {
      state.leftRolls--
    },
  },
})

export const { writeScore, toggleDiceShaking, toggleRollFreezed, decreaseLeftRolls } = scoreSlice.actions

export const selectRollFreezed = (state: RootState) => state.score.rollFreezed
export const selectLeftRolls = (state: RootState) => state.score.leftRolls
export const selectPlayer = (state: RootState) => state.score.players[state.score.pIndex]
export const selectPlayers = (state: RootState) => state.score.players
export const selectPIndex = (state: RootState) => state.score.pIndex
export const selectDiceShaking = (state: RootState) => state.score.diceShaking

export const scoreReducer = scoreSlice.reducer
