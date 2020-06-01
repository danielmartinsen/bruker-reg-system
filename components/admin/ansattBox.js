import React from 'react'
import styles from '../../styles/admin/ansattbox.module.scss'

export default function Stats({ navn, nummer, bilde }) {
  return (
    <>
      <div className={styles.box}>
        <h1>
          <img src={bilde} />
          {navn} ({nummer})
        </h1>
      </div>
    </>
  )
}
