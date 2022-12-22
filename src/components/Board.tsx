/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useScoreStore } from '../modules/score/store'
import { DiceKeep } from './DiceKeep'
import { Dices } from './Dices'
import { ScoreBoard } from './ScoreBoard'

export function Board() {
  const [nowPlayer, rounds] = useScoreStore((s) => [s.nowPlayer, s.rounds])
  return (
    <section
      css={css`
        margin: auto 0 auto 0;
        width: 100vmin;
        height: 100%;
        position: absolute;
        display: flex;
        overflow: hidden;
      `}
    >
      <ScoreBoard />
      <DiceKeep />
      <Dices key={`${nowPlayer}-${rounds}`} />
    </section>
  )
}
