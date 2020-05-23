import styles from '../styles/form.module.scss'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import { useState } from 'react'

export default function form() {
  const [open, setOpen] = React.useState(false)

  const handleOpen = () => setOpen(true)

  const handleClose = () => setOpen(false)

  return (
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Velkommen, Daniel!</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p className={styles.modalText}>
              Du er nå registrert og sjekket inn. <br />
              Brukernummeret ditt er <b>100</b>. Dette trenger du neste gang du sjekker inn.
            </p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <form className={styles.registrerForm}>
        <div className={styles.container}>
          <input
            type='text'
            placeholder='Fornavn'
            name='Fornavn'
            className={styles.inputField}
            required
          />
          <input
            type='text'
            placeholder='Etternavn'
            name='Etternavn'
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.container}>
          <input
            type='number'
            placeholder='Telefon'
            name='Telefon'
            className={styles.inputField}
            required
          />
          <input
            type='text'
            placeholder='Bursdag'
            name='Bursdag'
            onFocus={e => (e.target.type = 'date')}
            onBlur={e => (e.target.type = 'text')}
            className={styles.inputField}
            required
          />
        </div>

        <div className={styles.container}>
          <input
            type='radio'
            name='kjønn'
            value='Gutt'
            id='gutt'
            className={styles.velgKjonn}
            required
          />
          <label htmlFor='gutt'>Gutt</label>

          <input
            type='radio'
            name='kjønn'
            value='Jente'
            id='jente'
            className={styles.velgKjonn}
            required
          />
          <label htmlFor='jente'>Jente</label>

          <input
            type='radio'
            name='kjønn'
            value='Annet'
            id='annet'
            className={styles.velgKjonn}
            required
          />
          <label htmlFor='annet'>Annet</label>
        </div>

        <button type='submit' onClick={handleOpen} className={styles.button}>
          Registrer meg!
        </button>
      </form>
    </>
  )
}
