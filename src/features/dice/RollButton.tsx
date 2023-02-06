/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import { ReactElement, useEffect, useReducer, useRef } from 'react'
import { coinToss, getRandomIntInclusive } from '../../common/util'
import { BasicRotationDirection } from './type'
import { getRandomLengthDirectionBatch } from './util'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import {
  alignUnkeeps,
  rotateBatch,
  selectDiceIdsUnkept,
  selectDiceKeeps,
  selectUnkeptDiceIdsOrdersTable,
  sortUnkeeps,
  tiltByOrder,
  untiltByOrder,
} from './diceSlice'
import {
  decreaseLeftRolls,
  selectLeftRolls,
  selectLeftTurns,
  selectRollFreezed,
  toggleDiceShaking,
  toggleRollFreezed,
} from '../score/scoreSlice'
import { ZFour } from '../../common/type'

const TICKS = { normal: 70, slow: 150, slower: 320 }

export function RollButton(): ReactElement {
  const keeps = useAppSelector(selectDiceKeeps)
  const dispatch = useAppDispatch()
  const timerRef = useRef<number | null>(null)
  const leftRolls = useAppSelector(selectLeftRolls)
  const rollFreezed = useAppSelector(selectRollFreezed)
  const unkeptDiceIdsOrdersTable = useAppSelector(selectUnkeptDiceIdsOrdersTable)
  const diceIdsUnkept = useAppSelector(selectDiceIdsUnkept)
  const leftTurns = useAppSelector(selectLeftTurns)
  const [tiltSignal, signalTilt] = useReducer(
    (_: any, { tilt, tick }: { tilt: boolean; tick: number }) => ({ tilt, tick }),
    { tilt: true, tick: 0 }
  )

  /** Roll the dices */
  const onRoll = () => {
    if (rollFreezed || !leftRolls || keeps.every(Boolean) || timerRef.current !== null) return
    dispatch(toggleDiceShaking())
    dispatch(toggleRollFreezed())
    dispatch(decreaseLeftRolls())
    const numberofDiceUnkept = diceIdsUnkept.size
    const halfNumberofDiceUnkept = Math.floor(numberofDiceUnkept / 2)
    const r = getRandomIntInclusive(2, 4) - (leftRolls !== 3 ? getRandomIntInclusive(0, 2) : 0)
    const count = {
      tilt: 1,
      first:
        leftRolls === 3
          ? Math.floor(((numberofDiceUnkept + 2) / 90) * 150)
          : Math.floor(((numberofDiceUnkept + 3) / 90) * 70),
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
      third: 2,
      align: 1,
      fourth: 2,
      untilt: 1,
      fifth: 2,
    }
    for (let i = 0; i < 5; i++) {
      if (coinToss() && coinToss() && coinToss() && coinToss() && coinToss() && coinToss()) {
        count.dices[i] = [...count.dices[i], ...count.dices[i]]
      }
    }
    if (leftRolls === 1) {
      for (let i = 0; i < 5; i++) {
        if (count.dices[i].length) {
          const r = getRandomIntInclusive(3, 5)
          for (let _ = 0; _ < r; _++) {
            count.dices[i].unshift(count.dices[i][count.dices[i].length - 1])
          }
        }
      }
    }
    const table = unkeptDiceIdsOrdersTable
    timerRef.current = window.setInterval(() => {
      if (count.tilt) {
        signalTilt({ tilt: true, tick: leftRolls === 3 ? TICKS.slow : TICKS.normal })
        count.tilt--
      } else if (count.first) {
        count.first--
      } else if (count.dices.map(({ length }) => length).some(Boolean)) {
        const batch: [ZFour, BasicRotationDirection][] = []

        for (let i = 0; i <= Math.min(count.diceIndex, count.dices.length); i++) {
          if (table.has(i as ZFour) && count.dices[table.get(i as ZFour)!].length) {
            batch.push([table.get(i as ZFour)!, count.dices[table.get(i as ZFour)!].pop()!])
          }
        }

        count.diceDelayer = !count.diceDelayer
        if (!count.diceDelayer) {
          do {
            count.diceIndex++
          } while (count.dices[count.diceIndex]?.length === 0)
        }
        dispatch(rotateBatch(batch))
      } else if (count.second) {
        count.second--
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
        signalTilt({ tilt: false, tick: leftRolls === 1 ? TICKS.slower : TICKS.normal })
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
    if (tiltSignal.tick !== 0) {
      let orderIndex: ZFour = 0
      const t = window.setInterval(() => {
        dispatch((tiltSignal.tilt ? tiltByOrder : untiltByOrder)(orderIndex))
        orderIndex++
        if (orderIndex === 5) clearInterval(t)
      }, tiltSignal.tick)
    }
  }, [dispatch, tiltSignal])

  return (
    <>
      <button
        css={CSS.roll}
        className={cx({
          leftZeroRolls: !leftRolls || keeps.every(Boolean),
          bouncing: leftRolls === 3 && leftTurns > 0,
        })}
        onMouseDown={onRoll}
        disabled={rollFreezed || leftRolls === 0 || leftTurns <= 0}
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
    color: #fafafa;
    font-size: 0.375rem;
    word-spacing: 1rem;
    width: 2rem;
    height: 3rem;
    opacity: 0.9;
    border: none;
    &:disabled {
      opacity: 20%;
    }
    &.bouncing {
      animation: 0.75s ease-in-out bouncing infinite alternate;
    }
    @keyframes bouncing {
      from {
        transform: scale(1);
      }
      to {
        transform: scale(108%);
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
