import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'
import { ZFour } from '../../common/type'
import { BasicRotationDirection, TMatrix } from './type'
import {
  changeToRepresentativeMatrix,
  getRandomInitialTopside,
  identityMatrixFourByFour,
  matrixToTopside,
  multiplyMatrix,
  rotatorMatrices,
} from './util'

export interface DiceMeta {
  id: ZFour
  matrix: TMatrix
  topside: number
  order: ZFour
  keep: boolean
  keepOrder: ZFour
  tilt: boolean
}

export interface DiceState {
  dices: [DiceMeta, DiceMeta, DiceMeta, DiceMeta, DiceMeta]
}

const initialState: DiceState = {
  dices: [
    { id: 0, matrix: identityMatrixFourByFour, topside: 1, order: 0, keep: false, keepOrder: 0, tilt: false },
    { id: 1, matrix: identityMatrixFourByFour, topside: 1, order: 1, keep: false, keepOrder: 1, tilt: false },
    { id: 2, matrix: identityMatrixFourByFour, topside: 1, order: 2, keep: false, keepOrder: 2, tilt: false },
    { id: 3, matrix: identityMatrixFourByFour, topside: 1, order: 3, keep: false, keepOrder: 3, tilt: false },
    { id: 4, matrix: identityMatrixFourByFour, topside: 1, order: 4, keep: false, keepOrder: 4, tilt: false },
  ],
}

export const diceSlice = createSlice({
  name: 'dice',
  initialState,
  reducers: {
    /** X축 시계방향 회전 */
    rotateXCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.xcw)
    },
    /** X축 반시계방향 회전 */
    rotateXCCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.xccw)
    },
    /** Y축 시계방향 회전 */
    rotateYCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.ycw)
    },
    /** Y축 반시계방향 회전 */
    rotateYCCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.yccw)
    },
    /** Z축 시계방향 회전 */
    rotateZCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.zcw)
    },
    /** Z축 반시계방향 회전 */
    rotateZCCW: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].matrix = multiplyMatrix(state.dices[action.payload].matrix, rotatorMatrices.zccw)
    },
    /** 행렬 갱신 */
    changeMatrix: (state, action: PayloadAction<{ matrix: TMatrix; id: ZFour }>) => {
      state.dices[action.payload.id].matrix = action.payload.matrix
    },
    /** 킵되지 않은 주사위를 정렬 */
    sortUnkeeps: (state) => {
      state.dices.forEach((d) => {
        d.topside = matrixToTopside(d.matrix) ?? 1
      })
      const unkeeps = state.dices.filter(({ keep }) => !keep).sort((a, b) => a.topside - b.topside)
      const array: ZFour[] = [4, 3, 2, 1, 0]
      unkeeps.forEach((d) => {
        state.dices[d.id].order = array.pop() ?? 0
      })
    },
    /** 킵 여부 토글
     * 변경되는 순서에서 가장 상위 위치를 선택 */
    toggleKeep: (state, action: PayloadAction<ZFour>) => {
      const orders = {
        kept: new Set(),
        unkept: new Set(),
      }
      state.dices.forEach((d) => {
        if (d.keep) orders.kept.add(d.keepOrder)
        else orders.unkept.add(d.order)
      })
      const id = action.payload
      state.dices[id].keep = !state.dices[id].keep
      if (state.dices[id].keep) {
        state.dices[id].keepOrder = Math.min(...[0, 1, 2, 3, 4].filter((__) => !orders.kept.has(__))) as ZFour
      } else {
        state.dices[id].order = Math.min(...[0, 1, 2, 3, 4].filter((__) => !orders.unkept.has(__))) as ZFour
      }
    },
    /** 킵되지 않은 주사위들을 회전시켜 모양을 정렬 */
    alignUnkeeps: (state) => {
      const unkeeps = state.dices.filter((d) => !d.keep).map((d) => d.id)
      unkeeps.forEach((id) => {
        const theDice = state.dices[id]
        theDice.matrix = changeToRepresentativeMatrix(theDice.matrix)
      })
    },
    /** 주사위 여러개를 한번에 회전 */
    rotateBatch: (state, action: PayloadAction<[ZFour, BasicRotationDirection][]>) => {
      action.payload.forEach(([id, dir]) => {
        state.dices[id].matrix = multiplyMatrix(state.dices[id].matrix, rotatorMatrices[dir])
      })
    },
    /** 기울임 토글 */
    toggleTilt: (state, action: PayloadAction<ZFour>) => {
      state.dices[action.payload].tilt = !state.dices[action.payload].tilt
    },
    /** 킵되지 않은 주사위의 순서번째를 기울임 */
    tiltByOrder: (state, action: PayloadAction<ZFour>) => {
      const d = state.dices.find((dice) => dice.order === action.payload && !dice.keep)
      if (d) d.tilt = d.keep ? false : true
    },
    /** 킵되지 않은 주사위의 순서번째를 기울임해제 */
    untiltByOrder: (state, action: PayloadAction<ZFour>) => {
      const d = state.dices.find((dice) => dice.order === action.payload && !dice.keep)
      if (d) d.tilt = d.keep ? false : false
    },
    /** 킵되지 않은 주사위의 순서번째를 기울임 토글 */
    toggleTiltByOrder: (state, action: PayloadAction<ZFour>) => {
      const d = state.dices.find((dice) => dice.order === action.payload && !dice.keep)
      if (d) d.tilt = d.keep ? false : !d.tilt
    },
    /** 주사위 초기화 */
    initDices: (state) => {
      state.dices[0] = { ...initialState.dices[0], matrix: getRandomInitialTopside() }
      state.dices[1] = { ...initialState.dices[1], matrix: getRandomInitialTopside() }
      state.dices[2] = { ...initialState.dices[2], matrix: getRandomInitialTopside() }
      state.dices[3] = { ...initialState.dices[3], matrix: getRandomInitialTopside() }
      state.dices[4] = { ...initialState.dices[4], matrix: getRandomInitialTopside() }
    },
  },
})

