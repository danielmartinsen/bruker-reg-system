import Layout from '../components/layout'

const License = process.env.LICENSE_KEY

export default function Home() {
  return (
    <Layout title='Tast brukernummeret ditt'>
      <div>{License}</div>
    </Layout>
  )
}
