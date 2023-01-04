// import { useEffect } from 'react'
// import { useAppDispatch, useAppSelector } from '../../app/hooks'
// import { setMessages } from '../message/messageSlice'
// import { selectLeftTurns, selectPlayers } from '../score/scoreSlice'

export function GameStatus() {
  // const players = useAppSelector(selectPlayers)
  // const leftTurns = useAppSelector(selectLeftTurns)
  // const dispatch = useAppDispatch()

  // useEffect(() => {
  //   if (leftTurns === 0) {
  //     if (players[0].total === players[1].total) {
  //       dispatch(setMessages(['Draw!']))
  //     } else {
  //       const winner = players[0].total > players[1].total ? players[0].name : players[1].name
  //       dispatch(setMessages([`${winner} is the winner!`]))
  //     }
  //   }
  // }, [players, leftTurns])

  return <></>
}
