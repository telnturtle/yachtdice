/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { cx } from '@emotion/css'
import { ReactElement } from 'react'
import { TMatrix } from './type'
import { makeMatrix3dTextFromMatrix, tiltMatrix } from './util'
import { selectDiceById, toggleKeep } from './diceSlice'
import { ZFour } from '../../common/type'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { selectDiceShaking, selectLeftRolls } from '../score/scoreSlice'

interface DiceProps {
  id: ZFour
  nocolor?: boolean
}

/**
 * 주사위 1개를 나타낸다. 게임에서 사용하기 위해 래핑된 D6이다.
 */
export function Dice({ id, nocolor = false }: DiceProps): ReactElement {
  const dice = useAppSelector(selectDiceById[id])
  const leftRolls = useAppSelector(selectLeftRolls)
  const dispatch = useAppDispatch()
  const diceShaking = useAppSelector(selectDiceShaking)

  /**
   * do not memoize this (low efficiency)
   *
   * 게임 중 주사위를 터치했을 때 keep을 토글한다.
   *
   * redux dispatch를 상위 컴포넌트 보다 여기에서 할 수 있어서 하위로 내렸다.
   * */
  const onClick = () => {
    if (!diceShaking && leftRolls !== 3) dispatch(toggleKeep(id))
  }

  return (
    <div
      css={diceWrapCss}
      className={cx({ [`order_${dice.order}`]: !dice.keep, [`keep_${dice.keepOrder}`]: dice.keep })}
      onClick={onClick}
    >
      <D6 id={id} matrix={dice.matrix} tilt={dice.tilt} />
    </div>
  )
}

const diceWrapCss = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 0.8rem;
  width: 0.8rem;
  transition: transform 0.25s ease-in-out, top 0.2s ease-in-out, right 0.2s ease-in-out, margin-top 0.2s ease-in-out;
  position: absolute;
  right: 0.4rem;
  &.order_0 {
    top: calc((1 * 1.125 + 0.5) * 1rem);
  }
  &.order_1 {
    top: calc((2 * 1.125 + 0.5) * 1rem);
  }
  &.order_2 {
    top: calc((3 * 1.125 + 0.5) * 1rem);
  }
  &.order_3 {
    top: calc((4 * 1.125 + 0.5) * 1rem);
  }
  &.order_4 {
    top: calc((5 * 1.125 + 0.5) * 1rem);
  }
  &.keep_0 {
    right: 1.575rem;
    top: calc((1 * 1.125 + 0.5) * 1rem);
  }
  &.keep_1 {
    right: 1.575rem;
    top: calc((2 * 1.125 + 0.5) * 1rem);
  }
  &.keep_2 {
    right: 1.575rem;
    top: calc((3 * 1.125 + 0.5) * 1rem);
  }
  &.keep_3 {
    right: 1.575rem;
    top: calc((4 * 1.125 + 0.5) * 1rem);
  }
  &.keep_4 {
    right: 1.575rem;
    top: calc((5 * 1.125 + 0.5) * 1rem);
  }
`

const diceCss = css`
  display: grid;
  grid-template-columns: 1fr;
  height: 100%;
  width: 100%;
  list-style-type: none;
  transform-style: preserve-3d;
  transition: transform 0.15s ease-in-out;
  margin-inline-start: 0;
  padding-inline-start: 0;
  margin-block-start: 0;
  margin-block-end: 0;
  & .dot {
    align-self: center;
    background-color: #555;
    border-radius: 50%;
    box-shadow: inset -0.03rem 0.03rem 0.05rem rgba(0, 0, 0, 0.5);
    display: block;
    width: 150%;
    height: 150%;
    justify-self: center;
  }
  &[data-id='0'] .dot {
    background-color: #756262;
  }
  &[data-id='1'] .dot {
    background-color: #757462;
  }
  &[data-id='2'] .dot {
    background-color: #627562;
  }
  &[data-id='3'] .dot {
    background-color: #627275;
  }
  &[data-id='4'] .dot {
    background-color: #646275;
  }
  & [data-die='1'] {
    transform: rotate3d(0, 0, 0, 90deg) translateZ(0.4rem);
  }
  & [data-die='2'] {
    transform: rotate3d(-1, 0, 0, 90deg) translateZ(0.4rem);
  }
  & [data-die='3'] {
    transform: rotate3d(0, 1, 0, 90deg) translateZ(0.4rem);
  }
  & [data-die='4'] {
    transform: rotate3d(0, -1, 0, 90deg) translateZ(0.4rem);
  }
  & [data-die='5'] {
    transform: rotate3d(1, 0, 0, 90deg) translateZ(0.4rem);
  }
  & [data-die='6'] {
    transform: rotate3d(1, 0, 0, 180deg) translateZ(0.4rem);
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
  box-shadow: inset -0.07rem 0.07rem 0.15rem rgba(0, 0, 0, 0.2), inset 0.1rem -0.05rem 0.1rem rgba(0, 0, 0, 0.2);
  border-radius: 10%;
  display: grid;
  grid-column: 1;
  grid-row: 1;
  grid-template-areas:
    'one two three'
    'four five six'
    'seven eight nine';
  grid-template-columns: 20% 20% 20%;
  grid-template-rows: 20% 20% 20%;
  justify-content: space-between;
  align-content: space-between;
  padding: calc(100% / 6);
  height: 100%;
  width: 100%;
  background: rgb(209, 209, 209);
  box-sizing: border-box;
  &[data-id='0'] {
    background: rgb(206, 188, 188);
  }
  &[data-id='1'] {
    background: rgb(198, 198, 182);
  }
  &[data-id='2'] {
    background: rgb(196, 212, 193);
  }
  &[data-id='3'] {
    background: rgb(186, 198, 204);
  }
  &[data-id='4'] {
    background: rgb(195, 195, 209);
  }
`

/** ⚀ ⚁ ⚂ ⚃ ⚄ ⚅ 3D로 이루어진 주사위 1개를 나타낸다. */
export function D6({ id, matrix, tilt }: { id?: ZFour, matrix: TMatrix; tilt?: boolean }): ReactElement {
  return (
    <ol css={diceCss} {...id !== undefined ? { 'data-id': id } : null} style={{ transform: makeMatrix3dTextFromMatrix(tilt ? tiltMatrix(matrix) : matrix) }}>
      <li css={dieCss} data-die="1" {...id !== undefined ? { 'data-id': id } : null}>
        <span className="dot" />
      </li>
      <li css={dieCss} data-die="2" {...id !== undefined ? { 'data-id': id } : null}>
        <span className="dot" />
        <span className="dot" />
      </li>
      <li css={dieCss} data-die="3" {...id !== undefined ? { 'data-id': id } : null}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </li>
      <li css={dieCss} data-die="4" {...id !== undefined ? { 'data-id': id } : null}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </li>
      <li css={dieCss} data-die="5" {...id !== undefined ? { 'data-id': id } : null}>
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
        <span className="dot" />
      </li>
      <li css={dieCss} data-die="6" {...id !== undefined ? { 'data-id': id } : null}>
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
