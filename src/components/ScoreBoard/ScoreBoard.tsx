import React, { ReactElement } from 'react'
import { PlayerScore, ScoreState, useScoreStore } from '../../modules/score/store'
import { TCategories } from '../../modules/score/type'
import { computeFromDieSequence, isNumber, UNWRITABLE_CATEGORIES } from '../../modules/score/util'
import styles from './ScoreBoard.module.css'

export interface ScoreBoardProps {}

function ScoreBoard({}: ScoreBoardProps): ReactElement {
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
    <div className={styles.root}>
      <div className={styles.border}>
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

export default ScoreBoard

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
  const className_ScoreItem = styles.ScoreItem + (writable ? ` ${styles.writable}` : '')
  return (
    <div className={className_ScoreItem} data-score-name={scoreName} onClick={onClick}>
      <div className={styles.cell}>{name}</div>
      {players.map((id) => {
        const ps = playerScores.get(id) as PlayerScore
        const width = `calc(100% / ${players.length || 1})`
        const scoreWrited: number | undefined = ps[scoreName]
        const scoreComputed: number | undefined = writable && id === nowPlayer ? computed?.[scoreName] : undefined
        const scoreOnView: number = scoreWrited === undefined ? scoreComputed ?? 0 : scoreWrited
        const visibility = scoreWrited === undefined && scoreComputed === undefined ? 'hidden' : 'visible'
        const className_cell = styles.cell + (id !== players[0] ? ` ${styles.noleftborder}` : '')
        const [opacity, fontWeight] =
          scoreWrited === undefined && scoreComputed !== undefined ? [0.5, 400] : [1, undefined]
        if (scoreName === 'fullHouse') console.log({ scoreWrited, scoreComputed, scoreOnView })
        return (
          <div className={className_cell} key={ps.id} style={{ width }}>
            <span style={{ visibility, opacity, fontWeight }}>{scoreOnView}</span>
          </div>
        )
      })}
    </div>
  )
}
