import React, { useState } from 'react'
import Router from 'next/router'
import { loadFirebase } from '../lib/firebase'

import styles from '../styles/user.module.scss'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function bruker({ navn, brukernummer }) {
  const [open, setOpen] = useState(false)
  const [dialogData, setData] = useState({})

  const handleOpen = (title, message) => {
    setData({ title: title, message: message })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const firebase = loadFirebase()
  const db = firebase.firestore()

  const increment = firebase.firestore.FieldValue.increment(1)

  function innsjekk(brukernummer) {
    handleOpen(`Pling plong! Tenker bare litt...`, ``)

    db.collection('Kunder')
      .doc(process.env.LICENSE_KEY)
      .collection('Brukere')
      .doc(brukernummer.toString())
      .collection('Innsjekk')
      .doc('--stats--')
      .get()
      .then((doc) => {
        const count = (doc.data().count += 1)

        db.collection('Kunder')
          .doc(process.env.LICENSE_KEY)
          .collection('Brukere')
          .doc(brukernummer.toString())
          .get()
          .then((doc) => {
            const globalStatsRef = db
              .collection('Kunder')
              .doc(process.env.LICENSE_KEY)
              .collection('Brukere')
              .doc('--stats--')

            const statsRef = db
              .collection('Kunder')
              .doc(process.env.LICENSE_KEY)
              .collection('Brukere')
              .doc(brukernummer.toString())
              .collection('Innsjekk')
              .doc('--stats--')

            const userRef = db
              .collection('Kunder')
              .doc(process.env.LICENSE_KEY)
              .collection('Brukere')
              .doc(brukernummer.toString())
              .collection('Innsjekk')
              .doc(count.toString())

            const dato = new Date()
            const klokkeslett = dato.getHours()
            const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

            const batch = db.batch()

            batch.set(statsRef, { count: increment }, { merge: true })
            batch.set(globalStatsRef, { innsjekkCount: increment }, { merge: true })
            batch.set(userRef, { dato: idag, klokkeslett: klokkeslett })
            batch
              .commit()
              .then(() => {
                handleOpen(
                  `Velkommen, ${doc.data().fornavn}!`,
                  `Du er nå sjekket inn, og har besøkt oss totalt ${count} ganger!`
                )

                setTimeout(() => {
                  Router.push('/')
                }, 3000)
              })
              .catch((error) => {
                handleOpen(
                  'Error',
                  `Beep! Boop! Nå skjedde det visst en feil. Prøv igjen senere. (${error})`
                )
                setTimeout(() => {
                  Router.push('/')
                }, 3000)
              })
          })
      })
      .catch((error) => {
        handleOpen(`Hmmmm...`, `Merkelig, men jeg kan finne deg i systemet. Har du registrert deg?`)

        setTimeout(() => {
          Router.push('/')
        }, 3000)
      })
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>{dialogData.title}</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p className={styles.modalText}>{dialogData.message}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <div className={styles.card}>
        <p>{brukernummer}</p>
        <h1>{navn}</h1>
        <button onTouchStart={(e) => innsjekk(brukernummer)}>Sjekk inn</button>
      </div>
    </>
  )
}
