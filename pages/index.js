import Layout from '../components/layout'
import Numpad from '../components/numpad'

export default function Home() {
  const License = process.env.REACT_APP_LICENSE

  return (
    <Layout title=''>
      <Numpad />
      <p>{'https://api.danielmartinsen.now.sh/' + License + '/brukere/get/1'}</p>
    </Layout>
  )
}
