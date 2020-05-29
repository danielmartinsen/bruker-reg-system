import styles from '../../styles/display/infobox.module.scss'
import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState } from 'react'

export default function AntallBrukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [antall, setAntall] = useState([])

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')
    const dato = new Date()
    const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

    db.collection('Kunder')
      .doc(license)
      .collection('Brukere')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.doc.data().stats !== true) {
            if (change.doc.data().innsjekk.dato == idag) {
              if (antall.indexOf(change.doc.id) !== -1) {
              } else {
                setAntall([...antall, change.doc.id])
              }
            }
          }
        })
      })
  })

  return (
    <div className={styles.infoBox}>
      <h3>Antall besøk i dag:</h3>
      <h1>{antall.length}</h1>
      <p>
        {antall.map((id) => {
          return <p>{id}</p>
        })}
      </p>
    </div>
  )
}
