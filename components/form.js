import styles from '../styles/form.module.scss'
import React from 'react'
import Radio from '@material-ui/core/Radio'
import RadioGroup from '@material-ui/core/RadioGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import { withStyles } from '@material-ui/core'

const StyledRadio = withStyles({
  root: {
    color: '#0f152d',
    '&$checked': {
      color: '#0f152d',
    },
  },
})((props) => <Radio color='default' {...props} />)

export default function form() {
  const [value, setValue] = React.useState('')

  const handleChange = (event) => {
    setValue(event.target.value)
  }

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

      <RadioGroup
        aria-label='kjonn'
        name='kjonn'
        value={value}
        onChange={handleChange}
        className={styles.registrerKjonn}>
        <FormControlLabel value='Gutt' control={<StyledRadio />} label='Gutt' fontSize='25px' />
        <FormControlLabel value='Jente' control={<StyledRadio />} label='Jente' className={styles.velgKjonn} />
        <FormControlLabel value='Annet' control={<StyledRadio />} label='Annet' className={styles.velgKjonn} />
      </RadioGroup>

      <button type='submit' className={styles.button}>
        Registrer meg!
      </button>
    </form>
  )
}
