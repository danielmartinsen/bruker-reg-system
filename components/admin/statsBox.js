import React, { useState, useEffect } from 'react'
import styles from '../../styles/admin/statsbox.module.scss'
import { loadFirebase } from '../../lib/firebase'

export default function Stats({ title, info, color }) {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [message, setMessage] = useState('')
  const [btnText, setText] = useState('OK')

  var license = ''
  useEffect(() => {
    license = localStorage.getItem('LicenseKey')
  })

  function updateMessage(e) {
    db.collection('Kunder')
      .doc(license)
      .collection('Tavle')
      .doc('--info--')
      .update({ melding: message })
      .then(() => {
        setText('Oppdater!')
        setTimeout(() => {
          setText('OK')
        }, 1500)
      })
  }

  return (
    <>
      <div className={styles.box}>
        <p>{title}</p>
        {info == 'input' ? (
          <>
            <input
              type='text'
              name='dagensMelding'
              placeholder='Melding...'
              className={styles.input}
              onChange={(e) => setMessage(e.target.value)}
            />
            <input
              type='button'
              className={styles.button}
              onClick={() => updateMessage()}
              value={btnText}
            />
          </>
        ) : (
          <h1>{info}</h1>
        )}
      </div>

      <style jsx>
        {`
          div {
            background-color: #${color};
          }
        `}
      </style>
    </>
  )
}
