import { useEffect, useRef } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectDices } from '../dice/diceSlice'
import { setMessages } from '../message/messageSlice'
import { selectDiceShaking, selectLeftRolls, selectLeftTurns, selectPIndex, selectPlayers } from '../score/scoreSlice'
import { computeTopsides } from '../score/util'

export function GameStatus() {
  const players = useAppSelector(selectPlayers)
  const pIndex = useAppSelector(selectPIndex)
  // const leftTurns = useAppSelector(selectLeftTurns)
  const dices = useAppSelector(selectDices)
  const leftRolls = useAppSelector(selectLeftRolls)
  const diceShaking = useAppSelector(selectDiceShaking)

  const dispatch = useAppDispatch()

  const ref = useRef<{ leftRolls: Number; pIndex: number }>({ leftRolls, pIndex })

  useEffect(() => {
    // 주사위 눈이 yacht, ls, ss, fh, foak 일 때 안내하며
    // 안내의 조건은
    // leftrolls, pindex 중 하나라도 달라졌을 때,
    // 또한 leftrolls가 3보다 작을 때 (한번이라도 굴렸을 때),
    // not diceshaking일 때 (굴림이 끝났을 때) 안내함

    const prev = ref.current
    !diceShaking && console.log(prev, { leftRolls, pIndex })
    if ((prev.leftRolls !== leftRolls || prev.pIndex !== pIndex) && !diceShaking) {
      ref.current = { leftRolls, pIndex }
      if (leftRolls < 3 && diceShaking === false) {
        const { fourOfAKind, fullHouse, smallStraight, largeStraight, yacht } = computeTopsides(
          dices.map((d) => d.topside)
        )
        const player = players[pIndex]
        // 이미 점수가 적혀져있다면
        // 안내하지 않음
        const array: { cat: string; value: number | null }[] = [
          { cat: 'Yacht', value: player.yacht !== undefined ? null : yacht },
          { cat: 'Large Straight', value: player.largeStraight !== undefined ? null : largeStraight },
          { cat: 'Small Straight', value: player.smallStraight !== undefined ? null : smallStraight },
          { cat: 'Full House', value: player.fullHouse !== undefined ? null : fullHouse },
          { cat: 'Four of a Kind', value: player.fourOfAKind !== undefined ? null : fourOfAKind },
        ]
        for (const el of array) {
          if (el.value) {
            dispatch(setMessages([el.cat]))
            break
          }
        }
      }
    }
  }, [leftRolls, pIndex, diceShaking, dices, dispatch, players])

  return <></>
}
