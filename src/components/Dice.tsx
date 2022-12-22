/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { cx } from '@emotion/css'
import { ReactElement, useCallback, useEffect, useState } from 'react'
import { TMatrix } from '../modules/dice/type'
import { identityMatrixFourByFour, makeMatrix3dTextFromMatrix, multiplyMatrix } from '../modules/dice/util'

interface DiceProps {
  id: number
  transformationMatrixSequence: TMatrix[]
  order?: number
  kept?: boolean
  onClick?: (id: DiceProps['id']) => void
  keptOrder: number
}

/**
 * ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
 *
 *
 */
export function Dice({ id, transformationMatrixSequence: tms, order, kept, onClick, keptOrder }: DiceProps): ReactElement {
  const TICK = 100
  const FLOATING = 250
  const [matrix, setMatrix] = useState<TMatrix>(identityMatrixFourByFour)
  const [float, setFloat] = useState<boolean>(false)

  const roll = useCallback((rolls: DiceProps['transformationMatrixSequence']) => {
    setFloat(true)
    for (let i = 0; i < rolls.length; i++) {
      setTimeout(() => {
        setMatrix((acc) => multiplyMatrix(acc, rolls[i]))
      }, TICK * i + FLOATING)
    }
    setTimeout(() => {
      setFloat(false)
    }, TICK * rolls.length + FLOATING)
  }, [])

  useEffect(() => {
    roll(tms)
  }, [tms, roll])
  return <D6 matrix3d={makeMatrix3dTextFromMatrix(matrix)} {...{ float, order, kept, onClick, id, keptOrder }} />
}


const diceWrapCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(1.5 * 11vmin);
  width: calc(1.5 * 11vmin);
  transition: transform 0.25s ease-in-out, bottom 0.25s ease-in-out, left 0.25s ease-in-out,
    margin-top 0.25s ease-in-out;
  position: absolute;
  left: calc(35vmin + 10vmin + 10vmax + 5vmin);
  &.float {
    transform: scale(1.225);
  }
  &.order_1 {
    bottom: calc(4 * 1.5 * 11vmin + 4vmin);
  }
  &.order_2 {
    bottom: calc(3 * 1.5 * 11vmin + 4vmin);
  }
  &.order_3 {
    bottom: calc(2 * 1.5 * 11vmin + 4vmin);
  }
  &.order_4 {
    bottom: calc(1 * 1.5 * 11vmin + 4vmin);
  }
  &.order_5 {
    bottom: calc(0 * 1.5 * 11vmin + 4vmin);
  }
  &.kept_1 {
    left: 45vmin;
    bottom: calc((100vh - 5 * 1.5 * 11vmin) / 2 + 4 * 1.5 * 11vmin);
  }
  &.kept_2 {
    left: 45vmin;
    bottom: calc((100vh - 5 * 1.5 * 11vmin) / 2 + 3 * 1.5 * 11vmin);
  }
  &.kept_3 {
    left: 45vmin;
    bottom: calc((100vh - 5 * 1.5 * 11vmin) / 2 + 2 * 1.5 * 11vmin);
  }
  &.kept_4 {
    left: 45vmin;
    bottom: calc((100vh - 5 * 1.5 * 11vmin) / 2 + 1 * 1.5 * 11vmin);
  }
  &.kept_5 {
    left: 45vmin;
    bottom: calc((100vh - 5 * 1.5 * 11vmin) / 2 + 0 * 1.5 * 11vmin);
  }
