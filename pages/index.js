import Layout from '../components/layout'
import Numpad from '../components/numpad'

export default function Home() {
  return (
    <Layout title=''>
      <Numpad />
      <p>{process.env.LICENSE_KEY}</p>
    </Layout>
  )
}
