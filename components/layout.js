import Head from 'next/head'
import Nav from './nav'
import styles from '../styles/layout.module.scss'

const siteTitle = 'Velkommen!'

export default function Layout({ children }) {
  return (
    <div>
      <Head>
        <title>{siteTitle}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width' />
        <link
          href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;500&display=swap'
          rel='stylesheet'
        />
      </Head>
      <main className={styles.content}>{children}</main>
      <Nav />
    </div>
  )
}
