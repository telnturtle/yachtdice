import { PlayerMeta } from './scoreSlice'
import { TCategories } from './type'

const arrayOfOneToSix = Object.freeze([1, 2, 3, 4, 5, 6])
export const UNWRITABLE_CATEGORIES: Set<TCategories> = new Set([
  'subtotal' as TCategories,
  'bonus' as TCategories,
  'total' as TCategories,
])

export function computeTopsides(numbers: number[]): Record<TCategories, number> {
  const sides: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
  numbers.forEach((die: number): void => {
    sides[die]++
  })
  const res: Record<TCategories, number> = {
    aces: sides[1],
    deuces: 2 * sides[2],
    threes: 3 * sides[3],
    fours: 4 * sides[4],
    fives: 5 * sides[5],
    sixes: 6 * sides[6],
    subtotal: 0,
    bonus: 0,
    choice: numbers.reduce(add),
    fourOfAKind: foak(sides),
    fullHouse: fh(sides),
    smallStraight: ss(sides),
    largeStraight: ls(sides),
    yacht: y(sides),
    total: 0,
  }
  return res
}
export function computeUnwritableCategories(pm: PlayerMeta) {
  const subtotal = st(pm)
  const bonus = subtotal >= 63 ? 35 : 0
  const total = bonus + tt(pm)
  return { subtotal, bonus, total }
}
export function add(a: number, b: number): number {
  return a + b
}
export function arraySumNumber(array: (number | undefined)[]): number {
  const numbers = array.filter(isNumber) as number[]
  const sum = numbers.reduce(add, 0)
  return sum
}
function foak(sides: Record<number, number>): number {
  for (const i of arrayOfOneToSix) {
    if (sides[i] >= 4) return arrayOfOneToSix.map((i) => i * sides[i]).reduce(add)
  }
  return 0
}
function fh(sides: Record<number, number>): number {
  let twoOfAKind = 0
  let threeOfAKind = 0
  let fiveOfAKind = 0
  for (const i of arrayOfOneToSix) {
    if (sides[i] === 2) twoOfAKind = 2 * i
    if (sides[i] === 3) threeOfAKind = 3 * i
    if (sides[i] === 5) fiveOfAKind = 5 * i
  }
  if (twoOfAKind && threeOfAKind) return twoOfAKind + threeOfAKind
  if (fiveOfAKind) return fiveOfAKind
  return 0
}
function ss(sides: Record<number, number>): number {
  if (sides[1] && sides[2] && sides[3] && sides[4]) return 15
  if (sides[2] && sides[3] && sides[4] && sides[5]) return 15
  if (sides[3] && sides[4] && sides[5] && sides[6]) return 15
  return 0
}
function ls(sides: Record<number, number>): number {
  if (sides[1] && sides[2] && sides[3] && sides[4] && sides[5]) return 30
  if (sides[2] && sides[3] && sides[4] && sides[5] && sides[6]) return 30
  return 0
}
function y(sides: Record<number, number>): number {
  for (const i of arrayOfOneToSix) {
    if (sides[i] === 5) return 50
  }
  return 0
}
export function isNumber(value: any): boolean {
  return value === Number(value)
}
export function st(playerMeta: PlayerMeta): number {
  return (
    (playerMeta.aces ?? 0) +
    (playerMeta.deuces ?? 0) +
    (playerMeta.threes ?? 0) +
    (playerMeta.fours ?? 0) +
    (playerMeta.fives ?? 0) +
    (playerMeta.sixes ?? 0)
  )
}
export function tt(playerMeta: PlayerMeta): number {
  return (
    (playerMeta.aces ?? 0) +
    (playerMeta.deuces ?? 0) +
    (playerMeta.threes ?? 0) +
    (playerMeta.fours ?? 0) +
    (playerMeta.fives ?? 0) +
    (playerMeta.sixes ?? 0) +
    (playerMeta.choice ?? 0) +
    (playerMeta.fourOfAKind ?? 0) +
    (playerMeta.fullHouse ?? 0) +
    (playerMeta.smallStraight ?? 0) +
    (playerMeta.largeStraight ?? 0) +
    (playerMeta.yacht ?? 0)
  )
}
