import styles from '../styles/form.module.scss'

export default function form() {
  return (
    <form className={styles.registrerForm}>
      <input type='text' placeholder='Fornavn' name='Fornavn' className={styles.inputField} required />
      <input type='text' placeholder='Etternavn' name='Etternavn' className={styles.inputField} required />
      <input type='number' placeholder='Telefon' name='Telefon' className={styles.inputField} required />
      <input
        type='text'
        placeholder='Bursdag'
        name='Bursdag'
        onFocus={(e) => (e.target.type = 'date')}
        onBlur={(e) => (e.target.type = 'text')}
        className={styles.inputField}
        required
      />

      <div className={styles.registrerKjonn}>
        <input type='radio' name='kjønn' value='Gutt' id='gutt' className={styles.velgKjonn} required />
        <label for='gutt'>Gutt</label>

        <input type='radio' name='kjønn' value='Jente' id='jente' className={styles.velgKjonn} required />
        <label for='jente'>Jente</label>

        <input type='radio' name='kjønn' value='Annet' id='annet' className={styles.velgKjonn} required />
        <label for='annet'>Annet</label>
      </div>

      <button type='submit' className={styles.button}>
        Registrer meg!
      </button>
    </form>
  )
}
