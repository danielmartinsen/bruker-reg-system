import Layout from '../components/layout'

const { LICENSE_KEY } = process.env

export default function Home() {
  console.log({ LICENSE_KEY })

  return (
    <Layout title='Tast brukernummeret ditt'>
      <div></div>
    </Layout>
  )
}
