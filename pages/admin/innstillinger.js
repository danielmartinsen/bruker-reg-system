import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { loadFirebase } from '../../lib/firebase'
import { useForm } from 'react-hook-form'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

import AppBar from '@material-ui/core/AppBar'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Typography from '@material-ui/core/Typography'
import Box from '@material-ui/core/Box'

import styles from '../../styles/admin/innstillinger.module.scss'
import Layout from '../../components/admin/layout'
import Table from '../../components/admin/table'

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role='tabpanel'
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}>
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
}

export default function Innstillinger() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const [tab, setTab] = useState(0)

  const handleChange = (event, newValue) => {
    setTab(newValue)
  }

  const [open, setOpen] = useState(false)
  const [feedback, setFeedback] = useState('')
  const [passord, setPassord] = useState('')
  const handleOpen = () => setOpen(true)
  const handleClose = () => {
    setOpen(false)
    setFeedback('')
  }

  const [addOpen, setAddOpen] = useState(false)
  const handleAddOpen = () => setAddOpen(true)
  const handleAddClose = () => setAddOpen(false)

  const [editOpen, setEditOpen] = useState(false)
  const handleEditOpen = (dag) => {
    setCurrentTilbud(dag)
    setEditOpen(true)
  }
  const handleEditClose = () => {
    setCurrentTilbud('')
    setEditOpen(false)
  }

  const [tilbudNavn, setTilbudNavn] = useState('')
  const [tilbud, setTilbud] = useState([])
  const [currentTilbud, setCurrentTilbud] = useState('')
  const [data, setData] = useState()

  const { register, handleSubmit, errors } = useForm()
  const onSubmit = (data) => console.log(data)

  useEffect(() => {
    loadInfo()
    loadTilbud()
  }, [])

  function loadInfo() {
    const license = localStorage.getItem('LicenseKey')
    db.collection('Kunder')
      .doc(license)
      .get()
      .then((doc) => {
        const lisensDato = new Date(doc.data().lisens.dato)
        const lisensDatoReadable =
          lisensDato.getDate() +
          '.' +
          `${lisensDato.getMonth() + 1}` +
          '.' +
          lisensDato.getFullYear()
        const result = doc.data()
        result.lisensReadable = lisensDatoReadable

        setData(result)
      })
  }

  function handleEditInfo(field) {
    const value = prompt(`Endre ${field}:`)
    if (value != null) {
      editInfo(field, value)
    }
  }

  function editInfo(field, value) {
    const license = localStorage.getItem('LicenseKey')

    if (field == 'passord') {
      var updatedValue = { login: { brukernavn: data.login.brukernavn, passord: value } }
    } else {
      var updatedValue = { [field]: value }
    }

    db.collection('Kunder')
      .doc(license)
      .update(updatedValue)
      .then(() => {
        loadInfo()
      })
  }

  function deleteInfo() {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .get()
      .then((doc) => {
        if (doc.data().login.passord == passord) {
          setFeedback('')

          db.collection('Kunder')
            .doc(license)
            .collection('Brukere')
            .get()
            .then((res) => {
              res.forEach((element) => {
                if (element.ref.id == '--stats--') {
                  element.ref.set({ innsjekkCount: 0, stats: true, userCount: 0 })
                } else {
                  element.ref.delete()
                }
              })
            })

          db.collection('Kunder')
            .doc(license)
            .collection('Logg')
            .get()
            .then((res) => {
              res.forEach((element) => {
                if (element.ref.id != '--stats--') {
                  element.ref.delete()
                }
              })
              handleClose()
            })
        } else {
          setFeedback('Feil passord!')
        }
      })
  }

  function addTilbud() {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Tilbud')
      .doc(tilbudNavn)
      .set({ navn: tilbudNavn })
      .then(() => {
        handleAddClose()
        loadTilbud()
      })
  }

  function loadTilbud() {
    const license = localStorage.getItem('LicenseKey')
    const tilbud = []

    db.collection('Kunder')
      .doc(license)
      .collection('Tilbud')
      .get()
      .then((snapshot) => {
        snapshot.forEach((doc) => {
          if (doc.id != '--config--') {
            tilbud.push(doc.data().navn)
          }
        })
        setTilbud(tilbud)
      })
  }

  return (
    <Layout>
      {/* Dialog: Reset og start ny periode */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>
            Helt sikker på at du vil slette all statistikk for perioden?
          </h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <p>
              Du er nå i ferd med å slette all statistikk og starte en ny periode. Dette medfører at
              alle brukere, og besøksloggen slettes, ansatte og tilbud beholdes. Bekreft bare dette
              om du er helt sikker på hva du gjør. Husk å laste ned periode-rapporten først!
            </p>
            <input
              type='password'
              name='navn'
              placeholder='Skriv inn admin-passordet for å bekrefte'
              className={styles.addInput}
              onChange={(e) => setPassord(e.target.value)}
              autoComplete='off'
            />
            <input
              type='button'
              value='Bekreft og slett'
              className={styles.addButton}
              onClick={() => deleteInfo()}
            />
            <input
              type='button'
              value='Avbryt'
              className={styles.addButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleClose()}
            />
            <p>{feedback}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Legg til et tilbud */}
      <Dialog open={addOpen} onClose={handleAddClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Legg til et tilbud</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <input
              type='text'
              name='tilbudNavn'
              placeholder='Navn'
              className={styles.addInput}
              onChange={(e) => setTilbudNavn(e.target.value)}
              autoComplete='off'
            />
            <input
              type='button'
              value='Legg til'
              className={styles.addButton}
              onClick={() => addTilbud()}
            />
            <input
              type='button'
              value='Avbryt'
              className={styles.addButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleAddClose()}
            />
            <p>{feedback}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      {/* Endre tilbud dag */}
      <Dialog open={editOpen} onClose={handleEditClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Legg til tilbud</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input type='time' placeholder='Fra' name='Fra' ref={register} />
              <input type='time' placeholder='Til' name='Til' ref={register} />
              <select name='Tilbud' ref={register}>
                {tilbud.map((entry) => {
                  return <option value={entry}>{entry}</option>
                })}
              </select>

              <input type='submit' value='Legg til' className={styles.addButton} />
              <input
                type='button'
                value='Avbryt'
                className={styles.addButton}
                style={{ marginLeft: 10 }}
                onClick={() => handleEditClose()}
              />
            </form>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <div>
        <div className={styles.infoDiv}>
          <h2>{data ? data.navn : 'Loading'}</h2>
          <p>{data ? 'Kommune: ' + data.kommune : 'Loading'}</p>
          <p>{data ? 'Lisensen utgår ' + data.lisensReadable : 'Loading'}</p>
        </div>

        <div className={styles.infoDiv}>
          <h2>Login-detaljer</h2>
          <p>{data ? 'Brukernavn: ' + data.login.brukernavn : 'Loading'}</p>
          <p>{data ? 'Passord: ' + data.login.passord : 'Loading'}</p>
        </div>

        <div className={styles.infoDivLogo}>
          <img src={data && data.logo} height='100px' />
        </div>

        <div className={styles.buttonDiv}>
          <button onClick={() => handleEditInfo('navn')}>Endre navn</button>
          <button onClick={() => handleEditInfo('kommune')}>Endre kommune</button>
          <button onClick={() => handleEditInfo('logo')}>Endre logo</button>
          <button onClick={() => handleEditInfo('passord')}>Endre passord</button>
        </div>
        <p>
          For å fornye lisensen sender du en e-post til{' '}
          <a
            href={`mailto:ureg@martinsendev.no?subject=Forny lisens&body=Hei, jeg ønsker å fornye lisensen vår på U-reg %0D%0A%0D%0AKommune: ${
              data ? data.kommune : ''
            } %0D%0AUngdomsklubb: ${data ? data.navn : ''}`}>
            ureg@martinsendev.no
          </a>
        </p>
      </div>
      <div style={{ marginTop: 30, width: '100%' }}>
        <h2>Åpningstider og tilbud</h2>
        <p>
          Har ungdomsklubben din forskjellige tilbud med forskjellige åpningstider? Da kan du legge
          til forksjellige tilbud her, og skille dette i rapportene og statistikken.
        </p>

        <AppBar
          position='static'
          style={{ backgroundColor: '#fa8a8a', color: '#0f152d', marginTop: 30 }}>
          <Tabs value={tab} onChange={handleChange}>
            <Tab style={{ fontWeight: 700 }} label='Alle tilbud' />
            <Tab style={{ fontWeight: 700 }} label='Mandag' />
            <Tab style={{ fontWeight: 700 }} label='Tirsdag' />
            <Tab style={{ fontWeight: 700 }} label='Onsdag' />
            <Tab style={{ fontWeight: 700 }} label='Torsdag' />
            <Tab style={{ fontWeight: 700 }} label='Fredag' />
          </Tabs>
        </AppBar>
        <TabPanel value={tab} index={0}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {tilbud.map((entry) => {
              return (
                <div
                  style={{
                    padding: '5px 20px',
                    margin: 10,
                    border: '2px solid black',
                    width: '43%',
                  }}>
                  <h2>{entry}</h2>
                  <a>Slett</a>
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 15 }} className={styles.buttonDiv}>
            <button onClick={() => handleAddOpen()}>Legg til et tilbud</button>
            <button>Last ned periode-rapport</button>
            <button onClick={() => handleOpen()}>Slett statistikk og start ny periode</button>
          </div>
        </TabPanel>

        {[1, 2, 3, 4, 5].map((dag) => {
          return (
            <TabPanel value={tab} index={dag}>
              <Table dag={dag} />
              <div style={{ marginTop: 15 }} className={styles.buttonDiv}>
                <button onClick={() => handleEditOpen({ dag })}>Legg til</button>
              </div>
            </TabPanel>
          )
        })}
      </div>
    </Layout>
  )
}
