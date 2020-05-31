import React, { useEffect, useContext, useState } from 'react'
import styles from '../../styles/admin/index.module.scss'
import Layout from '../../components/admin/layout'
import StatsBox from '../../components/admin/statsBox'
import { loadFirebase } from '../../lib/firebase'

export default function Home() {
  const firebase = loadFirebase()
  const db = firebase.firestore()

  const dato = new Date()
  const idag = dato.getDate() + '-' + (dato.getMonth() + 1) + '-' + dato.getFullYear()
  const mnd = dato.getMonth() + 1

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
      } else if (modeMap[el] == maxCount) {
        maxEl += '&' + el
        maxCount = modeMap[el]
      }
    }
    return maxEl
  }

  function findLeastFrequent(array) {
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
              if (docID[1] == mnd) {
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
  }, [])

  return (
    <Layout>
      <p className={styles.sectionTitle}>I dag</p>
      <StatsBox title='Besøkstall' info={idagBesokstall} color='92D7E0' />
      <StatsBox title='Dagens melding' info='input' color='92D7E0' />

      <p className={styles.sectionTitle}>Denne måneden</p>
      <StatsBox title='Besøkstall' info={mndBesokstall} color='FDBFBD' />
      <StatsBox title='Unike brukere' info={mndUnikeBrukere} color='FDBFBD' />
      <StatsBox
        title='Gjennomsnittlig besøk'
        info={mndBesokstall / mndDagerAapent}
        color='FDBFBD'
      />

      <p className={styles.sectionTitle}>Totalt</p>
      <StatsBox title='Besøkstall' info={totaltBesokstall} color='C7F0BC' />
      <StatsBox title='Unike brukere' info={totaltUnikeBrukere} color='C7F0BC' />
      <StatsBox
        title='Gjennomsnittlig besøk'
        info={(totaltBesokstall / totaltDagerAapent).toFixed(1)}
        color='C7F0BC'
      />

      <StatsBox
        title='Gutter'
        info={((totaltGutter / totaltBesokstall) * 100).toFixed(0) + '%'}
        color='C7F0BC'
      />
      <StatsBox
        title='Jenter'
        info={((totaltJenter / totaltBesokstall) * 100).toFixed(0) + '%'}
        color='C7F0BC'
      />
      <StatsBox
        title='Annet'
        info={((totaltAnnet / totaltBesokstall) * 100).toFixed(0) + '%'}
        color='C7F0BC'
      />

      <StatsBox title='Dager åpent' info={totaltDagerAapent} color='C7F0BC' />
      <StatsBox title='Mest pop. tidspunkt' info={totalPopTidspunktMest + ':00'} color='C7F0BC' />
      <StatsBox
        title='Minst  pop. tidspunkt'
        info={totalPopTidspunktMinst + ':00'}
        color='C7F0BC'
      />
    </Layout>
  )
}
