import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import styles from '../../styles/admin/ansatte.module.scss'
import Layout from '../../components/admin/layout'
import Ansatt from '../../components/admin/ansattBox'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function Ansatte() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [ansatte, setAnsatte] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const [navn, setNavn] = useState('')
  const [bilde, setBilde] = useState('')
  const [feedback, setFeedback] = useState('')

  const increment = firebase.firestore.FieldValue.increment(1)

  var license
  useEffect(() => {
    license = localStorage.getItem('LicenseKey')
    loadAnsatte()
  }, [])

  function loadAnsatte() {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Ansatte')
      .get()
      .then((snapshot) => {
        const ansatte = []

        snapshot.forEach((doc) => {
          if (!doc.data().stats) {
            ansatte.push({ id: doc.id, navn: doc.data().navn, bilde: doc.data().bilde })
          }
        })
        setAnsatte(ansatte)
      })
  }

  function addAnsatt() {
    const license = localStorage.getItem('LicenseKey')

    if (navn != '' && bilde != '') {
      db.collection('Kunder')
        .doc(license)
        .collection('Ansatte')
        .doc('--stats--')
        .get()
        .then((doc) => {
          const NewID = (doc.data().count + 900).toString()
          const AnsattRef = db.collection('Kunder').doc(license).collection('Ansatte').doc(NewID)
          const StatsRef = db
            .collection('Kunder')
            .doc(license)
            .collection('Ansatte')
            .doc('--stats--')

          const batch = db.batch()

          batch.set(AnsattRef, { bilde: bilde, navn: navn, jobb: { state: false, dato: '' } })
          batch.set(StatsRef, { count: increment }, { merge: true })

          batch.commit().then(() => {
            setBilde('')
            setNavn('')
            loadAnsatte()
            handleClose()
          })
        })
    } else {
      setFeedback('Vennligst fyll ut alle feltene')
    }
  }

  return (
    <Layout>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Legg til ansatt</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <input
              type='text'
              name='navn'
              placeholder='Navn'
              className={styles.addInput}
              onChange={(e) => setNavn(e.target.value)}
              autoComplete='off'
            />
            <input
              type='text'
              name='bilde'
              placeholder='Bilde (URL)'
              className={styles.addInput}
              onChange={(e) => setBilde(e.target.value)}
              autoComplete='off'
            />
            <input
              type='button'
              value='Legg til'
              className={styles.addButton}
              onClick={() => addAnsatt()}
            />
            <input
              type='button'
              value='Lukk'
              className={styles.addButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleClose()}
            />
            <p>{feedback}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <button className={styles.addBtn} onClick={() => handleOpen()}>
        Legg til ny ansatt
      </button>

      <div className={styles.break} />

      {ansatte.map((ansatt) => {
        return <Ansatt navn={ansatt.navn} nummer={ansatt.id} bilde={ansatt.bilde} />
      })}
    </Layout>
  )
}
