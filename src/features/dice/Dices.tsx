/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactElement } from 'react'
import { displayLeftRollsEmoji } from './util'
import { Dice } from './Dice'
import { RollButton } from './RollButton'
import { useAppSelector } from '../../app/hooks'
import { selectLeftRolls } from '../score/scoreSlice'

/** The initial dice info list value for a `useState` */

export function Dices(): ReactElement {
  return (
    <div css={CSS.root}>
      <div css={CSS.diceRow}>
        <Dice key={0} id={0} />
        <Dice key={1} id={1} />
        <Dice key={2} id={2} />
        <Dice key={3} id={3} />
        <Dice key={4} id={4} />
      </div>
      <RollButton />
      <RollLeft />
    </div>
  )
}

function RollLeft() {
  const leftRolls = useAppSelector(selectLeftRolls)
  return (
    <span css={CSS.rollLeft}>
      <span className="head">{displayLeftRollsEmoji(leftRolls).head}</span>
      {displayLeftRollsEmoji(leftRolls).tail}
    </span>
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
    bottom: calc(3.375 * min(16vw, 9vh));
    width: calc(2 * min(16vw, 9vh));
    text-align: center;
    right: 0;
    font-weight: 700;
    color: #222;
    font-size: calc(0.25 * min(16vw, 9vh));
    &.head {
      opacity: 0.8;
    }
  `,
}