`

const diceCss = css`
  display: grid;
  grid-template-columns: 1fr;
  height: 11vmin;
  width: 11vmin;
  list-style-type: none;
  transform-style: preserve-3d;
  transition: transform 0.125s ease-in-out;
  margin-inline-start: 0;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  & .dot {
    align-self: center;
    background-color: #666;
    border-radius: 50%;
    box-shadow: inset -0.15rem 0.15rem 0.25rem rgba(0, 0, 0, 0.5);
    display: block;
    height: calc(90%);
    width: calc(90%);
    width: calc(90%);
    justify-self: center;
  }
  & [data-die='1'] {
    transform: rotate3d(0, 0, 0, 90deg) translateZ(5.1vmin);
  }
  & [data-die='2'] {
    transform: rotate3d(-1, 0, 0, 90deg) translateZ(5.1vmin);
  }
  & [data-die='3'] {
    transform: rotate3d(0, 1, 0, 90deg) translateZ(5.1vmin);
  }
  & [data-die='4'] {
    transform: rotate3d(0, -1, 0, 90deg) translateZ(5.1vmin);
  }
  & [data-die='5'] {
    transform: rotate3d(1, 0, 0, 90deg) translateZ(5.1vmin);
  }
  & [data-die='6'] {
    transform: rotate3d(1, 0, 0, 180deg) translateZ(5.1vmin);
  }
  & [data-die='1'] .dot:nth-of-type(1) {
    grid-area: five;
  }
  & [data-die='2'] .dot:nth-of-type(1) {
    grid-area: one;
  }
  & [data-die='2'] .dot:nth-of-type(2) {
    grid-area: nine;
  }
  & [data-die='3'] .dot:nth-of-type(1) {
    grid-area: one;
  }
  & [data-die='3'] .dot:nth-of-type(2) {
    grid-area: five;
  }
  & [data-die='3'] .dot:nth-of-type(3) {
    grid-area: nine;
  }
  & [data-die='4'] .dot:nth-of-type(1) {
    grid-area: one;
  }
  & [data-die='4'] .dot:nth-of-type(2) {
    grid-area: three;
  }
  & [data-die='4'] .dot:nth-of-type(3) {
    grid-area: seven;
  }
  & [data-die='4'] .dot:nth-of-type(4) {
    grid-area: nine;
  }
  & [data-die='5'] .dot:nth-of-type(1) {
    grid-area: one;
  }
  & [data-die='5'] .dot:nth-of-type(2) {
    grid-area: three;
  }
  & [data-die='5'] .dot:nth-of-type(3) {
    grid-area: five;
  }
  & [data-die='5'] .dot:nth-of-type(4) {
    grid-area: seven;
  }
  & [data-die='5'] .dot:nth-of-type(5) {
    grid-area: nine;
  }
  & [data-die='6'] .dot:nth-of-type(1) {
    grid-area: one;
  }
  & [data-die='6'] .dot:nth-of-type(2) {
    grid-area: three;
  }
  & [data-die='6'] .dot:nth-of-type(3) {
    grid-area: four;
  }
  & [data-die='6'] .dot:nth-of-type(4) {
    grid-area: six;
  }
  & [data-die='6'] .dot:nth-of-type(5) {
    grid-area: seven;
  }
  & [data-die='6'] .dot:nth-of-type(6) {
    grid-area: nine;
  }
`

interface D6Props {
  matrix3d?: string
  float: boolean
  order?: number
  kept?: boolean
  onClick: DiceProps['onClick']
  id: DiceProps['id']
  keptOrder: DiceProps['keptOrder']
}

const dieCss = css`
  box-shadow: inset -0.35rem 0.35rem 0.75rem rgba(0, 0, 0, 0.3), inset 0.5rem -0.25rem 0.5rem rgba(0, 0, 0, 0.15);
  border-radius: 10%;
  display: grid;
  grid-column: 1;
  grid-row: 1;
  grid-template-areas:
    'one two three'
    'four five six'
    'seven eight nine';
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  padding: calc(100% / 6);
  height: 100%;
  width: 100%;
  background: linear-gradient(
    90deg,
    rgba(191, 191, 191, 0.6752688172043011) 0%,
    rgba(9, 9, 121, 0.4473118279569892) 35%,
    rgba(149, 237, 255, 1) 100%
  );
  background: rgb(209, 209, 209);
  box-sizing: border-box;
`

function D6({ matrix3d = '', float, order = 0, kept, onClick = () => {}, id, keptOrder }: D6Props): ReactElement {
  return (
    <div
      css={diceWrapCss}
      className={cx({ float: float, [`order_${order}`]: Boolean(order), [`kept_${keptOrder}`]: Boolean(kept) })}
      onClick={() => onClick(id)}
    >
      <ol css={diceCss} style={{ transform: matrix3d }}>
        <li css={dieCss} data-die="1">
          <span className="dot" />
        </li>
        <li css={dieCss} data-die="2">
          <span className="dot" />
          <span className="dot" />
        </li>
        <li css={dieCss} data-die="3">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </li>
        <li css={dieCss} data-die="4">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </li>
        <li css={dieCss} data-die="5">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </li>
        <li css={dieCss} data-die="6">
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
          <span className="dot" />
        </li>
      </ol>
    </div>
  )
}
