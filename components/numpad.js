import React, { useEffect, useState } from 'react'
import styles from '../styles/numpad.module.scss'
import Router from 'next/router'

import { loadFirebase } from '../lib/firebase'
import { loadCSS } from 'fg-loadcss'

import Icon from '@material-ui/core/Icon'
import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function numpad() {
  useEffect(() => {
    loadCSS(
      'https://use.fontawesome.com/releases/v5.12.0/css/all.css',
      document.querySelector('#font-awsome-css')
    )
  }, [])

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

  var startNumber = 0

  function numClick(action) {
    const input = document.getElementById('brukernummer')

    if (action == 'refresh') {
      input.value = ''
      startNumber = 0
    } else if (action == 'back') {
      input.value = input.value.slice(0, -1)
      startNumber--
    } else {
      startNumber++
      input.value += action

      if (startNumber == 3) {
        const brukernummer = input.value
        innsjekk(brukernummer)
        input.value = ''
      }
    }
  }

  function innsjekk(brukernummer) {
    handleOpen(`Pling plong! Tenker bare litt...`, ``)

    if (brukernummer[0] == 9) {
      const dato = new Date()
      const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

      db.collection('Kunder')
        .doc(process.env.LICENSE_KEY)
        .collection('Ansatte')
        .doc(brukernummer.toString())
        .get()
        .then((doc) => {
          if (doc.exists) {
            db.collection('Kunder')
              .doc(process.env.LICENSE_KEY)
              .collection('Ansatte')
              .doc(brukernummer.toString())
              .update({
                jobb: {
                  dato: idag,
                  state: true,
                },
              })
              .then(() => {
                handleOpen(`Velkommen på jobb!`, `Du er registrert og sjekket inn for dagen.`)

                setTimeout(() => {
                  handleClose()
                }, 3000)
              })
              .catch((error) => {
                handleOpen(`Hmmmm...`, `Jeg klarte ikke å sjekk deg inn, prøv igjen litt senere.`)

                setTimeout(() => {
                  handleClose()
                }, 3000)
              })
          } else {
            handleOpen(`Hmmmm...`, `Merkelig, men jeg kan finne deg i systemet.`)

            setTimeout(() => {
              handleClose()
            }, 3000)
          }
        })
    } else {
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
                    handleClose()
                  }, 3000)
                })
                .catch((error) => {
                  handleOpen(
                    'Error',
                    `Beep! Boop! Nå skjedde det visst en feil. Prøv igjen senere. (${error})`
                  )
                  setTimeout(() => {
                    handleClose()
                  }, 3000)
                })
            })
        })
        .catch((error) => {
          handleOpen(
            `Hmmmm...`,
            `Merkelig, men jeg kan finne deg i systemet. Har du registrert deg?`
          )

          setTimeout(() => {
            handleClose()
          }, 3000)
        })
    }
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

      <div className={styles.container}>
        <input
          type='text'
          name='brukernummer'
          id='brukernummer'
          className={styles.input}
          placeholder='Tast brukernummeret ditt'
          disabled
        />

        <div className={styles.row}>
          <button className={styles.number} onTouchStart={(e) => numClick(1)}>
            1
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(2)}>
            2
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(3)}>
            3
          </button>
        </div>

        <div className={styles.row}>
          <button className={styles.number} onTouchStart={(e) => numClick(4)}>
            4
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(5)}>
            5
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(6)}>
            6
          </button>
        </div>

        <div className={styles.row}>
          <button className={styles.number} onTouchStart={(e) => numClick(7)}>
            7
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(8)}>
            8
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(9)}>
            9
          </button>
        </div>

        <div className={styles.row}>
          <button className={styles.number} onTouchStart={(e) => numClick('refresh')}>
            <Icon className='fa fa-sync-alt' />
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick(0)}>
            0
          </button>
          <button className={styles.number} onTouchStart={(e) => numClick('back')}>
            <Icon className='fa fa-arrow-left' />
          </button>
        </div>
      </div>
    </>
  )
}
