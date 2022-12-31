import { XYZ } from '../../common/type'
import { coinToss, getRandomIntInclusive } from '../../common/util'
import { BasicRotationDirection, TMatrix } from './type'

export const identityMatrixFourByFour: TMatrix = [
  [1, 0, 0, 0],
  [0, 1, 0, 0],
  [0, 0, 1, 0],
  [0, 0, 0, 1],
]

export function multiplyMatrix(matrix1: TMatrix, matrix2: TMatrix) {
  const i1 = matrix1.length
  const j1 = matrix1[0].length
  const j2 = matrix2[0].length

  const answer = [] /* is i1 x j2 matrix */

  for (let i = 0; i < i1; i++) {
    const row = []
    for (let j = 0; j < j2; j++) {
      let sum = 0
      for (let k = 0; k < j1; k++) {
        sum += matrix1[i][k] * matrix2[k][j]
      }
      row.push(sum)
    }
    answer.push(row)
  }
  /* https://ko.wikipedia.org/wiki/%ED%96%89%EB%A0%AC_%EA%B3%B1%EC%85%88 */

  return answer
}

export function xyz(): XYZ {
  switch (getRandomIntInclusive(1, 3)) {
    case 1:
      return 'x'
    case 2:
      return 'y'
    case 3:
      return 'z'
    default:
      return 'x'
  }
}

/**
 * 랜덤으로 x, y, 혹은 z 축으로 90, 180, 270도 회전하는 3x3 행렬을 리턴함
 */
export function rotatorRandomXyz(): TMatrix {
  const axis = xyz()
  const degree = (getRandomIntInclusive(1, 3) / 2) * Math.PI
  const c = Math.round(100 * Math.cos(degree)) / 100
  const s = Math.round(100 * Math.sin(degree)) / 100
  switch (axis) {
    case 'x':
      return [
        [1, 0, 0, 0],
        [0, c, s, 0],
        [0, -s, c, 0],
        [0, 0, 0, 1],
      ]
    case 'y':
      return [
        [c, 0, s, 0],
        [0, 1, 0, 0],
        [-s, 0, c, 0],
        [0, 0, 0, 1],
      ]
    case 'z':
      return [
        [c, s, 0, 0],
        [-s, c, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1],
      ]
  }
}

