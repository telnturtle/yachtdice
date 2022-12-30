import { PlayerScore } from './store'
import { TCategories } from './type'

const arrayOfOneToSix = Object.freeze([1, 2, 3, 4, 5, 6])
export const UNWRITABLE_CATEGORIES: Set<TCategories> = new Set([
  'subtotal' as TCategories,
  'bonus' as TCategories,
  'total' as TCategories,
])

export function computeFromDieSequence(numbers: number[]): Record<TCategories, number> {
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
export function computeUnwritableCategories(ps: PlayerScore) {
  const { aces, deuces, threes, fours, fives, sixes } = ps
  const subtotal = ([aces, deuces, threes, fours, fives, sixes].filter(isNumber) as number[]).reduce(add, 0)
  const bonus = subtotal >= 63 ? 35 : 0
  const { choice, fourOfAKind, fullHouse, smallStraight, largeStraight, yacht } = ps
  const total = (
    [choice, fourOfAKind, fullHouse, smallStraight, largeStraight, yacht].filter(isNumber) as number[]
  ).reduce(add, subtotal)
  return { subtotal, bonus, total }
}
// function st(sides: Record<number, number>): number {
//   return arrayOfOneToSix.map((i) => i * sides[i]).reduce(add);
// }
// function bonus(sides: Record<number, number>): number {
//   return arrayOfOneToSix.map((i) => i * sides[i]).reduce(add) >= 63 ? 35 : 0;
// }
export function add(a: number, b: number): number {
  return a + b
}
function foak(sides: Record<number, number>): number {
  for (const i of arrayOfOneToSix) {
    if (sides[i] >= 4) arrayOfOneToSix.map((i) => sides[i]).reduce(add)
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
