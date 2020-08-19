import { useState, useEffect } from 'react'
import { loadFirebase } from '../lib/firebase'
import Router from 'next/router'
import styles from '../styles/layout.module.scss'

export default function LisensPage() {
  const [license, setLicens] = useState()
  const onChange = (e) => setLicens(e.target.value)

  const firebase = loadFirebase()
  const db = firebase.firestore()

  function checkLicense(arg) {
    db.collection('Kunder')
      .doc(license)
      .get()
      .then((doc) => {
        if (doc.exists) {
          const dato = new Date()
          const idagDato =
            dato.getFullYear() + `${dato.getMonth() + 1}`.padStart(2, '0') + dato.getDate()
          const lisensDato = new Date(doc.data().lisens.dato)

          const lisensDatoFormattet =
            lisensDato.getFullYear() +
            `${lisensDato.getMonth() + 1}`.padStart(2, '0') +
            lisensDato.getDate()

          if (lisensDatoFormattet > idagDato) {
            if (
              doc.data().domene == window.location.origin ||
              doc.data().domene == 'http://localhost:3000'
            ) {
              localStorage.setItem('LicenseKey', license)
              alert('Lisensen er lagt til')
              if (arg == 'display') {
                Router.push('/display')
              } else {
                Router.push('/')
              }
            } else {
              alert('Domenet stemmer ikke med det som er registrert')
            }
          } else {
            alert('Lisensen har utgått')
          }
        } else {
          alert('Ugylig lisens')
        }
      })
  }

  return (
    <>
      <div className={styles.content}>
        <p className={styles.title}>SKRIV INN DIN LISENSNØKKEL:</p>
        <main className={styles.main}>
          <input
            type='text'
            placeholder='Lisensnøkkel'
            name='lisensKey'
            value={license}
            onChange={onChange}
          />
          <button onClick={() => checkLicense()}>OK</button>
          <button onClick={() => checkLicense('display')}>GÅ TIL DISPLAY</button>
        </main>
      </div>

      <style jsx>
        {`
          input {
            height: 40px;
            width: 40%;
            font-size: 25px;
            color: #0f152d;
            border: none;
            border-radius: 0px;
            outline: none;
            padding: 10px;
          }

          button {
            padding: 0px 40px;
            margin-left: 20px;
            border: none;
            border-radius: 0px;
            outline: none;

            background-color: #a6d89b;
            color: #0f152d;
            font-weight: bold;
            font-size: 20px;
          }
        `}
      </style>
    </>
  )
}
