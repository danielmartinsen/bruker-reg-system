import React, { useEffect, useState } from 'react'
import { loadFirebase } from '../../lib/firebase'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'

import styles from '../../styles/admin/table.module.scss'
import Row from './tableRow'

export default function kundeTable({ dag }) {
  const firebase = loadFirebase()
  const db = firebase.firestore()
  const [rows, setRows] = useState([])

  useEffect(() => {
    loadTilbud()
  }, [])

  function loadTilbud() {
    const license = localStorage.getItem('LicenseKey')
    const items = []

    db.collection('Kunder')
      .doc(license)
      .collection('Tilbud')
      .doc('--config--')
      .get()
      .then((doc) => {
        const result = doc.data()[dag]

        for (var tilbud in result) {
          items.push(
            <Row row={{ klokkeslett: tilbud, navn: result[tilbud].tilbud }} key={tilbud} />
          )
        }
        setRows(items)
      })
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead className={styles.tableHeader}>
          <TableRow>
            <TableCell>Klokkeslett</TableCell>
            <TableCell>Tilbud</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody className={styles.tableBody}>{rows}</TableBody>
      </Table>
    </TableContainer>
  )
}
