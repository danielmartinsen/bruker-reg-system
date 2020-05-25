import { useState } from 'react'
import Router from 'next/router'
import { loadFirebase } from '../lib/firebase'
import styles from '../styles/form.module.scss'

import { useForm } from 'react-hook-form'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function form() {
  const [open, setOpen] = useState(false)
  const [regData, setData] = useState({})
  const { register, handleSubmit } = useForm()

  const firebase = loadFirebase()
  const db = firebase.firestore()

  const increment = firebase.firestore.FieldValue.increment(1)

  const handleOpen = (title, message) => {
    setData({ title: title, message: message })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const onSubmit = (data) => {
    if (data.fornavn && data.etternavn && data.telefon && data.bursdag && data.kjonn) {
      handleOpen(`Pling plong! Tenker bare litt...`, ``)

      db.collection('Kunder')
        .doc(process.env.LICENSE_KEY)
        .collection('Brukere')
        .doc('--stats--')
        .get()
        .then((doc) => {
          const newUserID = 100 + doc.data().userCount

          const statsRef = db
            .collection('Kunder')
            .doc(process.env.LICENSE_KEY)
            .collection('Brukere')
            .doc('--stats--')

          const userRef = db
            .collection('Kunder')
            .doc(process.env.LICENSE_KEY)
            .collection('Brukere')
            .doc(newUserID.toString())

          const userStatsRef = db
            .collection('Kunder')
            .doc(process.env.LICENSE_KEY)
            .collection('Brukere')
            .doc(newUserID.toString())
            .collection('Innsjekk')
            .doc('--stats--')

          const batch = db.batch()

          batch.set(statsRef, { userCount: increment }, { merge: true })
          batch.set(userRef, data)
          batch.set(userStatsRef, { count: 0 })
          batch
            .commit()
            .then(() => {
              handleOpen(
                `Velkommen, ${data.fornavn}!`,
                `Du er nå registrert og sjekket inn. Brukernummeret ditt er ${newUserID}. Dette trenger du neste gang du sjekker inn.`
              )

              innsjekk(newUserID)

              setTimeout(() => {
                Router.push('/')
              }, 3000)
            })
            .catch((error) => {
              handleOpen('Error', `Beep! Boop! Nå skjedde det visst en feil. Prøv igjen senere.`)
              setTimeout(() => {
                handleClose()
              }, 3000)
            })
        })
        .catch((error) => {
          console.log(error)
        })
    } else {
      handleOpen('Error', 'Du må fylle ut alle feltene for å registrere deg!')
      setTimeout(() => {
        handleClose()
      }, 3000)
    }
  }

  function innsjekk(brukernummer) {
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
            batch.commit().catch((error) => {
              handleOpen(
                `Hmmmm...`,
                `Merkelig, men jeg får ikke sjekket deg inn. Prøv å skriv inn brukernummeret ditt.`
              )

              setTimeout(() => {
                Router.push('/')
              }, 3000)
            })
          })
      })
      .catch((error) => {
        handleOpen(
          `Hmmmm...`,
          `Merkelig, men jeg får ikke sjekket deg inn. Prøv å skriv inn brukernummeret ditt.`
        )

        setTimeout(() => {
          Router.push('/')
        }, 3000)
      })
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>{regData.title}</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p className={styles.modalText}>{regData.message}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <form onSubmit={handleSubmit(onSubmit)} className={styles.registrerForm}>
        <div className={styles.container}>
          <input
            type='text'
            placeholder='Fornavn'
            name='fornavn'
            className={styles.inputField}
            ref={register}
            autoComplete='off'
          />
          <input
            type='text'
            placeholder='Etternavn'
            name='etternavn'
            className={styles.inputField}
            ref={register}
            autoComplete='off'
          />
        </div>

        <div className={styles.container}>
          <input
            type='number'
            placeholder='Telefon'
            name='telefon'
            className={styles.inputField}
            ref={register}
          />
          <input
            type='text'
            placeholder='Bursdag'
            name='bursdag'
            onFocus={(e) => (e.target.type = 'date')}
            onBlur={(e) => (e.target.type = 'text')}
            className={styles.inputField}
            ref={register}
          />
        </div>

        <div className={styles.container}>
          <input
            type='radio'
            name='kjonn'
            value='Gutt'
            id='gutt'
            className={styles.velgKjonn}
            ref={register}
          />
          <label htmlFor='gutt'>Gutt</label>

          <input
            type='radio'
            name='kjonn'
            value='Jente'
            id='jente'
            className={styles.velgKjonn}
            ref={register}
          />
          <label htmlFor='jente'>Jente</label>

          <input
            type='radio'
            name='kjonn'
            value='Annet'
            id='annet'
            className={styles.velgKjonn}
            ref={register}
          />
          <label htmlFor='annet'>Annet</label>
        </div>

        <button className={styles.button}>Registrer meg!</button>
      </form>
    </>
  )
}
