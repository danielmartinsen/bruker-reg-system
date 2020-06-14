import React, { useEffect, useState } from 'react'
import styles from '../../styles/admin/index.module.scss'
import Layout from '../../components/admin/layout'
import StatsBox from '../../components/admin/statsBox'
import { loadFirebase } from '../../lib/firebase'

import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import Router from 'next/router'

export default function Home() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const dato = new Date()
  const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()

  const [month, setMonth] = useState(dato.getMonth() + 1)

  const [idagBesokstall, setIdagBesokstall] = useState(0)

  const [mndUnikeBrukere, setMndUnikeBrukere] = useState(0)
  const [mndDagerAapent, setMndDagerAapent] = useState(0)
  const [mndBesokstall, setMndBesokstall] = useState(0)

  const [totaltBesokstall, setTotaltBesokstall] = useState(0)
  const [totaltUnikeBrukere, setTotaltUnikeBrukere] = useState(0)
  const [totaltDagerAapent, setTotaltDagerAapent] = useState(0)

  const [totaltGutter, setTotaltGutter] = useState(0)
  const [totaltJenter, setTotaltJenter] = useState(0)
  const [totaltAnnet, setTotaltAnnet] = useState(0)

  const [totalPopTidspunktMest, setTotalPopTidspunktMest] = useState(0)
  const [totalPopTidspunktMinst, setTotalPopTidspunktMinst] = useState(0)

  function handleChange(event) {
    setMonth(event.target.value)
    const license = localStorage.getItem('LicenseKey')

    db.collection('Kunder')
      .doc(license)
      .collection('Logg')
      .get()
      .then((snapshot) => {
        if (!snapshot.empty) {
          var countDagerApent = 0
          var countBesok = 0
          var countResult = 0
          var users = []

          snapshot.forEach((doc) => {
            if (!doc.data().stats == true) {
              const docID = doc.id.split('-')

              if (docID[1] == event.target.value) {
                countResult++
                countDagerApent++
                for (var user in doc.data()) {
                  countBesok++
                  users.push(user)
                }
                setMndBesokstall(countBesok)
              } else if (countResult == 0) {
                setMndBesokstall(0)
                setMndDagerAapent(0)
              }
            }
          })

          setMndUnikeBrukere(users.filter((item, index) => users.indexOf(item) === index).length)
          setMndDagerAapent(countDagerApent)
        }
      })
  }

  function findMostFrequent(array) {
    if (array.length == 0) return null

    var modeMap = {},
      maxEl = array[0],
      maxCount = 1

    for (var i = 0; i < array.length; i++) {
      var el = array[i]

      if (modeMap[el] == null) modeMap[el] = 1
      else modeMap[el]++

      if (modeMap[el] > maxCount) {
        maxEl = el
        maxCount = modeMap[el]
      }
    }
    return maxEl
  }

  function findLeastFrequent(array) {
    if (array.length == 0) return null

    var arrMap = array.reduce(function (obj, val) {
      obj[val] = ++obj[val] || 1
      return obj
    }, {})
    var rarest = Object.keys(arrMap)[0]

    for (var key in arrMap) {
      rarest = arrMap[rarest] > arrMap[key] ? key : rarest
    }
    return rarest
  }

  useEffect(() => {
    const license = localStorage.getItem('LicenseKey')

    if (!license) {
      Router.push('/admin/login')
    } else {
      db.collection('Kunder')
        .doc(license)
        .collection('Logg')
        .doc(idag)
        .get()
        .then((doc) => {
          if (doc.exists) {
            var number = 0
            for (var user in doc.data()) {
              number++
            }
            setIdagBesokstall(number)
          }
        })

      db.collection('Kunder')
        .doc(license)
        .collection('Brukere')
        .doc('--stats--')
        .get()
        .then((doc) => {
          if (doc.exists) {
            setTotaltBesokstall(doc.data().innsjekkCount)
            setTotaltUnikeBrukere(doc.data().userCount)
          }
        })

      db.collection('Kunder')
        .doc(license)
        .collection('Logg')
        .get()
        .then((snapshot) => {
          if (!snapshot.empty) {
            var number1 = 0
            var number2 = 0
            var number3 = 0

            var klokkeslett = []
            var users = []

            var kjonnGutt = 0
            var kjonnJente = 0
            var kjonnAnnet = 0

            snapshot.forEach((doc) => {
              if (!doc.data().stats == true) {
                number1++

                for (var user in doc.data()) {
                  klokkeslett.push(doc.data()[user].klokkeslett)

                  if (doc.data()[user].kjonn == 'Gutt') {
                    kjonnGutt++
                  } else if (doc.data()[user].kjonn == 'Jente') {
                    kjonnJente++
                  } else if (doc.data()[user].kjonn == 'Annet') {
                    kjonnAnnet++
                  }
                }
              }
            })
            setTotaltDagerAapent(number1)

            snapshot.forEach((doc) => {
              if (!doc.data().stats == true) {
                const docID = doc.id.split('-')
                if (docID[1] == month) {
                  number2++

                  for (var user in doc.data()) {
                    number3++
                    users.push(user)
                  }
                  setMndBesokstall(number3)
                }
              }
            })
            setTotalPopTidspunktMest(findMostFrequent(klokkeslett))
            setTotalPopTidspunktMinst(findLeastFrequent(klokkeslett))

            setMndUnikeBrukere(users.filter((item, index) => users.indexOf(item) === index).length)
            setMndDagerAapent(number2)

            setTotaltAnnet(kjonnAnnet)
            setTotaltGutter(kjonnGutt)
            setTotaltJenter(kjonnJente)
          }
        })
    }
  }, [])

  return (
    <Layout>
      <p className={styles.sectionTitle}>I dag</p>
      <StatsBox title='Besøkstall' info={idagBesokstall} color='92D7E0' />
      <StatsBox title='Dagens melding' info='input' color='92D7E0' />

      <p className={styles.sectionTitle} style={{ marginBottom: 0 }}>
        Måned
      </p>
      <FormControl className={styles.selectForm}>
        <Select
          labelId='demo-simple-select-label'
          id='demo-simple-select'
          value={month}
          onChange={handleChange}
          disableUnderline>
          <MenuItem value={1}>Januar</MenuItem>
          <MenuItem value={2}>Februar</MenuItem>
          <MenuItem value={3}>Mars</MenuItem>
          <MenuItem value={4}>April</MenuItem>
          <MenuItem value={5}>Mai</MenuItem>
          <MenuItem value={6}>Juni</MenuItem>
          <MenuItem value={7}>Juli</MenuItem>
          <MenuItem value={8}>August</MenuItem>
          <MenuItem value={9}>September</MenuItem>
          <MenuItem value={10}>Oktober</MenuItem>
          <MenuItem value={11}>November</MenuItem>
          <MenuItem value={12}>Desember</MenuItem>
        </Select>
      </FormControl>

      <StatsBox title='Besøkstall' info={mndBesokstall} color='FDBFBD' />
      <StatsBox title='Unike brukere' info={mndUnikeBrukere} color='FDBFBD' />
      <StatsBox
        title='Gjennomsnittlig besøk'
        info={
          mndBesokstall != 0 || mndDagerAapent != 0
            ? (mndBesokstall / mndDagerAapent).toFixed(0)
            : 0
        }
        color='FDBFBD'
      />

      <p className={styles.sectionTitle}>Totalt</p>
      <StatsBox title='Besøkstall' info={totaltBesokstall} color='C7F0BC' />
      <StatsBox title='Unike brukere' info={totaltUnikeBrukere} color='C7F0BC' />
      <StatsBox
        title='Gjennomsnittlig besøk'
        info={totaltDagerAapent ? (totaltBesokstall / totaltDagerAapent).toFixed(0) : 0}
        color='C7F0BC'
      />

      <StatsBox
        title='Gutter'
        info={totaltGutter ? ((totaltGutter / totaltBesokstall) * 100).toFixed(0) + '%' : '-'}
        color='C7F0BC'
      />
      <StatsBox
        title='Jenter'
        info={totaltJenter ? ((totaltJenter / totaltBesokstall) * 100).toFixed(0) + '%' : '-'}
        color='C7F0BC'
      />
      <StatsBox
        title='Annet'
        info={totaltAnnet ? ((totaltAnnet / totaltBesokstall) * 100).toFixed(0) + '%' : '-'}
        color='C7F0BC'
      />

      <StatsBox title='Dager åpent' info={totaltDagerAapent} color='C7F0BC' />
      <StatsBox
        title='Mest pop. tidspunkt'
        info={totalPopTidspunktMest ? totalPopTidspunktMest + ':00' : '-'}
        color='C7F0BC'
      />
      <StatsBox
        title='Minst  pop. tidspunkt'
        info={totalPopTidspunktMinst ? totalPopTidspunktMinst + ':00' : '-'}
        color='C7F0BC'
      />
    </Layout>
  )
}
