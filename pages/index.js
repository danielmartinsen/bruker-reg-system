import Layout from '../components/layout'

export default function Home() {
  return (
    <Layout title='Tast brukernummeret ditt'>
      <div>{process.env.LICENSE_KEY}</div>
    </Layout>
  )
}
