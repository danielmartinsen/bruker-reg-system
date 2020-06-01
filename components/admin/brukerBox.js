import React from 'react'
import styles from '../../styles/admin/brukerbox.module.scss'

export default function Stats({ data }) {
  const dato = new Date(data.bursdag)
  const datoReadable = dato.getDate() + '.' + `${dato.getMonth() + 1}` + '.' + dato.getFullYear()

  return (
    <>
      <div className={styles.box}>
        <h1>
          {data.navn} ({data.id})
        </h1>
        <div className={styles.column} style={{ width: '60%' }}>
          <p>Kjønn: {data.kjonn}</p>
          <p>Bursdag: {datoReadable}</p>
          <p>Telefon: {data.telefon}</p>
        </div>
        <div className={styles.column}>
          <button>Endre</button>
          <button>Logg</button>
          <button>Slett</button>
        </div>
      </div>
    </>
  )
}
