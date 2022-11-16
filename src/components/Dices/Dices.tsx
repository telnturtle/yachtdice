import { ReactElement, useState } from 'react';
import { TMatrix } from '../../modules/dice/type';
import { getRandomIntInclusive, identityMatrixFourByFour, rotatorRandomXyz } from '../../modules/dice/util';
import Dice from '../Dice/';
import DiceTest from '../DiceTest/DiceTest';
import styles from './Dices.module.css';

function Dices(): ReactElement {
  const [matrices, setMatrices] = useState<TMatrix[]>(Array(6).fill(identityMatrixFourByFour));
  const [transMatSequences, setTransMatSequences] = useState<TMatrix[][]>(Array(6).fill([identityMatrixFourByFour]));
  const [idSequence, setIdSequence] = useState<number[]>([1, 2, 3, 4, 5]);

  const roll = (id: number) => {
    const numberRolls = getRandomIntInclusive(15, 21);
    const rolls = Array(numberRolls).fill(0).map(rotatorRandomXyz);
    setTransMatSequences((prev) => {
      const next = [...prev];
      next[id] = rolls;
      return next;
    });
  };

  const onRoll = () => {
    idSequence.forEach((id, i) => {
      setTimeout(() => {
        roll(id);
      }, 50 * i + 50);
    });
  };

  return (
    <div className={styles.root}>
      <div className={styles.DiceRow}>
        <Dice id={1} transformationMatrixSequence={transMatSequences[1]} />
        <Dice id={2} transformationMatrixSequence={transMatSequences[2]} />
        <Dice id={3} transformationMatrixSequence={transMatSequences[3]} />
        <Dice id={4} transformationMatrixSequence={transMatSequences[4]} />
        <Dice id={5} transformationMatrixSequence={transMatSequences[5]} />
      </div>
      <button onClick={onRoll}>Roll dices!</button>
    </div>
  );
}

export default Dices;

// Animated 3D Dice Roll - CodeSandbox https://codesandbox.io/s/animated-3d-dice-roll-eorl0?from-embed
