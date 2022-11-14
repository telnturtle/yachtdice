import DiceKeep from '../DiceKeep/DiceKeep';
import Dices from '../Dices/Dices';
import ScoreBoard from '../ScoreBoard/ScoreBoard';
import styles from './Board.module.css';

function Board() {
  return (
    <section className={styles.root}>
      <ScoreBoard turn={1} />
      <DiceKeep />
      <Dices />
    </section>
  );
}

export default Board;
