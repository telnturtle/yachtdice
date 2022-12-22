/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import { ReactElement, useState } from 'react'
import { TMatrix } from '../modules/dice/type'
import {
  displayLeftRollsEmoji,
  getRandomIntInclusive,
  identityMatrixFourByFour,
  matrixToTopside,
  multiplyMatrix,
  rotatorRandomXyz,
} from '../modules/dice/util'
import { useScoreStore } from '../modules/score/store'
import { Dice } from './Dice'

interface DiceInfo {
  id: number
  accumMatrix: TMatrix
  matricesPerTerm: TMatrix[]
  order: number
  kept: boolean
  topside: number
  keptOrder: number
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
  const [diceInfos, setDiceInfos] = useState<DiceInfo[]>(INITIAL_DICE_INFO_LIST)
  // const [touchDisabled, setTouchDisabled] = useState<boolean>(false);
  const [leftRolls, setLeftRolls] = useState<number>(3)
  const [setDices, touchDisabled, setTouchDisabled] = useScoreStore((s) => [
    s.setDices,
    s.diceTouchDisabled,
    s.setDiceTouchDisabled,
  ])

  /** Roll the dice with the id `id` */
  const roll = (id: number) => {
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
    if (touchDisabled || !leftRolls || diceInfos.every((__) => __.kept)) return
    /* Shakes the dices */
    setTouchDisabled(true)
    diceInfos.forEach((di) => {
      if (!di.kept)
        setTimeout(() => {
          roll(di.id)
        }, 50 * di.order)
    })
    setLeftRolls((prev) => prev - 1)
    /* Sort dices on the screen after a shaking */
    setTimeout(() => {
      setDiceInfos((prev) => {
        const next = prev.map((di) => ({ ...di, topside: matrixToTopside(di.accumMatrix) || 1 }))
        const unkepts = next.filter((di) => !di.kept).sort((a, b) => a.topside - b.topside)
        const oneToFive = [5, 4, 3, 2, 1]
        unkepts.forEach((di) => {
          next[di.id - 1].order = oneToFive.pop() || 1
        })
        setDices(next.map((di) => di.topside))
        return next
      })
      setTouchDisabled(false)
    }, 100 * 21 + 500 + 200 /* magic number */)
  }

  /** Toggle the keep of the dice of the id */
  const onDiceClick = (id: number) => {
    if (touchDisabled || leftRolls === 3) return
    setDiceInfos((prev) => {
      const next = [...prev]
      const keptOrders = new Set(next.filter((__) => __.kept).map((__) => __.keptOrder))
      const orders = new Set(next.filter((__) => !__.kept).map((__) => __.order))
      const dice = { ...next[id - 1], kept: !next[id - 1].kept }
      if (dice.kept) {
        dice.keptOrder = Math.max(...[1, 2, 3, 4, 5].filter((__) => !keptOrders.has(__)))
      } else {
        dice.order = Math.min(...[1, 2, 3, 4, 5].filter((__) => !orders.has(__)))
      }
      next[id - 1] = dice
      return next
    })
  }
  const buttonClassName = cx({
    leftZeroRolls: !leftRolls || diceInfos.every((__) => __.kept),
    bouncing: leftRolls === 3,
  })
  return (
    <div css={CSS.root}>
      <div css={CSS.diceRow}>
        {diceInfos.map(({ id, order, matricesPerTerm, kept, keptOrder }) => (
          <Dice
            key={id}
            {...{ order, id, kept, onClick: onDiceClick, keptOrder }}
            transformationMatrixSequence={matricesPerTerm}
          />
        ))}
      </div>
      <button css={CSS.roll} className={buttonClassName} onClick={onRoll} disabled={touchDisabled}>
        Roll the dices!
      </button>
      <span css={CSS.rollLeft}>
        <span className="head">{displayLeftRollsEmoji(leftRolls).head}</span>
        {displayLeftRollsEmoji(leftRolls).tail}
      </span>
    </div>
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
