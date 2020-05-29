import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState } from 'react'
import styles from '../../styles/display/stats.module.scss'

export default function Melding() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [melding, setMelding] = useState()

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Tavle')
      .doc('--info--')
      .onSnapshot((docSnapshot) => {
        setMelding(docSnapshot.data().melding)
      })
  })

  return (
    <div className={styles.meldingBox}>
      <h1>{melding}</h1>
    </div>
  )
}
