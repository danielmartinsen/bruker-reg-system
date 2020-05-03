import Layout from '../components/layout'
import Input from '../components/input'
import Bruker from '../components/bruker'
import styles from '../styles/sok.module.scss'

export default function Home() {
  return (
    <Layout title='Begynn å skrive inn navnet ditt'>
      <Input />

      <div className={styles.brukerList}>
        <Bruker navn='Daniel Martinsen' />
        <Bruker navn='Daniel Martinsen' />
        <Bruker navn='Daniel Martinsen' />
        <Bruker navn='Daniel Martinsen' />
        <Bruker navn='Daniel Martinsen' />
      </div>
    </Layout>
  )
}