export const rotatorMatrices = {
  xcw: [
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, -1, 0, 0],
    [0, 0, 0, 1],
  ],
  xccw: [
    [1, 0, 0, 0],
    [0, 0, -1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 1],
  ],
  ycw: [
    [0, 0, -1, 0],
    [0, 1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 0, 1],
  ],
  yccw: [
    [0, 0, 1, 0],
    [0, 1, 0, 0],
    [-1, 0, 0, 0],
    [0, 0, 0, 1],
  ],
  zcw: [
    [0, 1, 0, 0],
    [-1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
  zccw: [
    [0, -1, 0, 0],
    [1, 0, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1],
  ],
}

export function makeMatrix3dTextFromMatrix(matrix: TMatrix): string {
  return `matrix3d(${matrix.flat().join(',')})`
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
}

export function matrixToTopside(m: TMatrix) {
  if (_side[1].some((m2) => areEqual(m, m2))) return 1
  if (_side[2].some((m2) => areEqual(m, m2))) return 2
  if (_side[3].some((m2) => areEqual(m, m2))) return 3
  if (_side[4].some((m2) => areEqual(m, m2))) return 4
  if (_side[5].some((m2) => areEqual(m, m2))) return 5
  if (_side[6].some((m2) => areEqual(m, m2))) return 6
}

export function areEqual(matrix1: TMatrix, matrix2: TMatrix) {
  for (let i = 0; i < matrix1.length; i++) {
    for (let j = 0; j < matrix1[0].length; j++) {
      if (matrix1[i][j] !== matrix2[i][j]) {
        return false
      }
    }
  }
  return true
}

export function matrixToString(matrix: TMatrix) {
  return matrix.map((row) => row.map((el) => String(el).padStart(3)).join('')).join('\n')
}

export function getRepresentativeMatrix(topside: number) {
  switch (topside) {
    case 1:
      return _side[1][0]
    case 2:
      return _side[2][0]
    case 3:
      return _side[3][0]
    case 4:
      return _side[4][1]
    case 5:
      return _side[5][0]
    case 6:
      return _side[6][0]
    default:
      return _side[1][0]
  }
}

export function changeToRepresentativeMatrix(matrix: TMatrix) {
  const topside = matrixToTopside(matrix)
  switch (topside) {
    case 2:
      return _side[2][coinToss() ? 0 : 1]
    case 3:
      return _side[3][coinToss() ? 0 : 1]
    case 6:
      return _side[6][coinToss() ? 0 : 1]
    default:
      return matrix
  }
}

// https://gist.github.com/f5io/7466669
// Get 3D CSS rotation value from matrix3d() with JavaScript https://stackoverflow.com/questions/34450835/get-3d-css-rotation-value-from-matrix3d-with-javascript

export function displayLeftRollsEmoji(leftRolls: number) {
  switch (leftRolls) {
    case 3:
      return { head: '', tail: '3️⃣2️⃣1️⃣' }
    case 2:
      return { head: '✅', tail: '2️⃣1️⃣' }
    case 1:
      return { head: '✅✅', tail: '1️⃣' }
    default:
      return { head: '✅✅✅', tail: '' }
  }
}

export function getRandomDirection(): BasicRotationDirection {
  const s: BasicRotationDirection[] = ['xcw', 'ycw', 'ycw', 'zcw']
  const i = getRandomIntInclusive(0, s.length - 1)
  return s[i]
}

export function getRandomDirectionBatch(n: number): BasicRotationDirection[] {
  const s0: BasicRotationDirection[] = ['xcw', 'ycw', 'ycw', 'zcw']
  const s1: BasicRotationDirection[] = ['xcw', 'xccw', 'ycw', 'yccw', 'zccw']
  const s2: BasicRotationDirection[] = ['ycw', 'ycw', 'ycw', 'ycw', 'zcw']
  const r = coinToss() ? s0 : coinToss() ? s1 : coinToss() ? s2 : s0
  let count = n
  const result: BasicRotationDirection[] = []
  while (count) {
    count--
    result.push(r[getRandomIntInclusive(0, r.length - 1)])
  }
  return result
}

export function getRandomLengthDirectionBatch(): BasicRotationDirection[] {
  const result: BasicRotationDirection[] = []
  let s: BasicRotationDirection[] = ['xcw', 'ycw', 'ycw', 'zcw']
  let count = getRandomIntInclusive(15, 25)
  if (coinToss()) {
    // do nothing
  } else if (coinToss()) {
    s = ['xccw', 'xccw', 'xccw', 'yccw', 'zccw']
    count += 10
  } else if (coinToss()) {
    s = ['ycw', 'ycw', 'ycw', 'ycw', 'zcw']
    count += 20
  } else if (coinToss()) {
    s = ['yccw', 'zccw']
    count += 30
  }
  if (coinToss()) {
    count += getRandomIntInclusive(0, 5)
  } else {
    count -= getRandomIntInclusive(0, 5)
  }
  while (count) {
    count--
    result.push(s[getRandomIntInclusive(0, s.length - 1)])
  }
  return result
}

const tiltMatrixMultiplier: TMatrix = multiplyMatrix(
  [
    [1, 0, 0, 0],
    [0, Math.cos(-Math.PI / 16), Math.sin(-Math.PI / 16), 0],
    [0, -Math.sin(-Math.PI / 16), Math.cos(-Math.PI / 16), 0],
    [0, 0, 0, 1],
  ],
  [
    [Math.cos(Math.PI / 16), 0, Math.sin(Math.PI / 16), 0],
    [0, 1, 0, 0],
    [-Math.sin(Math.PI / 16), 0, Math.cos(Math.PI / 16), 0],
    [0, 0, 0, 1],
  ]
)

export const tiltMatrix3dText = makeMatrix3dTextFromMatrix(tiltMatrixMultiplier)

/**
 *
 * @param matrix 행렬 피연산자
 * @returns PI/16 만큼 X, Y축으로 기울인 행렬
 */
export function tiltMatrix(matrix: TMatrix): TMatrix {
  return multiplyMatrix(matrix, tiltMatrixMultiplier)
}
