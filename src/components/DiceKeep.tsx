/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { ReactElement } from 'react'

const rootCss = css`
  height: 100%;
  padding: 0 0 0 10vmin;
  display: flex;
`

const dicekeepCss = css`
  height: calc(6.5 * min(16vw, 9vh));
  position: absolute;
  width: calc(1 * min(16vw, 9vh));
  top: calc(1.25 * min(16vw, 9vh));
  right: calc(1.75 * min(16vw, 9vh));
  /* background-image: linear-gradient( 95.2deg, rgba(173,252,234,1) 26.8%, rgba(192,229,246,1) 64% );    */
  background-color: #e8c99b;
  background-image: linear-gradient(315deg, #e8c99b 0%, #e8bc85 74%);
  /* Brown Gradient: +39 Background Gradient Colors with CSS https://www.eggradients.com/category/brown-gradient */

  /* The noob’s guide to 3D transforms with CSS - LogRocket Blog https://blog.logrocket.com/the-noobs-guide-to-3d-transforms-with-css-7370aafd9edf/ */
`

export function DiceKeep(): ReactElement {
  return (
    <div css={rootCss}>
      <div css={dicekeepCss}></div>
    </div>
  )
}
