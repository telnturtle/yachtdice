/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { DiceKeep } from '../dice/DiceKeep'
import { Dices } from '../dice/Dices'
import { ScoreBoard } from './ScoreBoard'
import { Message } from '../message/Message'
import { GameStatus } from '../game/GameStatus'
import { RegameButton } from '../game/RegameButton'

export function Board() {
  return (
    <section
      css={css`
        margin: auto 0 auto 0;
        width: 100vmin;
        height: 100%;
        display: flex;
        overflow: hidden;
      `}
    >
      <ScoreBoard />
      <Message />
      <GameStatus />
      <RegameButton />
      <DiceKeep />
      <Dices />
      {/* <Dices key={`${nowPlayer}-${rounds}`} /> */}
    </section>
  )
}
