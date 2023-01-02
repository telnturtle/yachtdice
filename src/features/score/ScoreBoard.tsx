/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import React, { ReactElement } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectDices, selectDiceTopsides } from '../dice/diceSlice'
import { PlayerScore, ScoreState, useScoreStore } from '../score/store'
import { TCategories, TCategoriesWritable } from '../score/type'
import { computeTopsides, isNumber, UNWRITABLE_CATEGORIES } from '../score/util'
import {
  PlayerMeta,
  selectDiceShaking,
  selectLeftRolls,
  selectPIndex,
  selectPlayer,
  selectPlayers,
  writeScore,
} from './scoreSlice'

export interface ScoreBoardProps {}

export function ScoreBoard({}: ScoreBoardProps): ReactElement {
  const diceShaking = useAppSelector(selectDiceShaking)
  const leftRolls = useAppSelector(selectLeftRolls)
  const topsides = useAppSelector(selectDiceTopsides)
  const player = useAppSelector(selectPlayer)
  const players = useAppSelector(selectPlayers)
  const pIndex = useAppSelector(selectPIndex)
  const computed = leftRolls === 3 ? undefined : computeTopsides(topsides)
  const onClick: ScoreItemProps['onClick'] = (e) => {
    const cat = e.currentTarget.dataset.scoreName as TCategoriesWritable
    console.log({ cat })
    if (UNWRITABLE_CATEGORIES.has(cat)) return
    if (player[cat] !== undefined) return
    if (computed === undefined) return
    writeScore({ cat, score: computed[cat] })
  }
  const commonProps = { players, pIndex, onClick, computed, diceShaking }
  return (
    <div css={CSS.root}>
      <div css={CSS.border}>
        <ScoreItem {...commonProps} label="Aces" name={'aces'} />
        <ScoreItem {...commonProps} label="Deuces" name={'deuces'} />
        <ScoreItem {...commonProps} label="Threes" name={'threes'} />
        <ScoreItem {...commonProps} label="Fours" name={'fours'} />
        <ScoreItem {...commonProps} label="Fives" name={'fives'} />
        <ScoreItem {...commonProps} label="Sixes" name={'sixes'} />
        <ScoreItem {...commonProps} onClick={undefined} label="Subtotal" name={'subtotal'} />
        <ScoreItem {...commonProps} onClick={undefined} label="Bonus" name={'bonus'} />
        <ScoreItem {...commonProps} label="Choice" name={'choice'} />
        <ScoreItem {...commonProps} label="Four of a Kind" name={'fourOfAKind'} />
        <ScoreItem {...commonProps} label="Full House" name={'fullHouse'} />
        <ScoreItem {...commonProps} label="S. Straight" name={'smallStraight'} />
        <ScoreItem {...commonProps} label="L. Straight" name={'largeStraight'} />
        <ScoreItem {...commonProps} label="Yacht" name={'yacht'} />
        <ScoreItem {...commonProps} onClick={undefined} label="Total" name={'total'} />
      </div>
    </div>
  )
}

export interface ScoreItemProps {
  players: PlayerMeta[]
  label: string
  name: TCategories
  pIndex: number
  onClick?: React.MouseEventHandler<HTMLDivElement>
  computed?: Record<TCategories, number>
  diceShaking: boolean
}

function ScoreItem({ players, label, name, pIndex, onClick, computed, diceShaking }: ScoreItemProps): ReactElement {
  const writable =
    players[pIndex][name] !== undefined &&
    computed?.[name] !== undefined &&
    !diceShaking &&
    !UNWRITABLE_CATEGORIES.has(name)
  return (
    <div css={CSS.ScoreItem} className={cx({ writable })} data-score-name={name} onClick={onClick}>
      <div css={CSS.cell}>{label}</div>
      {players.map((playerMeta: PlayerMeta) => {
        const width = `calc(100% / ${players.length || 1})`
        const scoreWrited: number | undefined = players[pIndex][name]
        const scoreComputed: number | undefined = writable && playerMeta.index === pIndex ? computed?.[name] : undefined
        const scoreTextNumber: number = scoreWrited === undefined ? scoreComputed ?? 0 : scoreWrited
        const visibility = scoreWrited === undefined && scoreComputed === undefined ? 'hidden' : 'visible'
        const [opacity, fontWeight] =
          scoreWrited === undefined && scoreComputed !== undefined ? [0.5, 400] : [1, undefined]
        return (
          <div css={CSS.cell} className={cx({ noleftborder: playerMeta !== players[0] })} key={name} style={{ width }}>
            <span style={{ visibility, opacity, fontWeight }}>{scoreTextNumber}</span>
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
