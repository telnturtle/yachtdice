import { ReactElement, useState } from 'react';
import styles from './DiceTest.module.css';

interface DiceTestProps {
  id?: number;
}

function DiceTest(): ReactElement {
  const [matrix, setMatrix] = useState<number[][]>([
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ]);
  const [float, setFloat] = useState<boolean>(false);
  const onClick = () => {
    const numberRolls = getRandomIntInclusive(11, 17);
    const rolls = Array(numberRolls).fill(0).map(rotatorRandomXyz);
    setFloat(true);
    for (let i = 0; i < rolls.length; i++) {
      setTimeout(() => {
        setMatrix((acc) => multiplyMatrix(acc, rolls[i]));
      }, 125 * i + 250);
    }
    setTimeout(() => {
      setFloat(false);
    }, 125 * rolls.length + 250);
  };

  const topsideNumber = matrixToTopside(matrix);

  return (
    <div>
      <D6 matrix3d={makeMatrix3dTextFromMatrix(matrix)} float={float} />
      <button onClick={onClick}>Roll!</button>
      <div>{String(topsideNumber)}</div>
      {/* <div>{JSON.stringify(matrix)}</div> */}
    </div>
  );
}

export default DiceTest;

// ⚀ ⚁ ⚂ ⚃ ⚄ ⚅

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

function multiplyMatrix(matrix1: number[][], matrix2: number[][]) {
  const i1 = matrix1.length;
  const j1 = matrix1[0].length;
  const j2 = matrix2[0].length;

  const answer = []; /* answer is i1 x j2 */

  for (let i = 0; i < i1; i++) {
    const row = [];
    for (let j = 0; j < j2; j++) {
      let sum = 0;
      for (let k = 0; k < j1; k++) {
        sum += matrix1[i][k] * matrix2[k][j];
      }
      row.push(sum);
    }
    answer.push(row);
  }
  /* https://ko.wikipedia.org/wiki/%ED%96%89%EB%A0%AC_%EA%B3%B1%EC%85%88 */

  return answer;
}

function xyz(): 'x' | 'y' | 'z' {
  switch (getRandomIntInclusive(1, 3)) {
    case 1: {
      return 'x';
    }
    case 2: {
      return 'y';
    }
    case 3: {
      return 'z';
    }
    default: {
      return 'x';
    }
  }
}

/**
 * 최댓값을 포함하는 정수 난수 생성
 *
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%EC%B5%9C%EB%8C%93%EA%B0%92%EC%9D%84_%ED%8F%AC%ED%95%A8%ED%95%98%EB%8A%94_%EC%A0%95%EC%88%98_%EB%82%9C%EC%88%98_%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0
 *
 * @param min 최소값
 * @param max 최댓값
 * @returns 정수 난수
 */
function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

/**
 * 랜덤으로 x, y, 혹은 z 축으로 90, 180, 270도 회전하는 3x3 행렬을 리턴함
 */
function rotatorRandomXyz(): number[][] {
  const axis = xyz();
  const degree = (getRandomIntInclusive(1, 3) / 2) * Math.PI;
  const c = Math.round(100 * Math.cos(degree)) / 100;
  const s = Math.round(100 * Math.sin(degree)) / 100;
  switch (axis) {
    case 'x': {
      return [
        [1, 0, 0, 0],
        [0, c, s, 0],
        [0, -s, c, 0],
        [0, 0, 0, 1],
      ];
    }
    case 'y': {
      return [
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1],
      ];
    }
    case 'z': {
      return [
        [c, s, 0, 0],
        [-s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ];
    }
  }
}

function makeMatrix3dTextFromMatrix(matrix: number[][]): string {
  return `matrix3d(${matrix.flat().join(',')})`;
}

function matrixToTopside(m: number[][]) {
  if (
    areEqual(m, [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [-1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 1;
  }
  if (
    areEqual(m, [
      [-1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, -1, 0, 0],
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 2;
  }
  if (
    areEqual(m, [
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, 1, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, 1, 0],
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 3;
  }
  if (
    areEqual(m, [
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, -1, 0],
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, -1, 0],
      [1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, -1, 0],
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 0, -1, 0],
      [0, -1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 4;
  }
  if (
    areEqual(m, [
      [1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [-1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, -1, 0, 0],
      [0, 0, -1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 1, 0, 0],
      [0, 0, -1, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 5;
  }
  if (
    areEqual(m, [
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, -1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ]) ||
    areEqual(m, [
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ])
  ) {
    return 6;
  }
}

function areEqual(matrix1: number[][], matrix2: number[][]) {
  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix1[0].length; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

// https://gist.github.com/f5io/7466669
// Get 3D CSS rotation value from matrix3d() with JavaScript https://stackoverflow.com/questions/34450835/get-3d-css-rotation-value-from-matrix3d-with-javascript
