import Layout from '../components/layout'
import Input from '../components/input'
import Bruker from '../components/bruker'
import styles from '../styles/sok.module.scss'

export default function Home() {
  return (
    <Layout title='Begynn å skrive inn navnet ditt'>
      <Input />

      <div className={styles.brukerList}>
        <Bruker navn='Daniel Martinsen' brukerid='100' />
        <Bruker navn='Daniel Martinsen' brukerid='101' />
        <Bruker navn='Daniel Martinsen' brukerid='102' />
        <Bruker navn='Daniel Martinsen' brukerid='103' />
        <Bruker navn='Daniel Martinsen' brukerid='105' />
      </div>
    </Layout>
  )
}
