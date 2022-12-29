/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import React, { ReactElement } from 'react'
import { PlayerScore, ScoreState, useScoreStore } from '../score/store'
import { TCategories } from '../score/type'
import { computeFromDieSequence, isNumber, UNWRITABLE_CATEGORIES } from '../score/util'

export interface ScoreBoardProps {}

export function ScoreBoard({}: ScoreBoardProps): ReactElement {
  const [players, nowPlayer, rounds, playerScores, dices, writeScore, diceTouchDisabled, endRound] = useScoreStore(
    (s) => [s.players, s.nowPlayer, s.rounds, s.playerScores, s.dices, s.writeScore, s.diceTouchDisabled, s.endRound]
  )
  const computed = dices ? computeFromDieSequence(dices) : undefined
  const onClick: ScoreItemProps['onClick'] = (e) => {
    const cat = e.currentTarget.dataset.scoreName as TCategories
    console.log({ cat })
    if (UNWRITABLE_CATEGORIES.has(cat)) return
    if (isNumber((playerScores.get(nowPlayer) as PlayerScore)[cat])) return
    writeScore(cat)
    endRound()
  }
  const commonProps = { players, playerScores, nowPlayer, onClick, computed, diceTouchDisabled }
  return (
    <div css={CSS.root}>
      <div css={CSS.border}>
        <ScoreItem {...commonProps} name="Aces" scoreName={'aces'} />
        <ScoreItem {...commonProps} name="Deuces" scoreName={'deuces'} />
        <ScoreItem {...commonProps} name="Threes" scoreName={'threes'} />
        <ScoreItem {...commonProps} name="Fours" scoreName={'fours'} />
        <ScoreItem {...commonProps} name="Fives" scoreName={'fives'} />
        <ScoreItem {...commonProps} name="Sixes" scoreName={'sixes'} />
        <ScoreItem {...commonProps} name="Subtotal" scoreName={'subtotal'} />
        {/* <Bonus /> */}
        <ScoreItem {...commonProps} name="Bonus" scoreName={'bonus'} />
        <ScoreItem {...commonProps} name="Choice" scoreName={'choice'} />
        <ScoreItem {...commonProps} name="Four of a Kind" scoreName={'fourOfAKind'} />
        <ScoreItem {...commonProps} name="Full House" scoreName={'fullHouse'} />
        <ScoreItem {...commonProps} name="S. Straight" scoreName={'smallStraight'} />
        <ScoreItem {...commonProps} name="L. Straight" scoreName={'largeStraight'} />
        <ScoreItem {...commonProps} name="Yacht" scoreName={'yacht'} />
        <ScoreItem {...commonProps} name="Total" scoreName={'total'} />
      </div>
    </div>
  )
}

export interface ScoreItemProps {
  players: ScoreState['players']
  name: string
  playerScores: ScoreState['playerScores']
  scoreName: TCategories /* keyof PlayerScore */
  nowPlayer: ScoreState['nowPlayer']
  onClick?: React.MouseEventHandler<HTMLDivElement>
  computed?: Record<TCategories, number>
  diceTouchDisabled: boolean
}

function ScoreItem({
  players,
  name,
  playerScores,
  scoreName,
  nowPlayer,
  onClick,
  computed,
  diceTouchDisabled,
}: ScoreItemProps): ReactElement {
  const writable =
    (playerScores.get(nowPlayer) as PlayerScore)[scoreName] === undefined &&
    computed?.[scoreName] !== undefined &&
    !diceTouchDisabled &&
    !UNWRITABLE_CATEGORIES.has(scoreName)
  return (
    <div css={CSS.ScoreItem} className={cx({ writable })} data-score-name={scoreName} onClick={onClick}>
      <div css={CSS.cell}>{name}</div>
      {players.map((id) => {
        const ps = playerScores.get(id) as PlayerScore
        const width = `calc(100% / ${players.length || 1})`
        const scoreWrited: number | undefined = ps[scoreName]
        const scoreComputed: number | undefined = writable && id === nowPlayer ? computed?.[scoreName] : undefined
        const scoreOnView: number = scoreWrited === undefined ? scoreComputed ?? 0 : scoreWrited
        const visibility = scoreWrited === undefined && scoreComputed === undefined ? 'hidden' : 'visible'
        const [opacity, fontWeight] =
          scoreWrited === undefined && scoreComputed !== undefined ? [0.5, 400] : [1, undefined]
        if (scoreName === 'fullHouse') console.log({ scoreWrited, scoreComputed, scoreOnView })
        return (
          <div css={CSS.cell} className={cx({ noleftborder: id !== players[0] })} key={ps.id} style={{ width }}>
            <span style={{ visibility, opacity, fontWeight }}>{scoreOnView}</span>
          </div>
        )
      })}
    </div>
  )
}

const CSS = {
  root: css`
    width: 35vmin;
    margin-top: auto;
    margin-bottom: auto;
  `,
  border: css`
    border-radius: 7px;
    border: 2px solid brown;
    display: flex;
    flex-flow: row wrap;
    padding: 3px;
    line-height: 1.2;
  `,

  cell: css`
    border: 1px solid #000;
    width: 100%;
    padding: 0 2px 0 0;
    font-weight: 700;
    text-align: center;
    box-sizing: border-box;
    &:first-child {
      border-bottom: none;
      margin-top: 1px;
    }
    &.noleftborder {
      border-left: none;
    }
  `,
  ScoreItem: css`
    margin: 0 0 0px 0;
    width: calc(100% - 5px);
    display: flex;
    flex-flow: row wrap;
    &.writable {
      animation: 1.5s ease-in-out emphasize-writable infinite;
    }
    @keyframes emphasize-writable {
      from {
        background-color: rgba(0, 102, 231, 10%);
      }
      50% {
        background-color: rgba(212, 7, 15, 10%);
      }
      to {
        background-color: rgba(0, 102, 231, 10%);
      }
    }
  `,
}
