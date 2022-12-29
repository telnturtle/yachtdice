/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import { ReactElement, useEffect, useReducer, useRef, useState } from 'react'
import { getRandomIntInclusive } from '../../common/util'
import { TMatrix } from './type'
import {
  displayLeftRollsEmoji,
  getRandomDirection,
  getRepresentativeMatrix,
  identityMatrixFourByFour,
  matrixToTopside,
  multiplyMatrix,
  rotatorRandomXyz,
} from './util'
import { useScoreStore } from '../score/store'
import { Dice } from './Dice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { alignUnkeeps, rotateBatch, selectDice0, selectDiceKeeps, sortUnkeeps, toggleTilt } from './diceSlice'

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

export function Dices(): ReactElement {
  const keeps = useAppSelector(selectDiceKeeps)
  const dispatch = useAppDispatch()
  const timerRef = useRef<number | null>(null)
  const [leftRolls, setLeftRolls] = useState<number>(3)
  const [touchDisabled, setTouchDisabled] = useScoreStore((s) => [s.diceTouchDisabled, s.setDiceTouchDisabled])

  /** Roll the dice with the id `id` */
  const roll = (id: number) => {
    // tilt
    //
    //

    const numberRolls = getRandomIntInclusive(15, 21)
    const rolls = Array(numberRolls).fill(0).map(rotatorRandomXyz)
    setDiceInfos((prev) => {
      const next = [...prev]
      next[id - 1] = {
        ...prev[id - 1],
        accumMatrix: rolls.reduce(multiplyMatrix, prev[id - 1].accumMatrix),
        matricesPerTerm: rolls,
      }
      return next
    })
  }

  /** Roll the dices */
  const onRoll = () => {
    if (touchDisabled || !leftRolls || keeps.every(Boolean) || timerRef.current !== null) return
    setTouchDisabled(true)
    let count = 0
    timerRef.current = window.setInterval(() => {
      if (count === 0) {
        // tilt 0
        dispatch(toggleTilt(0))
      } else if (count === 1) {
        // tilt 1
        dispatch(toggleTilt(1))
      } else if (count === 2) {
        // tilt 2
        dispatch(toggleTilt(2))
      } else if (count === 3) {
        // tilt 3
        dispatch(toggleTilt(3))
      } else if (count === 4) {
        // tilt 4
        dispatch(toggleTilt(4))
      } else if (count === 5) {
        // roll dice 0
        dispatch(rotateBatch([[0, getRandomDirection()]]))
      } else if (count === 6) {
        // roll dice 0, 1
        dispatch(
          rotateBatch([
            [0, getRandomDirection()],
            [1, getRandomDirection()],
          ])
        )
      } else if (count === 7) {
        // roll dice 0-2
        dispatch(
          rotateBatch([
            [0, getRandomDirection()],
            [1, getRandomDirection()],
            [2, getRandomDirection()],
          ])
        )
      } else if (count === 8) {
        // roll dice 0-3
        dispatch(
          rotateBatch([
            [0, getRandomDirection()],
            [1, getRandomDirection()],
            [2, getRandomDirection()],
            [3, getRandomDirection()],
          ])
        )
      } else if (count < 35) {
        // roll dice 0-4
        dispatch(
          rotateBatch([
            [0, getRandomDirection()],
            [1, getRandomDirection()],
            [2, getRandomDirection()],
            [3, getRandomDirection()],
            [4, getRandomDirection()],
          ])
        )
      } else if (count === 35) {
        // roll dice 1-4
        dispatch(
          rotateBatch([
            [1, getRandomDirection()],
            [2, getRandomDirection()],
            [3, getRandomDirection()],
            [4, getRandomDirection()],
          ])
        )
      } else if (count === 36) {
        // roll dice 2-4
        dispatch(
          rotateBatch([
            [2, getRandomDirection()],
            [3, getRandomDirection()],
            [4, getRandomDirection()],
          ])
        )
      } else if (count === 37) {
        // roll dice 3, 4
        dispatch(
          rotateBatch([
            [3, getRandomDirection()],
            [4, getRandomDirection()],
          ])
        )
      } else if (count === 38) {
        // roll dice 4
        dispatch(rotateBatch([[4, getRandomDirection()]]))
      } else if (count < 49) {
        // do nothing
      } else if (count === 49) {
        // untilt 0
        dispatch(toggleTilt(0))
      } else if (count === 50) {
        // untilt 1
        dispatch(toggleTilt(1))
      } else if (count === 51) {
        // untilt 2
        dispatch(toggleTilt(2))
      } else if (count === 52) {
        // untilt 3
        dispatch(toggleTilt(3))
      } else if (count === 53) {
        // untilt 4
        dispatch(toggleTilt(4))
      } else if (count < 59) {
        // do nothing
      } else if (count === 59) {
        // sort unkeeps
        dispatch(sortUnkeeps())
      } else if (count < 69) {
        // do nothing
      } else {
        // align unkeeps
        dispatch(alignUnkeeps())
        clearInterval(timerRef.current!)
        timerRef.current = null
      }
      count++
    }, 70)
    setLeftRolls((prev) => prev - 1)
  }

  return (
    <>
      <button
        css={CSS.roll}
        className={cx({
          leftZeroRolls: !leftRolls || keeps.every(Boolean),
          bouncing: leftRolls === 3,
        })}
        onClick={onRoll}
        disabled={touchDisabled}
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
    width: 20vmin;
    height: 30vmin;
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
