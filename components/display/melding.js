import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState } from 'react'
import styles from '../../styles/display/stats.module.scss'

export default function Melding() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [melding, setMelding] = useState()
  const [license, setLicense] = useState()

  useEffect(() => {
    setLicense(localStorage.getItem('LicenseKey'))
  })

  if (license) {
    db.collection('Kunder')
      .doc(license)
      .collection('Tavle')
      .doc('--info--')
      .onSnapshot((docSnapshot) => {
        setMelding(docSnapshot.data().melding)
      })
  }

  return (
    <div className={styles.meldingBox}>
      <h1>{melding}</h1>
    </div>
  )
}
