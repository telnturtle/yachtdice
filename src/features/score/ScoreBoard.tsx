/** @jsxImportSource @emotion/react */
import { cx } from '@emotion/css'
import { css } from '@emotion/react'
import React, { ReactElement } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { initDices, selectDiceTopsides } from '../dice/diceSlice'
import { TCategories, TCategoriesWritable } from '../score/type'
import { computeTopsides, UNWRITABLE_CATEGORIES } from '../score/util'
import {
  PlayerMeta,
  selectDiceShaking,
  selectLeftRolls,
  selectLeftTurns,
  selectPIndex,
  selectPlayer,
  selectPlayers,
  writeScore,
} from './scoreSlice'

export function ScoreBoard(): ReactElement {
  const diceShaking = useAppSelector(selectDiceShaking)
  const leftRolls = useAppSelector(selectLeftRolls)
  const topsides = useAppSelector(selectDiceTopsides)
  const player = useAppSelector(selectPlayer)
  const players = useAppSelector(selectPlayers)
  const pIndex = useAppSelector(selectPIndex)
  const leftTurns = useAppSelector(selectLeftTurns)
  const computed = leftRolls === 3 ? undefined : computeTopsides(topsides)
  const dispatch = useAppDispatch()
  const onClick = (cat: TCategoriesWritable) => {
    console.log({ cat })
    if (UNWRITABLE_CATEGORIES.has(cat)) return
    if (player[cat] !== undefined) return
    if (computed === undefined) return
    if (diceShaking) return
    dispatch(writeScore({ cat, score: computed[cat] }))
    dispatch(initDices())
  }
  return (
    <div css={CSS.root}>
      <table css={CSS.table_abs}>
        <tbody>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx({ td_nowplayer: pIndex === 0 })}>
              {players[0].name}
            </td>
            <td css={[CSS.td, CSS.td_turns]}>Turns</td>
          </tr>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx({ td_nowplayer: pIndex === 1 })}>
              {players[1].name}
            </td>
            <td css={[CSS.td, CSS.td_turns]}>{`${Math.min(12, 12 - leftTurns + 1)}/12`}</td>
          </tr>
        </tbody>
      </table>
      <table css={CSS.table}>
        <tbody>
          <ScoreTr {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }} name="Aces" cat="aces" />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Deuces"
            cat="deuces"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Threes"
            cat="threes"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Fours"
            cat="fours"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Fives"
            cat="fives"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Sixes"
            cat="sixes"
          />
          <tr css={CSS.tr} className="subtotal">
            <th scope="row" css={[CSS.td, CSS.th]} className="non_writable">
              Subtotal
            </th>
            {players.map((p) => {
              return (
                <td css={CSS.td} className={cx({})} key={p.index}>
                  <span
                    css={css`
                      font-size: 90%;
                    `}
                  >
                    {p.subtotal}
                  </span>
                  <span
                    css={css`
                      font-size: 60%;
                    `}
                  >
                    /63
                  </span>
                </td>
              )
            })}
          </tr>
          <tr css={CSS.tr} className="subtotal">
            <th scope="row" css={[CSS.td, CSS.th]} className="non_writable">
              Bonus
            </th>
            {players.map((p) => {
              return (
                <td css={CSS.td} className={cx({})}>
                  {p.bonus}
                </td>
              )
            })}
          </tr>
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Choice"
            cat="choice"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Four of a Kind"
            cat="fourOfAKind"
            foak
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Full House"
            cat="fullHouse"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="S. Straight"
            cat="smallStraight"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="L. Straight"
            cat="largeStraight"
          />
          <ScoreTr
            {...{ onClick, player, players, pIndex, diceShaking, computed, leftRolls }}
            name="Yacht"
            cat="yacht"
          />
          <tr css={CSS.tr} className="total">
            <th scope="row" css={[CSS.td, CSS.th]} className="non_writable total">
              Total
            </th>
            {players.map((p) => {
              return <td css={CSS.td}>{p.total}</td>
            })}
          </tr>
        </tbody>
      </table>

      {/* <div css={CSS.border}>
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
      </div> */}
    </div>
  )
}

interface ScoreTrProps {
  onClick: (cat: TCategoriesWritable) => void
  player: PlayerMeta
  players: PlayerMeta[]
  pIndex: number
  diceShaking: boolean
  name: string
  computed: Record<TCategories, number> | undefined
  cat: TCategoriesWritable
  leftRolls: number
  foak?: boolean
}

