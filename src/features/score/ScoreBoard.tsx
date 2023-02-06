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

  const turnsTd = (
    <td css={[CSS.td, CSS.td_turns]} className="td_player_name td_nowplayer">{`Turns: ${Math.min(
      12,
      12 - leftTurns + 1
    )}/12`}</td>
  )

  return (
    <div css={CSS.root}>
      <table css={CSS.table_abs}>
        <tbody>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx('td_player_name', { td_nowplayer: pIndex === 0 })}>
              {players[0].name}
            </td>
            {pIndex === 0 ? turnsTd : null}
          </tr>
          <tr css={CSS.tr}>
            <td css={[CSS.td, CSS.th]} className={cx('td_player_name', { td_nowplayer: pIndex === 1 })}>
              {players[1].name}
            </td>
            {pIndex === 1 ? turnsTd : null}
          </tr>
        </tbody>
      </table>
      <table css={CSS.table}>
        <tbody>
          <ScoreTr {...scoreTrProps} name="Ones" cat="aces" />
          <ScoreTr {...scoreTrProps} name="Twos" cat="deuces" />
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
                <td css={CSS.td} className={cx({ td_writed: !!p.bonus })}>
                  {p.bonus}
                </td>
              )
            })}
          </tr>
          <ScoreTr {...scoreTrProps} name="Choice" cat="choice" />
          <ScoreTr
            {...scoreTrProps}
            name={
              <>
                4<span css={CSS.smallCategory}>{' of a '}</span>Kind
              </>
            }
            cat="fourOfAKind"
          />
          <ScoreTr {...scoreTrProps} name="Full House" cat="fullHouse" fh />
          <ScoreTr {...scoreTrProps} name="S. Straight" cat="smallStraight" foak />
          <ScoreTr {...scoreTrProps} name="L. Straight" cat="largeStraight" foak />
          <ScoreTr {...scoreTrProps} name="Yacht" cat="yacht" />
          <tr css={CSS.tr} className="total">
            <th scope="row" css={[CSS.td, CSS.th]} className="non_writable">
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
  name: string | ReactElement
  computed: Record<TCategories, number> | undefined
  cat: TCategoriesWritable
  leftRolls: number
  foak?: boolean
  fh?: boolean
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
  fh,
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
          foak,
          fh,
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
    width: 7rem;
    padding-top: 1.125rem;
  `,
  table_abs: css`
    border-collapse: collapse;
    position: absolute;
    top: 0.2rem;
    left: 0.1rem;
  `,
  table: css`
    border-collapse: collapse;
    max-width: 6.225rem;
    margin-left: 0.1rem;
    margin-top: 0.3rem;
  `,
  tr: css`
    height: 0.64rem;
    font-size: 0.375rem;
    &.subtotal {
      height: 0.45rem;
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
        color: rgba(64, 64, 64, 0.6);
      }
      to {
        color: rgba(64, 64, 64, 0.3);
      }
    }
  `,
  th: css`
    text-align: right;
    padding: 0 0.1rem;
    width: 2rem;
    white-space: nowrap;
    font-weight: 600;
    &.non_writable {
      font-weight: 300;
    }
    &.foak {
      letter-spacing: -0.01rem;
      word-spacing: -0.02rem;
      font-size: 95%;
    }
    &.fh {
      word-spacing: -0.04rem;
      font-size: 95%;
    }
  `,
  td: css`
    border: 1px solid #000;
    width: 0.65rem;
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
    &.td_writed.td_writed {
      font-weight: 700;
    }
    &.td_player_name {
      font-weight: 200;
    }
    &.td_nowplayer.td_player_name {
      font-weight: 800;
      /* background: rgba(212, 7, 15, 0.15); */
      background: none;
      color: hsla(358, 94%, 30%, 0.85);
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
    max-width: 0.65rem;
  `,
  td_turns: css`
    font-weight: 200;
    white-space: nowrap;
    padding: 0px 0.1rem;
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
    font-size: 85%;
  `,
  subtotal_2: css`
    font-size: 60%;
  `,
  smallCategory: css`
    font-size: 70%;
  `,
}
