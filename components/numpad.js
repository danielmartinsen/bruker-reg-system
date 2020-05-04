import styles from '../styles/numpad.module.scss'

export default function numpad() {
  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <button className={styles.number}>1</button>
        <button className={styles.number}>2</button>
        <button className={styles.number}>3</button>
      </div>

      <div className={styles.row}>
        <button className={styles.number}>4</button>
        <button className={styles.number}>5</button>
        <button className={styles.number}>6</button>
      </div>

      <div className={styles.row}>
        <button className={styles.number}>7</button>
        <button className={styles.number}>8</button>
        <button className={styles.number}>9</button>
      </div>

      <div className={styles.row}>
        <button className={styles.number}>r</button>
        <button className={styles.number}>0</button>
        <button className={styles.number}>b</button>
      </div>
    </div>
  )
}
