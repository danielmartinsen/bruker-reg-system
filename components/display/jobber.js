import styles from '../../styles/display/infobox.module.scss'
import { loadFirebase } from '../../lib/firebase'
import { useEffect, useState } from 'react'

export default function Jobber() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [jobber, setJobb] = useState([])
  const [license, setLicense] = useState()

  const dato = new Date()
  const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

  useEffect(() => {
    setLicense(localStorage.getItem('LicenseKey'))
  })

  if (license) {
    db.collection('Kunder')
      .doc(license)
      .collection('Ansatte')
      .onSnapshot((querySnapshot) => {
        querySnapshot.docChanges().forEach((change) => {
          if (change.doc.data().stats !== true) {
            const jobbInfo = change.doc.data().jobb

            if (jobbInfo.state == true && jobbInfo.dato == idag) {
              if (jobber.indexOf(change.doc.data().bilde) !== -1) {
              } else {
                setJobb([...jobber, change.doc.data().bilde])
              }
            }
          }
        })
      })
  }

  return (
    <div className={styles.infoBox}>
      <h3>På jobb i dag:</h3>
      {jobber.map((ansatt) => {
        return <img src={ansatt} className={styles.ansattImg} key={ansatt} />
      })}
    </div>
  )
}
