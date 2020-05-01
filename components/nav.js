import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from '../styles/nav.module.scss'

export default function Nav() {
  const router = useRouter()

  return (
    <nav className={styles.container}>
      <Link href='/'>
        <a className={styles.link}>
          <div className={router.pathname == '/' ? styles.active : styles.nav}>
            <p>Sjekk inn</p>
          </div>
        </a>
      </Link>

      <Link href='/registrer'>
        <a className={styles.link}>
          <div
            className={
              router.pathname == '/registrer' ? styles.active : styles.nav
            }>
            <p>Registrer</p>
          </div>
        </a>
      </Link>

      <Link href='/sok'>
        <a className={styles.link}>
          <div
            className={router.pathname == '/sok' ? styles.active : styles.nav}>
            <p>Søk opp bruker</p>
          </div>
        </a>
      </Link>
    </nav>
  )
}
