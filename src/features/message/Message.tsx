/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { useEffect, useReducer } from 'react'
import { useAppSelector } from '../../app/hooks'
import { selectMessages } from './messageSlice'

export function Message() {
  const messages = useAppSelector(selectMessages)
  const [key, increaseKey] = useReducer((x) => x + 1, 0)

  useEffect(() => {
    increaseKey()
  }, [messages])

  return (
    <div
      key={key}
      css={css`
        position: absolute;
        z-index: 11;
        bottom: calc(min(16vw, 9vh) * 0.25);
        bottom: 0;
        width: 100%;
        height: 100%;
        max-width: calc(min(16vw, 9vh) * 9);
        min-width: calc(min(16vw, 9vh) * 1);
        display: flex;
        flex-flow: column;
        align-items: center;
        justify-content: center;
        text-align: center;
        font-size: calc(min(16vw, 9vh) * 0.75);
        font-weight: 900;
        text-shadow: rgba(0, 102, 231, 90%) 0 0 calc(min(16vw, 9vh) * 0.2);
        color: rgba(0, 102, 231, 80%);
        transform: scale(0);
        transform-origin: calc(min(16vw, 9vh) * 3) 50%;
        transform-origin: 50% 50%;
        animation: 10s ease-in fill_score_out_disappear;
        @keyframes fill_score_out_disappear {
          from {
            transform: scale(2.55);
            opacity: 0.25;
          }
          2% {
            transform: scale(1);
            opacity: 1;
          }
          22% {
            transform: scale(1);
            opacity: 1;
          }
          24% {
            transform: scale(0);
            opacity: 0;
          }
        }
        pointer-events: none;
      `}
    >
      {messages.map((m, i) => (
        <div key={i}>{m}</div>
      ))}
    </div>
  )
}
