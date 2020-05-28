import styles from '../../styles/display/infobox.module.scss'
import { loadFirebase } from '../../lib/firebase'
import { useEffect } from 'react'

export default function Jobber() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  useEffect(() => {
    var license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Brukere')
      .onSnapshot(
        (querySnapshot) => {
          querySnapshot.docChanges().forEach((change) => {
            console.log(change.doc.data())
          })
        },
        (err) => {
          console.log(`Encountered error: ${err}`)
        }
      )
  })

  return (
    <div className={styles.infoBox}>
      <h3>Antall på jobb i dag:</h3>
      <h1>16</h1>
    </div>
  )
}
