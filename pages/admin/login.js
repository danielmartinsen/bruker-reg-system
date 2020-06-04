import React, { useState, useEffect } from 'react'
import styles from '../../styles/admin/login.module.scss'
import Router from 'next/router'
import { loadFirebase } from '../../lib/firebase'

export default function Login() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [feedback, setFeedback] = useState()

  const [license, setLicense] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (localStorage.getItem('Login') == 'true') {
      Router.push('/admin')
    }
  })

  useEffect(() => {
    setLicense(localStorage.getItem('LicenseKey'))
  }, [])

  function userLogin() {
    if (license != '' && username != '' && password != '') {
      db.collection('Kunder')
        .doc(license)
        .get()
        .then((doc) => {
          if (doc.exists) {
            if (
              doc.data().login.brukernavn.toLowerCase() == username.toLowerCase() &&
              doc.data().login.passord == password
            ) {
              localStorage.setItem('LicenseKey', license)
              localStorage.setItem('Login', true)
              Router.push('/admin')
            } else {
              setFeedback('Feil brukernavn eller passord')
            }
          } else {
            setFeedback('Hmmm... Finner ikke lisensen i systemet, prøv igjen')
          }
        })
    } else {
      setFeedback('Vennligst fyll ut alle feltene')
    }
  }

  return (
    <div>
      <div className={styles.loginForm}>
        <h1>Logg inn</h1>

        <input
          type='text'
          name='lisens'
          placeholder='Lisens'
          onChange={(e) => setLicense(e.target.value)}
          value={license}
        />
        <input
          type='text'
          name='brukernavn'
          placeholder='Brukernavn'
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type='password'
          name='passord'
          placeholder='Passord'
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={() => userLogin()}>Logg inn</button>

        <p>{feedback}</p>
      </div>

      <style jsx global>
        {`
          body,
          html {
            background-color: #f1f2fa;
            color: #0f152d;
          }
        `}
      </style>
    </div>
  )
}
