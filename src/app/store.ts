/* https://github.com/reduxjs/cra-template-redux 로 생성된 템플릿 */

import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { diceReducer } from '../features/dice/diceSlice'
import { messageReducer } from '../features/message/messageSlice'
import { scoreReducer } from '../features/score/scoreSlice'

export const store = configureStore({
  reducer: {
    dice: diceReducer,
    score: scoreReducer,
    message: messageReducer,
  },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>
