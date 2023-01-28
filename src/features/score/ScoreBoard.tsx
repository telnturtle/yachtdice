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
    // 선택불가카테고리가 아닐 시 그리고
    // 이미 선택된 카테고리가 아닐 시 그리고
    // 한번도 안굴렸지 않았을 시 그리고
    // 굴리는 중이 아닐 시
    // 선택된 점수 작성 (플레이어 턴 넘어감) 및 주사위 초기화

    console.log({ cat })
    if (UNWRITABLE_CATEGORIES.has(cat)) return
    if (player[cat] !== undefined) return
    if (computed === undefined) return
    if (diceShaking) return
    dispatch(writeScore({ cat, score: computed[cat] }))
    dispatch(initDices())
  }

  const scoreTrProps = { onClick, player, players, pIndex, diceShaking, computed, leftRolls }

  return (
    <div css={CSS.root}>
      <table css={CSS.table_abs}>
        <tbody>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx('td_player_name', { td_nowplayer: pIndex === 0 })}>
              {players[0].name}
            </td>
            <td css={[CSS.td, CSS.td_turns]}>Turns</td>
          </tr>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx('td_player_name', { td_nowplayer: pIndex === 1 })}>
              {players[1].name}
            </td>
            <td css={[CSS.td, CSS.td_turns]}>{`${Math.min(12, 12 - leftTurns + 1)}/12`}</td>
          </tr>
        </tbody>
      </table>
      <table css={CSS.table}>
        <tbody>
          <ScoreTr {...scoreTrProps} name="Aces" cat="aces" />
          <ScoreTr {...scoreTrProps} name="Deuces" cat="deuces" />
          <ScoreTr {...scoreTrProps} name="Threes" cat="threes" />
          <ScoreTr {...scoreTrProps} name="Fours" cat="fours" />
          <ScoreTr {...scoreTrProps} name="Fives" cat="fives" />
          <ScoreTr {...scoreTrProps} name="Sixes" cat="sixes" />
          <tr css={CSS.tr} className="subtotal">
            <th scope="row" css={[CSS.td, CSS.th]} className="non_writable">
              Subtotal
            </th>
            {players.map((p) => {
              return (
                <td css={CSS.td} className={cx({})} key={p.index}>
                  <span css={CSS.subtotal_1}>{p.subtotal}</span>
                  <span css={CSS.subtotal_2}>/63</span>
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
          <ScoreTr {...scoreTrProps} name="Choice" cat="choice" />
          <ScoreTr {...scoreTrProps} name="Four of a Kind" cat="fourOfAKind" foak />
          <ScoreTr {...scoreTrProps} name="Full House" cat="fullHouse" />
          <ScoreTr {...scoreTrProps} name="S. Straight" cat="smallStraight" />
          <ScoreTr {...scoreTrProps} name="L. Straight" cat="largeStraight" />
          <ScoreTr {...scoreTrProps} name="Yacht" cat="yacht" />
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
    <tr
      css={CSS.tr}
      onClick={() => onClick(cat)}
      className={cx({ writable_now: player[cat] === undefined && computed?.[cat] !== undefined && !diceShaking })}
    >
      <th
        scope="row"
        css={[CSS.td, CSS.th]}
        className={cx({
          foak: foak,
        })}
      >
        {name}
      </th>
      {players.map((p) => {
        const text = p[cat] !== undefined ? p[cat] : pIndex === p.index && !diceShaking ? computed?.[cat] : undefined
        return (
          <td
            css={[CSS.td, CSS.td_score]}
            className={cx({
              td_nowplayer: pIndex === p.index,
              td_auto: p[cat] === undefined,
              td_writed: p[cat] !== undefined,
            })}
          >
            <span className={cx({ score: p[cat] !== undefined })}>{text}</span>
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
    padding-top: calc(min(16vw, 9vh) * 1.125);
  `,
  table_abs: css`
    border-collapse: collapse;
    position: absolute;
    top: calc(min(16vw, 9vh) * 0.25);
  `,
  table: css`
    border-collapse: collapse;
    max-width: calc(min(16vw, 9vh) * 6.225);
  `,
  tr: css`
    height: calc(min(16vw, 9vh) * 0.625);
    font-size: calc(min(16vw, 9vh) * 0.375);
    &.subtotal {
      height: calc(min(16vw, 9vh) * 0.45);
      /* background-color: rgba(0, 102, 231, 10%); */
    }
    &.total {
      height: calc(min(16vw, 9vh) * 0.65);
      /* background-color: rgba(0, 102, 231, 23%); */
    }
    &.writable_now {
      animation: 1.5s ease-in emphasize-writable infinite alternate;
    }
    @keyframes emphasize-writable {
      from {
        background-color: rgba(212, 7, 15, 15%);
      }
      to {
        background-color: rgba(212, 7, 15, 5%);
      }
    }
    & .td_auto {
      animation: 1.5s ease-in emphasize-writable-td_auto infinite alternate;
    }
    @keyframes emphasize-writable-td_auto {
      from {
        color: rgba(0, 0, 0, 0.6);
      }
      to {
        color: rgba(0, 0, 0, 0.1);
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
    &.foak {
      letter-spacing: calc(min(16vw, 9vh) * -0.01);
      word-spacing: calc(min(16vw, 9vh) * -0.02);
      font-size: calc(min(16vw, 9vh) * 0.32);
    }
  `,
  td: css`
    border: 1px solid #000;
    width: calc(min(16vw, 9vh) * 0.65);
    text-align: center;
    font-weight: 200;
    box-sizing: border-box;
    &.td_nowplayer {
      font-weight: 700;
      background: rgba(212, 7, 15, 0.15);
    }
    &.td_auto {
      font-weight: 100;
      /* color: rgba(0, 0, 0, 0.6); */
    }
    &.td_notext {
      visibility: hidden;
    }
    &.total {
      /* background-color: rgba(0, 102, 231, 25%); */
    }
    &.td_writed.td_writed {
      font-weight: 700;
    }
    &.td_player_name {
      font-weight: 200;
    }
    &.td_nowplayer.td_player_name {
      font-weight: 800;
      background: rgba(212, 7, 15, 0.15);
    }
    & .score {
      display: inline-block;
      animation: 0.1s ease-in fill_score_out;
      @keyframes fill_score_out {
        from {
          transform: scale(5);
          opacity: 0.25;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    }
  `,
  td_score: css`
    max-width: calc(min(16vw, 9vh) * 0.65);
  `,
  td_turns: css`
    font-weight: 200;
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
  subtotal_1: css`
    font-size: 90%;
  `,
  subtotal_2: css`
    font-size: 60%;
  `,
}
