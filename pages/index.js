import Layout from '../components/layout'

const License = process.env.LICENSE_KEY

export default function Home() {
  console.log(process.env)

  return (
    <Layout title='Tast brukernummeret ditt'>
      <div></div>
    </Layout>
  )
}