export const {
  rotateXCW,
  rotateXCCW,
  rotateYCW,
  rotateYCCW,
  rotateZCW,
  rotateZCCW,
  changeMatrix,
  sortUnkeeps,
  toggleKeep,
  alignUnkeeps,
  rotateBatch,
  toggleTilt,
  tiltByOrder,
  untiltByOrder,
  toggleTiltByOrder,
  initDices,
} = diceSlice.actions

export const selectDices = (state: RootState) => state.dice.dices
export const selectDicesUnkept = (state: RootState) => state.dice.dices.filter(({ keep }) => !keep)
export const selectDiceIdsUnkept = (state: RootState) =>
  new Set(state.dice.dices.filter(({ keep }) => !keep).map(({ id }) => id))
export const selectDice0 = (state: RootState) => state.dice.dices[0]
export const selectDice1 = (state: RootState) => state.dice.dices[1]
export const selectDice2 = (state: RootState) => state.dice.dices[2]
export const selectDice3 = (state: RootState) => state.dice.dices[3]
export const selectDice4 = (state: RootState) => state.dice.dices[4]

export const selectDiceById: Record<ZFour, (state: RootState) => DiceMeta> = {
  0: selectDice0,
  1: selectDice1,
  2: selectDice2,
  3: selectDice3,
  4: selectDice4,
}
export const selectDiceKeeps = (state: RootState) => state.dice.dices.map(({ keep }) => keep)
export const selectUnkeptDiceIdsOrdersTable = (state: RootState) =>
  new Map<ZFour, ZFour>(state.dice.dices.filter(({ keep }) => !keep).map(({ id, order }) => [order, id]))
export const selectUnkeepDicesByOrder = (state: RootState) => {
  const array = state.dice.dices.filter(({ keep }) => !keep)
  array.sort((a, b) => a.order - b.order)
  return array
}
export const selectDiceTopsides = (state: RootState) => state.dice.dices.map(({ topside }) => topside)

export const diceReducer = diceSlice.reducer
