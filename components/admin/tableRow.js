import React from 'react'

import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import styles from '../../styles/admin/table.module.scss'

export default function Row({ row }) {
  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{row.klokkeslett}</TableCell>
        <TableCell>{row.navn}</TableCell>
        <TableCell>
          <button className={styles.button}>Slett</button>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
