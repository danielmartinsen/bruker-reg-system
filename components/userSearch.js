import React, { useState } from 'react'
import styles from '../styles/usersearch.module.scss'
import User from './user'

export default function userSearch({ data }) {
  const [filter, setFilter] = useState()

  function search(e) {
    setFilter(e.target.value.toUpperCase())
  }

  return (
    <>
      <input
        className={styles.input}
        placeholder='Jeg heter...'
        onKeyUp={(e) => search(e)}
        autoComplete='off'
      />

      <div className={styles.brukerList} id='userList'>
        {data.map((user) => {
          var navn = (user.fornavn + ' ' + user.etternavn).toUpperCase()
          if (navn.includes(filter) && filter && filter.length > 2) {
            return (
              <User
                navn={user.fornavn + ' ' + user.etternavn}
                brukernummer={user.id}
                key={user.id}
              />
            )
          }
        })}
      </div>
    </>
  )
}
