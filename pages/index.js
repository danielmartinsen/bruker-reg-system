import Layout from '../components/layout'
import Numpad from '../components/numpad'

const License = process.env.LICENSE_KEY

export default function Home() {
  console.log(License)

  return (
    <Layout title='Tast brukernummeret ditt'>
      <Numpad />
    </Layout>
  )
}
