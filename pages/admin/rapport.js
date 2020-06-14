import React from 'react'
import styles from '../../styles/admin/rapport.module.scss'

export default function Rapport() {
  return (
    <>
      <div>
        <div className={styles.header}>
          <div className={styles.column}>
            <h1>ÅRSRAPPORT</h1>
            <p>Midtgard Ungdomshus</p>
            <p>Lastet ned 08.06.2020</p>
          </div>
          <div className={styles.column}>
            <img src='https://ungias.com/Midtgard%20logo.png' height='75px' />
          </div>
        </div>

        <div className={styles.content}>
          <h3>NØKKELTALL:</h3>

          <div className={styles.column}>
            <p>Besøkstall: 1365</p>
            <p>Unike brukere: 1365</p>
            <p>Gjennomsnittlig besøk: 1365</p>
          </div>
          <div className={styles.column}>
            <p>Besøkstall: 1365</p>
            <p>Unike brukere: 1365</p>
            <p>Gjennomsnittlig besøk: 1365</p>
          </div>

          <div style={{ marginTop: 50 }}>
            <p>Mest pop. tidspunkt: 1365</p>
            <p>Minst pop. tidspunkt: 1365</p>
          </div>
        </div>

        <div className={styles.content} style={{ marginTop: 100 }}>
          <h3>MÅNEDSSTATISTIKK:</h3>
          <table width='100%' className={styles.table}>
            <tr>
              <th>Måned</th>
              <th>Besøkstall</th>
              <th>Mest pop. tidspunkt</th>
              <th>Minst pop. tidspunkt</th>
            </tr>
            <tr>
              <td>Januar</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
            <tr>
              <td>Februar</td>
              <td>0</td>
              <td>0</td>
              <td>0</td>
            </tr>
          </table>
        </div>
      </div>

      <style jsx global>
        {`
          body,
          html {
            background-color: #f1f2fa;
            color: #0f152d;
          }
        `}
      </style>
    </>
  )
}
