import React from 'react'

import Layout from '../../components/admin/layout'
import { loadFirebase } from '../../lib/firebase'

export default function Test() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  function check() {
    const license = localStorage.getItem('LicenseKey')
    db.collection('Kunder')
      .doc(license)
      .collection('Tilbud')
      .doc('--config--')
      .get()
      .then((doc) => {
        const obj = doc.data()

        const dato = new Date()
        console.log(dato.getDay())
        console.log(dato.getHours())

        for (var dag in obj) {
          if (dag == dato.getDay()) {
            for (var klokkeslett in obj[dag]) {
              const klString = klokkeslett.split('-')
              if (dato.getHours() >= klString[0] && dato.getHours() < klString[1]) {
                const dagConfig = obj[dag]
                console.log(dagConfig[klokkeslett].id)
              }
            }
          }
        }
      })
  }

  return (
    <Layout>
      <button onClick={() => check()}>Klikk</button>
    </Layout>
  )
}
