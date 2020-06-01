import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import Layout from '../../components/admin/layout'
import Bruker from '../../components/admin/loggBox'
import styles from '../../styles/admin/logg.module.scss'

import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'

export default function Logg() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [dato, setDato] = useState(new Date())
  const [brukere, setBrukere] = useState([])

  const handleDateChange = (date) => setDato(date)

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')
    const valgtDato = dato.getDate() + '-' + `${dato.getMonth() + 1}` + '-' + dato.getFullYear()

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
              setBrukere((brukere) => [
                ...brukere,
                <Bruker
                  navn={userdoc.data().fornavn + ' ' + userdoc.data().etternavn}
                  id={bruker}
                  klokkeslett={doc.data()[bruker].klokkeslett}
                  key={bruker}
                />,
              ])
            })
        }
      })
  }, [dato])

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
          onChange={handleDateChange}
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
