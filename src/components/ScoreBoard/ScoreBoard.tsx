import { ReactElement } from 'react';
import styles from './ScoreBoard.module.css';

export interface ScoreBoardProps {
  playersNum?: number;
  turn: number;
}

function ScoreBoard({ playersNum = 1, turn }: ScoreBoardProps): ReactElement {
  return (
    <div className={styles.root}>
      <div className={styles.border}>
        <ScoreItem playersNum={playersNum} name="Aces" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Deuces" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Threes" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Fours" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Fives" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Sixes" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Subtotal" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Choice" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Four of a Kind" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Full House" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="S. Straight" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="L. Straight" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Yacht" scores={[0]} />
        <ScoreItem playersNum={playersNum} name="Total" scores={[0]} />
      </div>
    </div>
  );
}

export default ScoreBoard;

export interface ScoreItemProps {
  playersNum: number;
  name: string;
  scores: number[];
}

function ScoreItem({ playersNum, name, scores }: ScoreItemProps): ReactElement {
  return (
    <div className={`${styles.ScoreItem}`}>
      <div className={styles.cell}>{name}</div>
      {Array(playersNum).fill(undefined).map((_, i) => (
        <div className={styles.cell} key={i} style={{ width: `calc(100% / ${playersNum})` }}>
          {scores[i]}
        </div>
      ))}
    </div>
  );
}
