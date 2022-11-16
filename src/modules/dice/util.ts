import { TMatrix } from './type';

export const identityMatrixFourByFour: TMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
];

export function multiplyMatrix(matrix1: TMatrix, matrix2: TMatrix) {
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

export function xyz(): 'x' | 'y' | 'z' {
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
export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //최댓값도 포함, 최솟값도 포함
}

/**
 * 랜덤으로 x, y, 혹은 z 축으로 90, 180, 270도 회전하는 3x3 행렬을 리턴함
 */
export function rotatorRandomXyz(): TMatrix {
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

export function makeMatrix3dTextFromMatrix(matrix: TMatrix): string {
  return `matrix3d(${matrix.flat().join(',')})`;
}

const _side = {
  1: [
    [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    [
      [-1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1],
    ],
  ],
  2: [
    [
      [-1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [1, 0, 0, 0],
      [0, 0, 1, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, -1, 0, 0],
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ],
  3: [
    [
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, 1, 0],
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, 1, 0],
      [0, 1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, 1, 0],
      [0, -1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ],
  4: [
    [
      [0, 0, 1, 0],
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, -1, 0],
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, -1, 0],
      [1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, -1, 0],
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 0, -1, 0],
      [0, -1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ],
  5: [
    [
      [1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [-1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, -1, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, -1, 0, 0],
      [0, 0, -1, 0],
      [1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 1, 0, 0],
      [0, 0, -1, 0],
      [-1, 0, 0, 0],
      [0, 0, 0, 1],
    ],
  ],
  6: [
    [
      [-1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ],
    [
      [1, 0, 0, 0],
      [0, -1, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, -1, 0, 0],
      [-1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ],
    [
      [0, 1, 0, 0],
      [1, 0, 0, 0],
      [0, 0, -1, 0],
      [0, 0, 0, 1],
    ],
  ],
};

export function matrixToTopside(m: TMatrix) {
  if (_side[1].some((m2) => areEqual(m, m2))) return 1;
  if (_side[2].some((m2) => areEqual(m, m2))) return 2;
  if (_side[3].some((m2) => areEqual(m, m2))) return 3;
  if (_side[4].some((m2) => areEqual(m, m2))) return 4;
  if (_side[5].some((m2) => areEqual(m, m2))) return 5;
  if (_side[6].some((m2) => areEqual(m, m2))) return 6;
}

export function areEqual(matrix1: TMatrix, matrix2: TMatrix) {
  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix1[0].length; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function matrixToString(matrix: TMatrix) {
  return matrix.map((row) => row.map((el) => String(el).padStart(3)).join('')).join('\n');
}

// https://gist.github.com/f5io/7466669
// Get 3D CSS rotation value from matrix3d() with JavaScript https://stackoverflow.com/questions/34450835/get-3d-css-rotation-value-from-matrix3d-with-javascript
