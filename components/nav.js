import Link from 'next/link'
import styles from '../styles/nav.module.scss'

export default function nav() {
  return (
    <nav className={styles.container}>
      <Link href='/'>
        <a className={styles.link}>
          <div className={styles.nav}>
            <p>Sjekk inn</p>
          </div>
        </a>
      </Link>

      <Link href='/registrer'>
        <a className={styles.link}>
          <div className={styles.nav}>
            <p>Registrer</p>
          </div>
        </a>
      </Link>

      <Link href='/sok'>
        <a className={styles.link}>
          <div className={styles.nav}>
            <p>Søk opp bruker</p>
          </div>
        </a>
      </Link>
    </nav>
  )
}
