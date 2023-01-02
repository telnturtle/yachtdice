/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import { ReactElement, useEffect, useReducer, useRef, useState } from 'react'
import { aver, coinToss, getRandomIntInclusive } from '../../common/util'
import { BasicRotationDirection, TMatrix } from './type'
import {
  displayLeftRollsEmoji,
  getRandomDirection,
  getRandomDirectionBatch,
  getRandomLengthDirectionBatch,
  getRepresentativeMatrix,
  identityMatrixFourByFour,
  matrixToTopside,
  multiplyMatrix,
  rotatorRandomXyz,
} from './util'
import { useScoreStore } from '../score/store'
import { Dice } from './Dice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  alignUnkeeps,
  rotateBatch,
  selectDice0,
  selectDiceIdsUnkept,
  selectDiceKeeps,
  selectDices,
  selectDicesUnkept,
  selectUnkeepDicesByOrder,
  selectUnkeptDiceIdsOrdersTable,
  sortUnkeeps,
  toggleTilt,
  toggleTiltByOrder,
} from './diceSlice'
import {
  decreaseLeftRolls,
  selectDiceShaking,
  selectLeftRolls,
  selectRollFreezed,
  toggleDiceShaking,
  toggleRollFreezed,
} from '../score/scoreSlice'
import { ZFour } from '../../common/type'

export function RollButton(): ReactElement {
  const keeps = useAppSelector(selectDiceKeeps)
  const dispatch = useAppDispatch()
  const timerRef = useRef<number | null>(null)
  const timerUntiltRef = useRef<number | null>(null)
  const leftRolls = useAppSelector(selectLeftRolls)
  const diceShaking = useAppSelector(selectDiceShaking)
  const rollFreezed = useAppSelector(selectRollFreezed)
  const unkeptDiceIdsOrdersTable = useAppSelector(selectUnkeptDiceIdsOrdersTable)
  const dicesUnkept = useAppSelector(selectDicesUnkept)
  const dices = useAppSelector(selectDices)
  const diceIdsUnkept = useAppSelector(selectDiceIdsUnkept)
  const unkeepDicesByOrder = useAppSelector(selectUnkeepDicesByOrder)
  const [toggleTiltSignal, signalToggleTilt] = useReducer((x) => x + 1, 0)
  const [toggleTiltSignalSlow, signalToggleTiltSlow] = useReducer((x) => x + 1, 0)
  const [toggleTiltSignalSlower, signalToggleTiltSlower] = useReducer((x) => x + 1, 0)

  /** Roll the dices */
  const onRoll = () => {
    if (rollFreezed || !leftRolls || keeps.every(Boolean) || timerRef.current !== null) return
    dispatch(toggleDiceShaking())
    dispatch(toggleRollFreezed())
    dispatch(decreaseLeftRolls())
    const numberofDiceUnkept = diceIdsUnkept.size
    const halfNumberofDiceUnkept = Math.floor(numberofDiceUnkept)
    const r = getRandomIntInclusive(2, 3)
    const count = {
      tilt: 1,
      first: leftRolls === 3 ? Math.floor(((numberofDiceUnkept + 2) / 100) * 200) : numberofDiceUnkept + 3,
      diceIndex: 0,
      diceDelayer: false,
      dices: [
        diceIdsUnkept.has(0) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(1) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(2) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(3) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(4) ? getRandomLengthDirectionBatch() : [],
      ],
      second: r + 1 + halfNumberofDiceUnkept,
      sort: 1,
      third: r,
      align: 1,
      fourth: r,
      untilt: 1,
      fifth: r,
    }
    for (let i = 0; i < 5; i++) {
      if (coinToss() && coinToss() && coinToss() && coinToss() && coinToss() && coinToss()) {
        count.dices[i] = [...count.dices[i], ...count.dices[i]]
      }
    }
    if (leftRolls === 2) {
      for (let i = 0; i < 5; i++) {
        const r = getRandomIntInclusive(3, 5)
        for (let _ = 0; _ < r; _++) {
          count.dices[i].pop()
        }
      }
    } else if (leftRolls === 1) {
      for (let i = 0; i < 5; i++) {
        if (count.dices[i].length) {
          const r = getRandomIntInclusive(3, 5)
          for (let _ = 0; _ < r; _++) {
            count.dices[i].unshift(count.dices[i][count.dices[i].length - 1])
          }
        }
      }
    }
    console.log(count.second, '!!!', aver(count.dices.map(({ length }) => length).filter(Boolean)))
    // count.second += Math.floor((Math.max(...count.dices.map(({ length }) => length)) - 25) / 4)
    console.log(count.second, '!!!')
    // count.third += Math.floor(Math.max(count.dices.length) / 2)
    // count.fourth += Math.floor(Math.max(count.dices.length) / 3)
    // count.fifth += Math.floor(Math.max(count.dices.length) / 4)
    const table = unkeptDiceIdsOrdersTable
    timerRef.current = window.setInterval(() => {
      if (count.tilt) {
        ;(leftRolls === 3 ? signalToggleTiltSlow : signalToggleTilt)()
        count.tilt--
      } else if (count.first) {
        count.first--
      } else if (count.dices.map(({ length }) => length).some(Boolean)) {
        const batch: [ZFour, BasicRotationDirection][] = []

        for (let i = 0; i <= Math.min(count.diceIndex, count.dices.length); i++) {
          if (table.has(i as ZFour) && count.dices[table.get(i as ZFour)!].length) {
            if (count.dices[table.get(i as ZFour)!].length === 1) {
              // count.untilt[table.get(i as ZFour)!] = 14
              // count.untilt[table.get(i as ZFour)!] = 1
            }
            batch.push([table.get(i as ZFour)!, count.dices[table.get(i as ZFour)!].pop()!])
          }
        }
        // for (let i = 0; i <= Math.min(count.diceIndex, count.dices.length); i++) {
        //   if (table.has(i as ZFour) && count.dices[table.get(i as ZFour)!].length) {
        //     batch.push([table.get(i as ZFour)!, count.dices[table.get(i as ZFour)!].pop()!])
        //   }
        // }
        // Object.keys(count.untilt).forEach((id) => {
        //   if (count.untilt[id as unknown as ZFour] === 1) {
        //     dispatch(toggleTilt(Number(id) as ZFour))
        //   }
        //   count.untilt[id as unknown as ZFour]--
        // })

        count.diceDelayer = !count.diceDelayer
        if (!count.diceDelayer) {
          do {
            count.diceIndex++
          } while (count.dices[count.diceIndex]?.length === 0)
        }
        dispatch(rotateBatch(batch))
      } else if (count.second) {
        count.second--
        // Object.keys(count.untilt).forEach((id) => {
        //   if (count.untilt[id as unknown as ZFour] === 1) {
        //     dispatch(toggleTilt(Number(id) as ZFour))
        //   }
        //   count.untilt[id as unknown as ZFour]--
        // })
      } else if (count.sort) {
        dispatch(sortUnkeeps())
        count.sort--
      } else if (count.third) {
        count.third--
      } else if (count.align) {
        count.align--
        // align unkeeps
        dispatch(alignUnkeeps())
      } else if (count.fourth) {
        count.fourth--
      } else if (count.untilt) {
        ;(leftRolls === 1 ? signalToggleTiltSlower : signalToggleTilt)()
        count.untilt--
      } else if (count.fifth) {
        count.fifth--
      } else {
        dispatch(toggleDiceShaking())
        dispatch(toggleRollFreezed())
        clearInterval(timerRef.current!)
        timerRef.current = null
      }
    }, 90)
  }

  useEffect(() => {
    let orderIndex: ZFour = 0
    const t = window.setInterval(() => {
      dispatch(toggleTiltByOrder(orderIndex))
      orderIndex++
      if (orderIndex === 5) clearInterval(t)
    }, 70)
  }, [dispatch, toggleTiltSignal])
  useEffect(() => {
    let orderIndex: ZFour = 0
    const t = window.setInterval(() => {
      dispatch(toggleTiltByOrder(orderIndex))
      orderIndex++
      if (orderIndex === 5) clearInterval(t)
    }, 200)
  }, [dispatch, toggleTiltSignalSlow])
  useEffect(() => {
    let orderIndex: ZFour = 0
    const t = window.setInterval(() => {
      dispatch(toggleTiltByOrder(orderIndex))
      orderIndex++
      if (orderIndex === 5) clearInterval(t)
    }, 320)
  }, [dispatch, toggleTiltSignalSlower])

  return (
    <>
      <button
        css={CSS.roll}
        className={cx({
          leftZeroRolls: !leftRolls || keeps.every(Boolean),
          bouncing: leftRolls === 3,
        })}
        onClick={onRoll}
        disabled={rollFreezed || leftRolls === 0}
      >
        Roll the dices!
      </button>
    </>
  )
}

