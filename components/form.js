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

  const handleOpen = (fornavn, brukernummer) => {
    setData({ fornavn: fornavn, brukernummer: brukernummer })
    setOpen(true)
  }

  const handleClose = () => setOpen(false)

  const onSubmit = (data) => {
    if (data.fornavn && data.etternavn && data.telefon && data.bursdag && data.kjonn) {
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

          const batch = db.batch()

          batch.set(statsRef, { userCount: increment }, { merge: true })
          batch.set(userRef, data)
          batch
            .commit()
            .then(() => {
              handleOpen(data.fornavn, newUserID)

              setTimeout(() => {
                Router.push('/')
              }, 3000)
            })
            .catch((error) => {
              alert(`Beep! Boop! Nå skjedde det visst en feil. Prøv igjen senere. (${error})`)
            })
        })
        .catch((error) => {
          console.log > error
        })
    } else {
      alert('Vennligst fyll ut alle feltene!')
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} disableBackdropClick>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Velkommen, {regData.fornavn}!</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p className={styles.modalText}>
              Du er nå registrert og sjekket inn.
              <br />
              Brukernummeret ditt er <b>{regData.brukernummer}</b>. Dette trenger du neste gang du
              sjekker inn.
            </p>
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
