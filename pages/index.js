import Layout from '../components/layout'
import Numpad from '../components/numpad'

export default function Home() {
  console.log(process.env.REACT_APP_LICENSE)

  return (
    <Layout title=''>
      <Numpad />
    </Layout>
  )
}
