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
  rollLeft: css`
    position: absolute;
    bottom: 3.375rem;
    width: 2rem;
    text-align: center;
    right: 0;
    font-weight: 700;
    color: #222;
    font-size: 0.25rem;
    &.head {
      opacity: 0.8;
    }
    pointer-events: none;
  `,
}
