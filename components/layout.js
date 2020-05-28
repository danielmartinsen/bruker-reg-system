import Head from 'next/head'
import Nav from './nav'
import styles from '../styles/layout.module.scss'
import { useEffect, useState } from 'react'
import { loadFirebase } from '../lib/firebase'
import Router from 'next/router'

const siteTitle = 'Velkommen!'

export default function Layout({ children, title }) {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [gyldig, setGyldig] = useState(true)

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')

    if (license) {
      db.collection('Kunder')
        .doc(license)
        .get()
        .then((doc) => {
          if (doc.exists) {
            const dato = new Date()
            const idagDato = dato.getFullYear() + `${dato.getMonth() + 1}` + dato.getDate()
            const lisensDato = new Date(doc.data().lisens.dato)

            const lisensDatoFormattet =
              lisensDato.getFullYear() + `${lisensDato.getMonth() + 1}` + lisensDato.getDate()

            if (lisensDatoFormattet < idagDato) {
              setGyldig(false)
            } else if (
              doc.data().domene != window.location.origin &&
              doc.data().domene != 'http://localhost:3000'
            ) {
              setGyldig(false)
            }
          } else {
            setGyldig(false)
          }
        })
    } else {
      Router.push('/lisens')
    }
  })

  return (
    <div className={styles.content}>
      <Head>
        <title>{siteTitle}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width' />
        <link
          href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;500&display=swap'
          rel='stylesheet'
        />
      </Head>
      {gyldig && (
        <>
          <p className={styles.title}>{title}</p>
          <main className={styles.main}>{children}</main>
          <Nav />
        </>
      )}

      {!gyldig && <p className={styles.title}>Ugyldig lisens</p>}
    </div>
  )
}
