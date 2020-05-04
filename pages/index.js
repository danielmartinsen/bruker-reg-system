import Layout from '../components/layout'

const { LICENSE_KEY } = process.env

export default function Home() {
  return (
    <Layout title='Tast brukernummeret ditt'>
      <div>{LICENSE_KEY}</div>
    </Layout>
  )
}
