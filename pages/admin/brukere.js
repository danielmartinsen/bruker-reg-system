import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'
import styles from '../../styles/admin/brukere.module.scss'

import Layout from '../../components/admin/layout'
import MaterialTable, { MTableToolbar } from 'material-table'
import ArrowIcon from '@material-ui/icons/ArrowDropDown'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

import Dialog from '@material-ui/core/Dialog'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'

export default function Brukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [brukere, setBrukere] = useState([])

  const [open, setOpen] = useState(false)
  const handleOpen = (data, id) => {
    setUserid(id)
    setFornavn(data.fornavn)
    setEtternavn(data.etternavn)
    setBursdag(data.bursdag)
    setTelefon(data.telefon)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  const [userid, setUserid] = useState('')
  const [fornavn, setFornavn] = useState('')
  const [etternavn, setEtternavn] = useState('')
  const [bursdag, setBursdag] = useState('')
  const [telefon, setTelefon] = useState('')
  const [feedback, setFeedback] = useState('')

  useEffect(() => {
    loadBrukere()
  }, [])

  function loadBrukere() {
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Brukere')
      .get()
      .then((snapshot) => {
        const brukere = []

        snapshot.forEach((doc) => {
          if (!doc.data().stats) {
            const dato = new Date(doc.data().bursdag)
            const datoReadable =
              dato.getDate() + '.' + `${dato.getMonth() + 1}` + '.' + dato.getFullYear()

            brukere.push({
              id: doc.id,
              navn: doc.data().fornavn + ' ' + doc.data().etternavn,
              bursdag: datoReadable,
              kjonn: doc.data().kjonn,
              telefon: doc.data().telefon,
              actions: [
                <EditIcon className={styles.icon} onClick={() => handleOpen(doc.data(), doc.id)} />,
                <DeleteIcon className={styles.icon} onClick={() => deleteBruker(doc.id)} />,
              ],
            })
          }
        })
        setBrukere(brukere.sort((a, b) => (a.navn > b.navn ? 1 : -1)))
      })
  }

  function updateBruker() {
    const license = localStorage.getItem('LicenseKey')

    if (userid != '' && fornavn != '' && etternavn != '' && bursdag != '' && telefon != '') {
      db.collection('Kunder')
        .doc(license)
        .collection('Brukere')
        .doc(userid.toString())
        .update({
          fornavn: fornavn,
          etternavn: etternavn,
          bursdag: bursdag,
          telefon: telefon,
        })
        .then(() => {
          setUserid('')
          setFornavn('')
          setEtternavn('')
          setBursdag('')
          setTelefon('')
          handleClose()
          loadBrukere()
        })
    } else {
      setFeedback('Vennligst fyll ut alle feltene!')
    }
  }

  function deleteBruker(id) {
    const license = localStorage.getItem('LicenseKey')

    if (confirm('Sikker på at du vil slette brukeren?')) {
      db.collection('Kunder')
        .doc(license)
        .collection('Brukere')
        .doc(id.toString())
        .delete()
        .then(() => {
          loadBrukere()
        })
    }
  }

  return (
    <Layout>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id='alert-dialog-title'>
          <h2 className={styles.modalTitle}>Endre en bruker</h2>
        </DialogTitle>
        <DialogContent>
          <DialogContentText id='alert-dialog-description'>
            <input
              type='text'
              name='fornavn'
              placeholder='Fornavn'
              className={styles.editInput}
              onChange={(e) => setFornavn(e.target.value)}
              value={fornavn}
              autoComplete='off'
            />
            <input
              type='text'
              name='etternavn'
              placeholder='Etternavn'
              className={styles.editInput}
              onChange={(e) => setEtternavn(e.target.value)}
              value={etternavn}
              autoComplete='off'
            />
            <input
              type='date'
              name='bursdag'
              placeholder='Bursdag'
              className={styles.editInput}
              onChange={(e) => setBursdag(e.target.value)}
              value={bursdag}
              style={{ padding: '8px 10px' }}
              autoComplete='off'
            />
            <input
              type='text'
              name='telefon'
              placeholder='Telefon'
              className={styles.editInput}
              onChange={(e) => setTelefon(e.target.value)}
              value={telefon}
              autoComplete='off'
            />

            <input
              type='button'
              value='Lagre'
              className={styles.editButton}
              onClick={() => updateBruker()}
            />
            <input
              type='button'
              value='Avbryt'
              className={styles.editButton}
              style={{ marginLeft: 10 }}
              onClick={() => handleClose()}
            />
            <p>{feedback}</p>
          </DialogContentText>
        </DialogContent>
      </Dialog>

      <MaterialTable
        title='Brukere'
        style={{ width: '100%' }}
        columns={[
          { title: 'Navn', field: 'navn', width: '30%' },
          { title: 'Brukernummer', field: 'id' },
          { title: 'Kjønn', field: 'kjonn' },
          { title: 'Bursdag', field: 'bursdag' },
          { title: 'Telefon', field: 'telefon' },
          { title: '', field: 'actions', cellStyle: { textAlign: 'right' } },
        ]}
        data={brukere}
        options={{
          search: true,
          searchFieldAlignment: 'left',
          showTitle: false,
          paging: false,
          headerStyle: { backgroundColor: '#92D7E0', fontWeight: 'bold', padding: '5px 16px' },
          searchFieldStyle: {},
        }}
        icons={{
          Search: () => <div />,
          ResetSearch: () => <div />,
          SortArrow: (props) => (
            <span {...props}>
              <ArrowIcon />
            </span>
          ),
        }}
        localization={{
          toolbar: { searchPlaceholder: 'Søk' },
          body: { emptyDataSourceMessage: 'Finner ingen brukere i systemet' },
        }}
        components={{
          Toolbar: (props) => (
            <div style={{ backgroundColor: '#92D7E0' }}>
              <MTableToolbar {...props} style={{ width: '100%' }} />
            </div>
          ),
        }}
      />

      <style jsx global>
        {`
          .MuiToolbar-gutters {
            padding-left: 16px;
          }
        `}
      </style>
    </Layout>
  )
}
