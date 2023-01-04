/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Board } from './features/score/Board'

function App() {
  return (
    <div
      css={css`
        max-width: 100vw;
        max-height: 100vh;
        aspect-ratio: 9 / 16;
        /* background-image: radial-gradient(circle farthest-side, #fceabb, #a14141); */
        background-image: linear-gradient(97.2deg, rgb(238, 252, 249) 26.8%, rgb(208, 239, 253) 64%);
        /* 30 Stylish CSS Background Gradient Examples: https://www.makeuseof.com/css-background-gradients/ */
        position: relative;
        overflow: hidden;
      `}
    >
      <Board />
    </div>
  )
}

export default App
