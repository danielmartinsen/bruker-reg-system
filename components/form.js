import styles from '../styles/form.module.scss'

export default function form() {
  return (
    <form className={styles.registrerForm}>
      <input
        type='text'
        placeholder='Fornavn'
        name='Fornavn'
        className={styles.inputField}
      />
      <input
        type='text'
        placeholder='Etternavn'
        name='Etternavn'
        className={styles.inputField}
      />
      <input
        type='number'
        placeholder='Telefon'
        name='Telefon'
        className={styles.inputField}
      />
      <input
        type='date'
        placeholder='Bursdag'
        name='Bursdag'
        className={styles.inputField}
      />

      <div className={styles.registrerKjonn}>
        <input
          type='radio'
          name='kjønn'
          value='Gutt'
          className={styles.velgKjonn}
        />
        <label>Gutt</label>

        <input
          type='radio'
          name='kjønn'
          value='Jente'
          className={styles.velgKjonn}
        />
        <label>Jente</label>

        <input
          type='radio'
          name='kjønn'
          value='Annet'
          className={styles.velgKjonn}
        />
        <label>Annet</label>
      </div>

      <button type='submit' className={styles.button}>
        Registrer meg!
      </button>
    </form>
  )
}
