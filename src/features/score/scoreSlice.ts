import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { TCategoriesWritable } from './type'
import { computeUnwritableCategories } from './util'

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
  aces: undefined,
  deuces: undefined,
  threes: undefined,
  fours: undefined,
  fives: undefined,
  sixes: undefined,
  subtotal: 0,
  bonus: 0,
  choice: undefined,
  fourOfAKind: undefined,
  fullHouse: undefined,
  smallStraight: undefined,
  largeStraight: undefined,
  yacht: undefined,
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
      console.log(action)
      state.players[state.pIndex][action.payload.cat] = action.payload.score
      const { subtotal, bonus, total } = computeUnwritableCategories(state.players[state.pIndex])
      state.players[state.pIndex].subtotal = subtotal
      state.players[state.pIndex].bonus = bonus
      state.players[state.pIndex].total = total
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
    initScore: (state) => {
      state.pIndex = initialState.pIndex
      state.diceShaking = initialState.diceShaking
      state.leftRolls = initialState.leftRolls
      state.leftTurns = initialState.leftTurns
      state.rollFreezed = initialState.rollFreezed
      state.players[0] = { ...initialState.players[0] }
      state.players[1] = { ...initialState.players[1] }
    },
  },
})

export const { writeScore, toggleDiceShaking, toggleRollFreezed, decreaseLeftRolls, initScore } = scoreSlice.actions

export const selectRollFreezed = (state: RootState) => state.score.rollFreezed
export const selectLeftRolls = (state: RootState) => state.score.leftRolls
export const selectLeftTurns = (state: RootState) => state.score.leftTurns
export const selectPlayer = (state: RootState) => state.score.players[state.score.pIndex]
export const selectPlayers = (state: RootState) => state.score.players
export const selectPIndex = (state: RootState) => state.score.pIndex
export const selectDiceShaking = (state: RootState) => state.score.diceShaking

export const scoreReducer = scoreSlice.reducer
