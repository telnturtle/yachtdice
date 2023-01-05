/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import { ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { initDices } from '../dice/diceSlice'
import { initScore, selectLeftTurns, selectPlayers } from '../score/scoreSlice'

export function RegameButton(): ReactElement {
  const players = useAppSelector(selectPlayers)
  const leftTurns = useAppSelector(selectLeftTurns)
  const dispatch = useAppDispatch()

  const onClick = () => {
    dispatch(initDices())
    dispatch(initScore())
  }

  const text =
    players[0].total === players[1].total
      ? 'Draw!'
      : `${players[players[0].total > players[1].total ? 0 : 1].name} is the winner!`

  return (
    <>
      <div css={backdropCss} className={cx({ invisible: leftTurns > 0 })}>
        <div css={announceCss}>{text}</div>
      </div>
      <button css={buttonCss} onClick={onClick} className={cx({ invisible: leftTurns > 0 })}>
        Regame?
      </button>
    </>
  )
}

const backdropCss = css`
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 13;
  &.invisible {
    visibility: hidden;
  }
  &:not(.invisible) {
    animation: slidein 1s;
  }
  @keyframes slidein {
    from {
      transform: translateX(-100%);
    }
    to {
      /* transform: translateX(0); */
    }
  }
`

const announceCss = css`
  font-size: calc(0.5 * min(16vw, 9vh));
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-family: 'Arial Black', Gadget, sans-serif;
  text-align: center;
`

const buttonCss = css`
  margin: calc(0.25 * min(16vw, 9vh));
  font-family: 'Arial Black', Gadget, sans-serif;
  font-size: calc(0.5 * min(16vw, 9vh));
  padding: calc(0.375 * min(16vw, 9vh));
  text-align: center;
  text-transform: uppercase;
  transition: 0.5s;
  background-size: 200% auto;
  color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 calc(0.25 * min(16vw, 9vh)) #eee;
  width: calc(5 * min(16vw, 9vh));
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  cursor: pointer;
  display: inline-block;
  border-radius: calc(0.3 * min(16vw, 9vh));
  position: absolute;
  top: calc(0.25 * min(16vw, 9vh));
  right: calc(0.25 * min(16vw, 9vh));
  background-image: linear-gradient(to right, #dd5e89 0%, #f7bb97 51%, #dd5e89 100%);
  :hover {
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.19), 0 6px 6px rgba(0, 0, 0, 0.23);
    background-position: right center;
  }
  z-index: 15;
  border: none;
  &.invisible {
    visibility: hidden;
  }
`
