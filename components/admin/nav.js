import React from 'react'
import Link from 'next/link'
import styles from '../../styles/admin/nav.module.scss'
import Router from 'next/router'

export default function Nav() {
  function logout() {
    localStorage.setItem('Login', false)
    Router.push('/admin/login')
  }

  return (
    <div className={styles.header}>
      <h1>Administrasjon</h1>

      <div className={styles.buttongroup}>
        <Link href='/admin'>
          <button>Dashboard</button>
        </Link>
        <Link href='/admin/brukere'>
          <button>Brukere</button>
        </Link>
        <Link href='/admin/ansatte'>
          <button>Ansatte</button>
        </Link>
        <Link href='/admin/logg'>
          <button>Logg</button>
        </Link>
        <Link href='/admin/innstillinger'>
          <button>Innstillinger</button>
        </Link>
        <button onClick={() => logout()}>Logg ut</button>
      </div>
    </div>
  )
}
