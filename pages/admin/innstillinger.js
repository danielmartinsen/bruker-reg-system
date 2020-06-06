import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import styles from '../../styles/admin/innstillinger.module.scss'
import Layout from '../../components/admin/layout'

export default function Innstillinger() {
  return (
    <Layout>
      <div>
        <div className={styles.infoDiv}>
          <h2>Midtgard Ungdomshus</h2>
          <p>Kommune: Ås Kommune</p>
          <p>Lisensen utgår 31.12.2025</p>
        </div>

        <div className={styles.infoDiv}>
          <h2>Login-detaljer</h2>
          <p>Brukernavn: midtgard</p>
          <p>Passord: admin123</p>
        </div>

        <div className={styles.infoDivLogo}>
          <img src='https://ungias.com/logodemo.png' height='100px' />
        </div>

        <div className={styles.buttonDiv}>
          <button>Endre navn</button>
          <button>Endre kommune</button>
          <button>Endre logo</button>
          <button>Endre passord</button>
        </div>
      </div>
    </Layout>
  )
}
