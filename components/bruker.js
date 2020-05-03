import styles from '../styles/bruker.module.scss'

export default function bruker({ navn, brukerid }) {
  return (
    <div className={styles.card}>
      <p>{brukerid}</p>
      <h1>{navn}</h1>
      <button>Sjekk inn</button>
    </div>
  )
}
