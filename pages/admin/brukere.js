import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import Layout from '../../components/admin/layout'
import MaterialTable, { MTableToolbar } from 'material-table'
import SearchIcon from '@material-ui/icons/Search'
import ClearIcon from '@material-ui/icons/Clear'
import ArrowIcon from '@material-ui/icons/ArrowDropDown'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'

export default function Brukere() {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [brukere, setBrukere] = useState([])

  var license
  useEffect(() => {
    license = localStorage.getItem('LicenseKey')
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
              actions: [<EditIcon />, <DeleteIcon />],
            })
          }
        })
        setBrukere(brukere.sort((a, b) => (a.navn > b.navn ? 1 : -1)))
      })
  }

  return (
    <Layout>
      <MaterialTable
        title='Brukere'
        style={{ width: '100%' }}
        columns={[
          { title: 'Navn', field: 'navn' },
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
          headerStyle: { backgroundColor: '#f1f2fa', fontWeight: 'bold', padding: '5px 16px' },
          searchFieldStyle: { border: '2px solid #0F152D', padding: 3 },
        }}
        icons={{
          Search: () => <SearchIcon />,
          ResetSearch: () => <ClearIcon />,
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
            <div style={{ backgroundColor: '#f1f2fa' }}>
              <MTableToolbar {...props} style={{ width: '100%' }} />
            </div>
          ),
        }}
      />
    </Layout>
  )
}
