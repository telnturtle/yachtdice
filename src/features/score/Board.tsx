/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useScoreStore } from './store'
import { DiceKeep } from '../dice/DiceKeep'
import { Dices } from '../dice/Dices'
import { ScoreBoard } from './ScoreBoard'

export function Board() {
  const [nowPlayer, rounds] = useScoreStore((s) => [s.nowPlayer, s.rounds])
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
      <DiceKeep />
      <Dices key={`${nowPlayer}-${rounds}`} />
    </section>
  )
}
