import { useScoreStore } from '../../modules/score/store'
import DiceKeep from '../DiceKeep/DiceKeep'
import Dices from '../Dices/Dices'
import ScoreBoard from '../ScoreBoard/ScoreBoard'
import styles from './Board.module.css'

function Board() {
  const [nowPlayer, rounds] = useScoreStore((s) => [s.nowPlayer, s.rounds])
  return (
    <section className={styles.root}>
      <ScoreBoard />
      <DiceKeep />
      <Dices key={`${nowPlayer}-${rounds}`} />
    </section>
  )
}

export default Board
