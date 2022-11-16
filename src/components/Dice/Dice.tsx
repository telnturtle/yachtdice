import { ReactElement, useCallback, useEffect, useState } from 'react';
import { TMatrix } from '../../modules/dice/type';
import {
  identityMatrixFourByFour,
  makeMatrix3dTextFromMatrix,
  matrixToString,
  multiplyMatrix,
} from '../../modules/dice/util';
import styles from './Dice.module.css';

interface DiceProps {
  id: number;
  transformationMatrixSequence: TMatrix[];
}

/**
 * ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
 *
 *
 */
function Dice({ transformationMatrixSequence: tms }: DiceProps): ReactElement {
  const TICK = 100;
  const FLOATING = 250;
  const [matrix, setMatrix] = useState<TMatrix>(identityMatrixFourByFour);
  const [float, setFloat] = useState<boolean>(false);

  const roll = useCallback((rolls: DiceProps['transformationMatrixSequence']) => {
    setFloat(true);
    for (let i = 0; i < rolls.length; i++) {
      setTimeout(() => {
        setMatrix((acc) => multiplyMatrix(acc, rolls[i]));
      }, TICK * i + FLOATING);
    }
    setTimeout(() => {
      setFloat(false);
    }, TICK * rolls.length + FLOATING);
  }, []);

  useEffect(() => {
    roll(tms);
  }, [tms, roll]);

  return <D6 matrix3d={makeMatrix3dTextFromMatrix(matrix)} float={float} />;
}

export default Dice;

function D6({ matrix3d = '', float }: { matrix3d?: string; float: boolean }): ReactElement {
  return (
    <div className={`${styles.dice_wrap} ${float ? styles.float : ''}`}>
      <ol className={styles.dice} style={{ transform: matrix3d }}>
        <li className={styles.die} data-die="1">
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="2">
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="3">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="4">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="5">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="6">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
      </ol>
    </div>
  );
}