function ScoreTr({
  onClick,
  player,
  players,
  pIndex,
  diceShaking,
  name,
  computed,
  cat,
  leftRolls,
  foak,
}: ScoreTrProps): ReactElement {
  return (
    <tr css={CSS.tr} onClick={() => onClick(cat)} className={cx({})}>
      <th
        scope="row"
        css={[CSS.td, CSS.th]}
        className={cx({
          writable_now: player[cat] === undefined && computed?.[cat] !== undefined && !diceShaking,
          foak: foak,
        })}
      >
        {name}
      </th>
      {players.map((p) => {
        return (
          <td
            css={CSS.td}
            className={cx({
              td_nowplayer: pIndex === p.index,
              td_auto: p[cat] === undefined,
              writable_now: pIndex !== p.index && player[cat] === undefined && leftRolls !== 3 && !diceShaking,
              td_writed: p[cat] !== undefined,
            })}
          >
            {p[cat] !== undefined ? p[cat] : pIndex === p.index && !diceShaking ? computed?.[cat] : undefined}
          </td>
        )
      })}
    </tr>
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

const CSS = {
  root: css`
    margin-top: auto;
    margin-bottom: auto;
    width: calc(min(16vw, 9vh) * 7);
  `,
  table_abs: css`
    border-collapse: collapse;
    position: absolute;
    top: calc(min(16vw, 9vh) * 0.25);
  `,
  table: css`
    border-collapse: collapse;
  `,
  tr: css`
    height: calc(min(16vw, 9vh) * 0.55);
    font-size: calc(min(16vw, 9vh) * 0.35);
    &.subtotal {
      height: calc(min(16vw, 9vh) * 0.45);
      /* background-color: rgba(0, 102, 231, 10%); */
    }
    &.total {
      height: calc(min(16vw, 9vh) * 0.65);
      /* background-color: rgba(0, 102, 231, 23%); */
    }
    &.writable_now {
      animation: 4s ease-in-out emphasize-writable infinite;
    }
    @keyframes emphasize-writable {
      from {
        background-color: none;
      }
      50% {
        background-color: rgba(212, 7, 15, 15%);
      }
      to {
        background-color: none;
      }
    }
  `,
  th: css`
    text-align: right;
    padding: 0px calc(min(16vw, 9vh) * 0.1);
    width: calc(min(16vw, 9vh) * 2.25);
    width: calc(min(16vw, 9vh) * 2.125);
    white-space: nowrap;
    font-weight: 600;
    &.non_writable {
      font-weight: 300;
    }
    &.writable_now {
      animation: 4s ease-in-out emphasize-writable infinite;
    }
    @keyframes emphasize-writable {
      from {
        background-color: none;
      }
      50% {
        background-color: rgba(212, 7, 15, 15%);
      }
      to {
        background-color: none;
      }
    }
    &.foak {
      letter-spacing: calc(min(16vw, 9vh) * -0.02);
      word-spacing: calc(min(16vw, 9vh) * -0.04);
      font-size: calc(min(16vw, 9vh) * 0.32);
    }
  `,
  td: css`
    border: 1px solid #000;
    width: calc(min(16vw, 9vh) * 0.5);
    text-align: center;
    font-weight: 200;
    box-sizing: border-box;
    &.td_nowplayer {
      font-weight: 700;
      background: rgba(212, 7, 15, 0.15);
    }
    &.td_auto {
      font-weight: 100;
      color: rgba(0, 0, 0, 0.6);
    }
    &.td_notext {
      visibility: hidden;
    }
    &.total {
      /* background-color: rgba(0, 102, 231, 25%); */
    }
    &.writable_now {
      animation: 4s ease-in-out emphasize-writable infinite;
    }
    @keyframes emphasize-writable {
      from {
        background-color: none;
      }
      50% {
        background-color: rgba(212, 7, 15, 15%);
      }
      to {
        background-color: none;
      }
    }
    &.td_writed.td_writed {
      font-weight: 700;
    }
  `,
  td_turns: css`
    font-weight: 400;
    white-space: nowrap;
    padding: 0px calc(min(16vw, 9vh) * 0.1);
  `,

  border: css`
    border-radius: 7px;
    border: 2px solid brown;
    display: flex;
    flex-flow: row wrap;
    padding: 3px;
    line-height: 1.2;
  `,
  ScoreItem: css`
    margin: 0 0 0px 0;
    width: calc(100% - 5px);
    display: flex;
    flex-flow: row wrap;
  `,
}
