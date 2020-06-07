import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import Layout from '../../components/admin/layout'
import styles from '../../styles/admin/logg.module.scss'

import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

export default function Logg() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [dato, setDato] = useState(new Date())
  const [brukere, setBrukere] = useState([])

  useEffect(() => {
    loadLogg(dato)
  }, [])

  function changeDate(date) {
    setDato(date)
    loadLogg(date)
  }

  function loadLogg(date) {
    const license = localStorage.getItem('LicenseKey')
    const valgtDato = date.getDate() + '-' + `${date.getMonth() + 1}` + '-' + date.getFullYear()

    db.collection('Kunder')
      .doc(license)
      .collection('Logg')
      .doc(valgtDato)
      .get()
      .then((doc) => {
        setBrukere([])

        for (var user in doc.data()) {
          const bruker = user

          db.collection('Kunder')
            .doc(license)
            .collection('Brukere')
            .doc(bruker)
            .get()
            .then((userdoc) => {
              if (userdoc.exists) {
                setBrukere((brukere) => [
                  ...brukere,
                  <div className={styles.box} key={bruker}>
                    <div className={styles.column}>
                      <h1>
                        {userdoc.data().fornavn + ' ' + userdoc.data().etternavn} ({bruker})
                      </h1>
                      <p>Sjeket inn ca. klokka {doc.data()[bruker].klokkeslett}</p>
                    </div>
                    <div className={styles.column}>
                      <button onClick={() => deleteUserLogg(bruker)}>Slett</button>
                    </div>
                  </div>,
                ])
              } else {
                setBrukere((brukere) => [
                  ...brukere,
                  <div className={styles.box} key={bruker}>
                    <div className={styles.column}>
                      <h1>Slettet bruker ({bruker})</h1>
                      <p>Sjeket inn ca. klokka {doc.data()[bruker].klokkeslett}</p>
                    </div>
                    <div className={styles.column}>
                      <button onClick={() => deleteUserLogg(bruker)}>Slett</button>
                    </div>
                  </div>,
                ])
              }
            })
        }
      })
  }

  function deleteUserLogg(userid) {
    if (confirm('Sikker på at du vil slette besøket?')) {
      loadLogg(dato)
    }
  }

  return (
    <Layout>
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
          autoOk
          disableFuture
          variant='inline'
          format='dd.MM.yyyy'
          margin='normal'
          style={{ marginLeft: 10 }}
          value={dato}
          onChange={(e) => changeDate(e)}
          KeyboardButtonProps={{
            'aria-label': 'change date',
          }}
        />
      </MuiPickersUtilsProvider>

      <div className={styles.break} />

      {brukere}
    </Layout>
  )
}
