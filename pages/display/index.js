import { useEffect } from 'react'
import AntallBrukere from '../../components/display/brukere'
import Jobber from '../../components/display/jobber'
import Melding from '../../components/display/melding'
import Router from 'next/router'

import styles from '../../styles/display/index.module.scss'

export default function Display() {
  useEffect(() => {
    if (localStorage.getItem('LicenseKey')) {
    } else {
      Router.push('/lisens')
    }
  })

  return (
    <>
      <div className={styles.wrapper}>
        <AntallBrukere />
        <Jobber />
      </div>
      <Melding />
    </>
  )
}
