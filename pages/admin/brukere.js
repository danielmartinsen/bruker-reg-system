import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import styles from '../../styles/admin/brukere.module.scss'
import Layout from '../../components/admin/layout'
import Bruker from '../../components/admin/brukerBox'

export default function Brukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [brukere, setBrukere] = useState([])

  var license
  useEffect(() => {
    license = localStorage.getItem('LicenseKey')
    loadBrukere()
  }, [])

  function loadBrukere() {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Brukere')
      .get()
      .then((snapshot) => {
        const brukere = []

        snapshot.forEach((doc) => {
          if (!doc.data().stats) {
            brukere.push({
              id: doc.id,
              navn: doc.data().fornavn + ' ' + doc.data().etternavn,
              bursdag: doc.data().bursdag,
              kjonn: doc.data().kjonn,
              telefon: doc.data().telefon,
            })
          }
        })
        setBrukere(brukere)
      })
  }

  return (
    <Layout>
      {brukere.map((bruker) => {
        return <Bruker data={bruker} />
      })}
    </Layout>
  )
}
