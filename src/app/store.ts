import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { diceReducer } from '../features/dice/diceSlice'
import { scoreReducer } from '../features/score/scoreSlice'

export const store = configureStore({
  reducer: {
    dice: diceReducer,
    score: scoreReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
