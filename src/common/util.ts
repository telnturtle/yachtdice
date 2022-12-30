export const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
}

/**
 * [min, max] 범위에서 정수 난수 생성
 *
 * https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%EC%B5%9C%EB%8C%93%EA%B0%92%EC%9D%84_%ED%8F%AC%ED%95%A8%ED%95%98%EB%8A%94_%EC%A0%95%EC%88%98_%EB%82%9C%EC%88%98_%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0
 *
 * @param min 최소값
 * @param max 최댓값
 * @returns 정수 난수
 */
export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min //최댓값도 포함, 최솟값도 포함
}

export function coinToss(): boolean {
  return Math.random() > 0.5
}
