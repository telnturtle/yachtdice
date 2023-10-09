/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactElement } from 'react'
import { Dice } from './Dice'
import { RollButton } from './RollButton'
import { useAppSelector } from '../../app/hooks'
import { selectLeftRolls } from '../score/scoreSlice'

/** 게임에서 쓰이는 주사위 5개, roll 버튼, 남은 roll 횟수를 나타낸다. */
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

/** 남은 roll 횟수 */
function RollLeft() {
  const leftRolls = useAppSelector(selectLeftRolls)
  return (
    <span css={CSS.rollLeft}>
      <span className="number">{leftRolls}</span>
      {' rolls left'}
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
    font-weight: 300;
    color: #222;
    font-size: 0.25rem;
    & .number {
      font-weight: 800;
      opacity: 0.8;
    }
    pointer-events: none;
  `,
}
