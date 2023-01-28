import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../../app/store'

export interface MessageState {
  messages: string[]
}

const initialState: MessageState = {
  messages: ['Yacht Dice'],
//   ['Yacht Dice',
// 'Large Straight',
// 'Small Straight',
// 'Full House',
// 'Four of a Kind',]
}

export const messageSlice = createSlice({
  name: 'message',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.messages = []
    },
    setMessages: (state, action: PayloadAction<string[]>) => {
      state.messages = action.payload
    },
  },
})

export const { clearMessage, setMessages } = messageSlice.actions

export const selectMessages = (state: RootState) => state.message.messages

export const messageReducer = messageSlice.reducer
