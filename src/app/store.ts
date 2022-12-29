import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { diceReducer } from '../features/dice/diceSlice'

export const store = configureStore({
  reducer: {
    dice: diceReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
