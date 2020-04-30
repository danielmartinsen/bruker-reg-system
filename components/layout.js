import Head from 'next/head'
import Nav from './nav'

const siteTitle = 'Velkommen!'

export default function layout({ children }) {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <link rel='icon' href='/favicon.ico' />
        <link
          href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;500&display=swap'
          rel='stylesheet'
        />
      </Head>
      <main>{children}</main>
      <Nav />
    </div>
  )
}
