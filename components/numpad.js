import React from 'react'
import { loadCSS } from 'fg-loadcss'
import styles from '../styles/numpad.module.scss'
import Icon from '@material-ui/core/Icon'

export default function numpad() {
  React.useEffect(() => {
    loadCSS('https://use.fontawesome.com/releases/v5.12.0/css/all.css', document.querySelector('#font-awsome-css'))
  }, [])

  return (
    <div className={styles.container}>
      <input type='text' name='brukernummer' className={styles.input} placeholder='Tast brukernummeret ditt' />

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
        <button className={styles.number}>
          <Icon className='fa fa-sync-alt' />
        </button>
        <button className={styles.number}>0</button>
        <button className={styles.number}>
          <Icon className='fa fa-arrow-left' />
        </button>
      </div>
    </div>
  )
}
