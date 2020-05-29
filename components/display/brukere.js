import styles from '../../styles/display/infobox.module.scss'
import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState, useRef } from 'react'

export default function AntallBrukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [antall, setAntall] = useState([])

  const dato = new Date()
  const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')

    return db
      .collection('Kunder')
      .doc(license)
      .collection('Logg')
      .doc(idag)
      .onSnapshot((docSnapshot) => {
        var antallBrukere = 0
        for (var bruker in docSnapshot.data()) {
          if (docSnapshot.data()[bruker].dato == idag) {
            antallBrukere++
            setAntall(antallBrukere)
          }
        }
      })
  }, [])

  return (
    <div className={styles.infoBox}>
      <h3>Antall besøk i dag:</h3>
      <h1>{antall}</h1>
    </div>
  )
}
