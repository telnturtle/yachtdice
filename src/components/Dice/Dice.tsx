import { ReactElement, useCallback, useEffect, useState } from 'react'
import { TMatrix } from '../../modules/dice/type'
import { identityMatrixFourByFour, makeMatrix3dTextFromMatrix, multiplyMatrix } from '../../modules/dice/util'
import styles from './Dice.module.css'

interface DiceProps {
  id: number
  transformationMatrixSequence: TMatrix[]
  order?: number
  kept?: boolean
  onClick?: (id: DiceProps['id']) => void
  keptOrder: number
}

/**
 * ⚀ ⚁ ⚂ ⚃ ⚄ ⚅
 *
 *
 */
function Dice({ id, transformationMatrixSequence: tms, order, kept, onClick, keptOrder }: DiceProps): ReactElement {
  const TICK = 100
  const FLOATING = 250
  const [matrix, setMatrix] = useState<TMatrix>(identityMatrixFourByFour)
  const [float, setFloat] = useState<boolean>(false)

  const roll = useCallback((rolls: DiceProps['transformationMatrixSequence']) => {
    setFloat(true)
    for (let i = 0; i < rolls.length; i++) {
      setTimeout(() => {
        setMatrix((acc) => multiplyMatrix(acc, rolls[i]))
      }, TICK * i + FLOATING)
    }
    setTimeout(() => {
      setFloat(false)
    }, TICK * rolls.length + FLOATING)
  }, [])

  useEffect(() => {
    roll(tms)
  }, [tms, roll])
  return <D6 matrix3d={makeMatrix3dTextFromMatrix(matrix)} {...{ float, order, kept, onClick, id, keptOrder }} />
}

export default Dice

interface D6Props {
  matrix3d?: string
  float: boolean
  order?: number
  kept?: boolean
  onClick: DiceProps['onClick']
  id: DiceProps['id']
  keptOrder: DiceProps['keptOrder']
}

function D6({ matrix3d = '', float, order = 0, kept, onClick = () => {}, id, keptOrder }: D6Props): ReactElement {
  const className = [
    styles.dice_wrap,
    float ? styles.float : '',
    order ? styles[`order_${order}`] : '',
    kept ? styles[`kept_${keptOrder}`] : '',
  ].join(' ')
  return (
    <div className={className} onClick={() => onClick(id)}>
      <ol className={styles.dice} style={{ transform: matrix3d }}>
        <li className={styles.die} data-die="1">
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="2">
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="3">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="4">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="5">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
        <li className={styles.die} data-die="6">
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
          <span className={styles.dot} />
        </li>
      </ol>
    </div>
  )
}
