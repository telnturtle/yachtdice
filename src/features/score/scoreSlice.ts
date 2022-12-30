import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface ScoreStae {
  players: string[]
  player: number
  diceFreezed: boolean
  leftRolls: number
  leftTurns: number
  rollFreezed: boolean
}

export interface PlayerScore /* extends _*/ {
  index: number
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

const initialState: ScoreStae = {
  players: ['One', 'Two'],
  player: 0,
  diceFreezed: false,
  leftRolls: 3,
  leftTurns: 12,
  rollFreezed: false,
}

export const scoreSlice = createSlice({
  name: 'score',
  initialState,
  reducers: {
    writeScore: (state, action: PayloadAction<>) => {

      // state.
      // write score by parameter "dices"
      // turn player
      // reset leftrolls
    },
    toggleDiceFreezed: (state) => {
      state.diceFreezed = !state.diceFreezed
    },
    toggleRollFreezed: (state) => {
      state.rollFreezed = !state.rollFreezed
    },
    decreaseLeftRolls: (state) => {
      state.leftRolls--
    },
  },
})

export const { writeScore, toggleDiceFreezed, toggleRollFreezed, decreaseLeftRolls } = scoreSlice.actions

export const selectDiceFreezed = (state: RootState) => state.score.diceFreezed
export const selectRollFreezed = (state: RootState) => state.score.rollFreezed
export const selectLeftRolls = (state: RootState) => state.score.leftRolls

export const scoreReducer = scoreSlice.reducer
