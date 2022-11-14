import ScoreBoard from '../ScoreBoard/ScoreBoard';
import styles from './Board.module.css';

function Board() {
  return (
    <section className={styles.root}>
      <ScoreBoard turn={1} />
    </section>
  );
}

export default Board;
