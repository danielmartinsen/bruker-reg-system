import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import styles from '../../styles/admin/innstillinger.module.scss'
import Layout from '../../components/admin/layout'

export default function Innstillinger() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [data, setData] = useState()

  useEffect(() => {
    loadInfo()
  }, [])

  function loadInfo() {
    const license = localStorage.getItem('LicenseKey')
    db.collection('Kunder')
      .doc(license)
      .get()
      .then((doc) => {
        const lisensDato = new Date(doc.data().lisens.dato)
        const lisensDatoReadable =
          lisensDato.getDate() +
          '.' +
          `${lisensDato.getMonth() + 1}` +
          '.' +
          lisensDato.getFullYear()
        const result = doc.data()
        result.lisensReadable = lisensDatoReadable

        setData(result)
      })
  }

  function handleEditInfo(field) {
    const value = prompt(`Endre ${field}:`)
    if (value != null) {
      editInfo(field, value)
    }
  }

  function editInfo(field, value) {
    const license = localStorage.getItem('LicenseKey')

    if (field == 'passord') {
      var updatedValue = { login: { brukernavn: data.login.brukernavn, passord: value } }
    } else {
      var updatedValue = { [field]: value }
    }

    db.collection('Kunder')
      .doc(license)
      .update(updatedValue)
      .then(() => {
        loadInfo()
      })
  }

  function deleteInfo() {
    const license = localStorage.getItem('LicenseKey')

    if (prompt('Helt sikker på at du vil slette statistikken?')) {
      db.collection('Kunder')
        .doc(license)
        .collection('Brukere')
        .get()
        .then((res) => {
          res.forEach((element) => {
            element.ref.delete()
          })
        })

      db.collection('Kunder')
        .doc(license)
        .collection('Logg')
        .get()
        .then((res) => {
          res.forEach((element) => {
            element.ref.delete()
          })
        })
    }
  }

  return (
    <Layout>
      <div>
        <div className={styles.infoDiv}>
          <h2>{data ? data.navn : 'Loading'}</h2>
          <p>{data ? 'Kommune: ' + data.kommune : 'Loading'}</p>
          <p>{data ? 'Lisensen utgår ' + data.lisensReadable : 'Loading'}</p>
        </div>

        <div className={styles.infoDiv}>
          <h2>Login-detaljer</h2>
          <p>{data ? 'Brukernavn: ' + data.login.brukernavn : 'Loading'}</p>
          <p>{data ? 'Passord: ' + data.login.passord : 'Loading'}</p>
        </div>

        <div className={styles.infoDivLogo}>
          <img src={data && data.logo} height='100px' />
        </div>

        <div className={styles.buttonDiv}>
          <button onClick={() => handleEditInfo('navn')}>Endre navn</button>
          <button onClick={() => handleEditInfo('kommune')}>Endre kommune</button>
          <button onClick={() => handleEditInfo('logo')}>Endre logo</button>
          <button onClick={() => handleEditInfo('passord')}>Endre passord</button>

          <div style={{ marginTop: 15 }}>
            <button>Last ned periode-rapport</button>
            <button onClick={() => deleteInfo()}>Slett statistikk og start ny periode</button>
          </div>
        </div>
      </div>

      <p style={{ marginTop: 50 }}>
        For å fornye lisensen sender du en e-post til{' '}
        <a href='mailto:daniel.martinsen@online.no'>daniel.martinsen@online.no</a> med emnet "U-reg
        lisens"
      </p>
    </Layout>
  )
}
