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
        padding: 0 0 calc(min(16vw, 9vh) * 0.125) calc(min(16vw, 9vh) * 0.125);
        font-size: calc(min(16vw, 9vh) * 0.5);
        max-width: calc(min(16vw, 9vh) * 9);
        min-width: calc(min(16vw, 9vh) * 1);
        text-shadow: 0 0 calc(min(16vw, 9vh) * 0.1) rgba(0, 102, 231, 80%);
        color: rgba(0, 102, 231, 75%);
        transform: scale(0);
        transform-origin: calc(min(16vw, 9vh) * 3) 50%;
        transform-origin: 50% 50%;
        animation: 10s linear bbam;
        @keyframes bbam {
          from {
            transform: scale(0);
          }
          5% {
            transform: scale(1);
          }
          50% {
            transform: scale(1);
          }
          to {
            transform: scale(0);
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
