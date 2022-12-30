/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { cx } from '@emotion/css'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { TMatrix } from './type'
import {
  identityMatrixFourByFour,
  makeMatrix3dTextFromMatrix,
  multiplyMatrix,
  tiltMatrix,
  tiltMatrix3dText,
} from './util'
import {
  DiceMeta,
  DiceState,
  selectDice0,
  selectDice1,
  selectDice2,
  selectDice3,
  selectDice4,
  toggleKeep,
} from './diceSlice'
import { ZFour } from '../../common/type'
import { useAppDispatch, useAppSelector } from '../../app/hooks'

const selectorById = {
  0: selectDice0,
  1: selectDice1,
  2: selectDice2,
  3: selectDice3,
  4: selectDice4,
}

interface DiceProps {
  id: ZFour
}

/**
 * ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
 *
 *
 */
export function Dice({ id }: DiceProps): ReactElement {
  const dice = useAppSelector(selectorById[id])
  const dispatch = useAppDispatch()

  // const TICK = 100
  // const FLOATING = 250
  // const [matrix, setMatrix] = useState<TMatrix>(identityMatrixFourByFour)
  // const [float, setFloat] = useState<boolean>(false)

  // const roll = useCallback((rolls: DiceProps['transformationMatrixSequence']) => {
  //   setFloat(true)
  //   for (let i = 0; i < rolls.length; i++) {
  //     setTimeout(() => {
  //       setMatrix((acc) => multiplyMatrix(acc, rolls[i]))
  //     }, TICK * i + FLOATING)
  //   }
  //   setTimeout(() => {
  //     setFloat(false)
  //   }, TICK * rolls.length + FLOATING)
  // }, [])

  // useEffect(() => {
  //   roll(tms)
  // }, [tms, roll])
  // useEffect(() => {
  //   if (representativeMatrix) setMatrix(representativeMatrix)
  // }, [representativeMatrix])

  const onClick = useCallback(() => {
    dispatch(toggleKeep(id))
  }, [dispatch, id])

  return (
    <div
      css={diceWrapCss}
      className={cx({ [`order_${dice.order}`]: !dice.keep, [`keep_${dice.keepOrder}`]: dice.keep })}
      onClick={onClick}
    >
      <D6 matrix={dice.matrix} tilt={dice.tilt} />
    </div>
  )
}

const diceWrapCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(0.8 * min(16vw, 9vh));
  width: calc(0.8 * min(16vw, 9vh));
  transition: transform 0.25s ease-in-out, top 0.25s ease-in-out, right 0.25s ease-in-out, margin-top 0.25s ease-in-out;
  position: absolute;
  right: calc(0.5 * min(16vw, 9vh));
  &.order_0 {
    top: calc(1 * 1.25 * min(16vw, 9vh));
  }
  &.order_1 {
    top: calc(2 * 1.25 * min(16vw, 9vh));
  }
  &.order_2 {
    top: calc(3 * 1.25 * min(16vw, 9vh));
  }
  &.order_3 {
    top: calc(4 * 1.25 * min(16vw, 9vh));
  }
  &.order_4 {
    top: calc(5 * 1.25 * min(16vw, 9vh));
  }
  &.keep_0 {
    right: calc(1.75 * min(16vw, 9vh));
    top: calc(1 * 1.25 * min(16vw, 9vh));
  }
  &.keep_1 {
    right: calc(1.75 * min(16vw, 9vh));
    top: calc(2 * 1.25 * min(16vw, 9vh));
  }
  &.keep_2 {
    right: calc(1.75 * min(16vw, 9vh));
    top: calc(3 * 1.25 * min(16vw, 9vh));
  }
  &.keep_3 {
    right: calc(1.75 * min(16vw, 9vh));
    top: calc(4 * 1.25 * min(16vw, 9vh));
  }
  &.keep_4 {
    right: calc(1.75 * min(16vw, 9vh));
    top: calc(5 * 1.25 * min(16vw, 9vh));
  }
`

const diceCss = css`
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
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
    transform: rotate3d(0, 0, 0, 90deg) translateZ(calc(0.4 * min(16vw, 9vh)));
  }
  & [data-die='2'] {
    transform: rotate3d(-1, 0, 0, 90deg) translateZ(calc(0.4 * min(16vw, 9vh)));
  }
  & [data-die='3'] {
    transform: rotate3d(0, 1, 0, 90deg) translateZ(calc(0.4 * min(16vw, 9vh)));
  }
  & [data-die='4'] {
    transform: rotate3d(0, -1, 0, 90deg) translateZ(calc(0.4 * min(16vw, 9vh)));
  }
  & [data-die='5'] {
    transform: rotate3d(1, 0, 0, 90deg) translateZ(calc(0.4 * min(16vw, 9vh)));
  }
  & [data-die='6'] {
    transform: rotate3d(1, 0, 0, 180deg) translateZ(calc(0.4 * min(16vw, 9vh)));
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

export function D6({ matrix, tilt }: { matrix: TMatrix; tilt?: boolean }): ReactElement {
  return (
    <ol css={diceCss} style={{ transform: makeMatrix3dTextFromMatrix(tilt ? tiltMatrix(matrix) : matrix) }}>
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
  )
}
