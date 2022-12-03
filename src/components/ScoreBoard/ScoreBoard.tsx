import { ReactElement } from 'react';
import { PlayerScore, ScoreState, useScoreStore } from '../../modules/score/store';
import styles from './ScoreBoard.module.css';

export interface ScoreBoardProps {}

function ScoreBoard({}: ScoreBoardProps): ReactElement {
  const [players, nowPlayer, rounds, playerScores] = useScoreStore((s) => [
    s.players,
    s.nowPlayer,
    s.rounds,
    s.playerScores,
  ]);
  return (
    <div className={styles.root}>
      <div className={styles.border}>
        <ScoreItem players={players} name="Aces" pss={playerScores} />
        <ScoreItem players={players} name="Deuces" scores={[0]} />
        <ScoreItem players={players} name="Threes" scores={[0]} />
        <ScoreItem players={players} name="Fours" scores={[0]} />
        <ScoreItem players={players} name="Fives" scores={[0]} />
        <ScoreItem players={players} name="Sixes" scores={[0]} />
        <ScoreItem players={players} name="Subtotal" scores={[0]} />
        <ScoreItem players={players} name="Choice" scores={[0]} />
        <ScoreItem players={players} name="Four of a Kind" scores={[0]} />
        <ScoreItem players={players} name="Full House" scores={[0]} />
        <ScoreItem players={players} name="S. Straight" scores={[0]} />
        <ScoreItem players={players} name="L. Straight" scores={[0]} />
        <ScoreItem players={players} name="Yacht" scores={[0]} />
        <ScoreItem players={players} name="Total" scores={[0]} />
      </div>
    </div>
  );
}

export default ScoreBoard;

export interface ScoreItemProps {
  players: ScoreState['players'];
  name: string;
  pss: ScoreState['playerScores'];
  scoreName: keyof PlayerScore;
}

function ScoreItem({ players, name, pss, scoreName }: ScoreItemProps): ReactElement {
  return (
    <div className={`${styles.ScoreItem}`}>
      <div className={styles.cell}>{name}</div>
      {players
        .map((id) => pss.get(id) as PlayerScore)
        .map((ps) => (
          <div className={styles.cell} key={ps.id} style={{ width: `calc(100% / ${players.length || 1})` }}>
            {ps[scoreName]}
          </div>
        ))}
    </div>
  );
}
