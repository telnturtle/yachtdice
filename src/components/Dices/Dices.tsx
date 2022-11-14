import { ReactElement } from 'react';
import DiceTest from '../DiceTest/DiceTest';
import styles from './Dices.module.css';

function Dices(): ReactElement {
  return (
    <div className={styles.root}>
      <DiceTest />
      {/* <div className={styles.DiceRow}>
      </div> */}
    </div>
  );
}

export default Dices;

// Animated 3D Dice Roll - CodeSandbox https://codesandbox.io/s/animated-3d-dice-roll-eorl0?from-embed