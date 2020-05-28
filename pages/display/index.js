import AntallBrukere from '../../components/display/brukere'
import Jobber from '../../components/display/jobber'
import BrukerStats from '../../components/display/stats'

import styles from '../../styles/display/index.module.scss'

export default function Display() {
  return (
    <div className={styles.wrapper}>
      <AntallBrukere />
      <Jobber />
      <BrukerStats />
    </div>
  )
}
