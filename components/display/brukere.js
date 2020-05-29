import styles from '../../styles/display/infobox.module.scss'
import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState } from 'react'

export default function AntallBrukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [antall, setAntall] = useState([])

  const dato = new Date()
  const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

  var license = ''
  useEffect(() => {
    license = localStorage.getItem('LicenseKey')

    const update = setInterval(() => {
      db.collection('Kunder')
        .doc(license)
        .collection('Logg')
        .doc(idag)
        .get()
        .then((doc) => {
          var antallBrukere = 0
          for (var bruker in doc.data()) {
            if (doc.data()[bruker].dato == idag) {
              antallBrukere++
              setAntall(antallBrukere)
            }
          }
        })
    }, 1000)
    return () => clearInterval(update)
  }, [])

  function update() {
    console.log('Kjører nå')
    db.collection('Kunder')
      .doc(license)
      .collection('Logg')
      .doc(idag)
      .get()
      .then((doc) => {
        for (var bruker in doc.data()) {
          if (doc.data()[bruker].dato == idag) {
            if (antall.indexOf(bruker) !== -1) {
            } else {
              setAntall([...antall, bruker])
            }
          }
        }
      })
  }

  return (
    <div className={styles.infoBox}>
      <h3>Antall besøk i dag:</h3>
      <h1>{antall}</h1>
    </div>
  )
}
