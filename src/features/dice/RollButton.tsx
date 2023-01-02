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
import { shallowEqual } from 'react-redux'

interface DiceInfo {
  id: number
  accumMatrix: TMatrix
  matricesPerTerm: TMatrix[]
  order: number
  kept: boolean
  topside: number
  keptOrder: number
  representativeMatrix?: TMatrix
}

/** The initial dice info list value for a `useState` */
const INITIAL_DICE_INFO_LIST: DiceInfo[] = Array(6)
  .fill(0)
  .map(
    (_, i): DiceInfo => ({
      id: i,
      accumMatrix: identityMatrixFourByFour,
      matricesPerTerm: [identityMatrixFourByFour],
      order: i,
      kept: false,
      topside: 1,
      keptOrder: 1,
    })
  )
  .slice(1)

export function RollButton(): ReactElement {
  const keeps = useAppSelector(selectDiceKeeps)
  const dispatch = useAppDispatch()
  const timerRef = useRef<number | null>(null)
  const timerUntiltRef = useRef<number | null>(null)
  // const [leftRolls, setLeftRolls] = useState<number>(3)
  const leftRolls = useAppSelector(selectLeftRolls)
  const diceFreezed = useAppSelector(selectDiceShaking)
  const rollFreezed = useAppSelector(selectRollFreezed)
  const unkeptDiceIdsOrdersTable = useAppSelector(selectUnkeptDiceIdsOrdersTable)
  const dicesUnkept = useAppSelector(selectDicesUnkept)
  const dices = useAppSelector(selectDices)
  const diceIdsUnkept = useAppSelector(selectDiceIdsUnkept)
  const unkeepDicesByOrder = useAppSelector(selectUnkeepDicesByOrder)
  // const [tiltSignal, signalTilt] = useReducer((x) => x + 1, 0)
  const [toggleTiltSignal, signalToggleTilt] = useReducer((x) => (x === 140 ? 80 : 140), 140)
  // /** Roll the dice with the id `id` */
  // const roll = (id: number) => {
  //   // tilt
  //   //
  //   //

  //   const numberRolls = getRandomIntInclusive(15, 21)
  //   const rolls = Array(numberRolls).fill(0).map(rotatorRandomXyz)
  //   setDiceInfos((prev) => {
  //     const next = [...prev]
  //     next[id - 1] = {
  //       ...prev[id - 1],
  //       accumMatrix: rolls.reduce(multiplyMatrix, prev[id - 1].accumMatrix),
  //       matricesPerTerm: rolls,
  //     }
  //     return next
  //   })
  // }

  /** Roll the dices */
  const onRoll = () => {
    if (rollFreezed || !leftRolls || keeps.every(Boolean) || timerRef.current !== null) return
    dispatch(toggleDiceShaking())
    dispatch(toggleRollFreezed())
    dispatch(decreaseLeftRolls())
    const count = {
      tilt: 1,
      first: getRandomIntInclusive(10, 14),
      diceIndex: 0,
      diceDelayer: false,
      dices: [
        diceIdsUnkept.has(0) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(1) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(2) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(3) ? getRandomLengthDirectionBatch() : [],
        diceIdsUnkept.has(4) ? getRandomLengthDirectionBatch() : [],
      ],
      second: getRandomIntInclusive(5, 8),
      sort: 1,
      third: getRandomIntInclusive(3, 5),
      align: 1,
      fourth: getRandomIntInclusive(3, 5),
      untilt: 1,
      fifth: getRandomIntInclusive(3, 5),
    }
    console.log(count.second, '!!!', aver(count.dices.map(({ length }) => length).filter(Boolean)))
    // count.second += Math.floor((Math.max(...count.dices.map(({ length }) => length)) - 25) / 4)
    count.second += Math.floor((aver(count.dices.map(({ length }) => length).filter(Boolean)) - 20) * 0.5)
    console.log(count.second, '!!!')
    // count.third += Math.floor(Math.max(count.dices.length) / 2)
    // count.fourth += Math.floor(Math.max(count.dices.length) / 3)
    // count.fifth += Math.floor(Math.max(count.dices.length) / 4)
    const table = unkeptDiceIdsOrdersTable
    timerRef.current = window.setInterval(() => {
      if (count.tilt) {
        signalToggleTilt()
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
        if (!count.diceDelayer) count.diceIndex++
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
        signalToggleTilt()
        count.untilt--
      } else if (count.fifth) {
        count.fifth--
      } else {
        dispatch(toggleDiceShaking())
        dispatch(toggleRollFreezed())
        clearInterval(timerRef.current!)
        timerRef.current = null
      }
    }, 70)
  }

  useEffect(() => {
    let orderIndex: ZFour = 0
    const t = window.setInterval(() => {
      dispatch(toggleTiltByOrder(orderIndex))
      orderIndex++
      if (orderIndex === 5) clearInterval(t)
    }, toggleTiltSignal)
  }, [dispatch, toggleTiltSignal])

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
