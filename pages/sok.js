import { useEffect } from 'react'
import Layout from '../components/layout'
import UserSearch from '../components/userSearch'
import { loadFirebase } from '../lib/firebase'

export default function Sok() {
  const data = []

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')
    const firebase = loadFirebase()
    const db = firebase.firestore()

    db.collection('Kunder')
      .doc(license)
      .collection('Brukere')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.data().stats != true) {
            data.push(
              Object.assign(
                {
                  id: doc.id,
                },
                doc.data()
              )
            )
          }
        })
        console.log(data)
      })
      .catch((error) => {
        console.log(error)
      })
  })

  return (
    <Layout title='Begynn å skrive inn navnet ditt'>
      <UserSearch data={data} />
    </Layout>
  )
}
