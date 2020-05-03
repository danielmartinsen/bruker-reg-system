import Head from 'next/head'
import Nav from './nav'
import styles from '../styles/layout.module.scss'

const siteTitle = 'Velkommen!'

export default function Layout({ children, title }) {
  return (
    <div className={styles.content}>
      <Head>
        <title>{siteTitle}</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='viewport' content='width=device-width' />
        <link href='https://fonts.googleapis.com/css2?family=Ubuntu:wght@300;500&display=swap' rel='stylesheet' />
      </Head>
      <p className={styles.title}>{title}</p>
      <main className={styles.main}>{children}</main>
      <Nav />
    </div>
  )
}
