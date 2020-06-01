import React from 'react'
import styles from '../../styles/admin/loggbox.module.scss'

export default function Stats({ id, navn, klokkeslett }) {
  return (
    <>
      <div className={styles.box}>
        <h1>
          {navn} ({id})
        </h1>
        <p>Sjeket inn ca. klokka {klokkeslett}</p>
      </div>
    </>
  )
}