// Animated 3D Dice Roll - CodeSandbox https://codesandbox.io/s/animated-3d-dice-roll-eorl0?from-embed

const CSS = {
  root: css`
    height: 100%;
    padding: 0 0 0 5vmin;
    display: flex;
  `,
  diceRow: css`
    display: flex;
    flex-flow: column;
  `,
  roll: css`
    position: absolute;
    bottom: 0;
    right: 0;
    /* https://gradientbuttons.colorion.co */
    background-image: linear-gradient(to right, #f09819 0%, #f09819 31%, #ff512f 100%);
    transition: 0.5s;
    box-shadow: 0 0 20px #eee;
    text-align: center;
    text-transform: uppercase;
    display: block;
    color: #f0f0f0;
    font-weight: 900;
    font-size: larger;
    width: calc(2 * min(16vw, 9vh));
    height: calc(3 * min(16vw, 9vh));
    opacity: 0.9;
    border: none;
    &:disabled {
      opacity: 20%;
    }
    &.bouncing {
      animation: 1.5s ease-in-out bouncing infinite;
    }
    @keyframes bouncing {
      from {
        transform: scale(1);
      }
      50% {
        transform: scale(108%);
      }
      to {
        transform: scale(1);
      }
    }
    &.leftzerorolls {
      opacity: 0.6;
    }
  `,
  rollLeft: css`
    position: absolute;
    bottom: 36vmin;
    right: 4vmin;
    font-weight: 700;
    color: #222;
    font-size: 140%;
    &.head {
      opacity: 0.8;
    }
  `,
}
