/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactElement } from 'react'

const rootCss = css`
  height: 100%;
  padding: 0 0 0 10vmin;
  display: flex;
`

const dicekeepCss = css`
  height: 5.5rem;
  position: absolute;
  width: 0.95rem;
  top: 1.55rem;
  right: 1.5rem;
  /* background-image: linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% );    */
  background-color: #e8c99b;
  background-image: linear-gradient(315deg, #e8c99b 0%, #e8bc85 74%);
  /* Brown Gradient: +39 Background Gradient Colors with CSS https://www.eggradients.com/category/brown-gradient */

  /* The noob’s guide to 3D transforms with CSS - LogRocket Blog https://blog.logrocket.com/the-noobs-guide-to-3d-transforms-with-css-7370aafd9edf/ */

  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;

  &::after {
  content: 'KEEP';
  color: rgb(63 63 63);
  mix-blend-mode: soft-light;
  font-weight: 800;
  transform: rotate(90deg);
}
`

/** 주사위를 킵하는 화면상 장소 */
export function DiceKeep(): ReactElement {
  return (
    <div css={rootCss}>
      <div css={dicekeepCss}>
      </div>
    </div>
  )
}
