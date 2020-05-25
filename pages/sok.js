import Layout from '../components/layout'
import UserSearch from '../components/userSearch'
import { loadFirebase } from '../lib/firebase'

export async function getServerSideProps() {
  const firebase = await loadFirebase()
  const db = firebase.firestore()

  const result = await new Promise((resolve, reject) => {
    db.collection('Kunder')
      .doc(process.env.LICENSE_KEY)
      .collection('Brukere')
      .get()
      .then((snapshot) => {
        const data = []

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
        resolve(data)
      })
      .catch((error) => {
        console.log(error)
      })
  })
  return { props: { result } }
}

export default function Home({ result }) {
  return (
    <Layout title='Begynn å skrive inn navnet ditt'>
      <UserSearch data={result} />
    </Layout>
  )
}
