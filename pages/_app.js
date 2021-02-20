import Head from 'next/head'
import '../styles/app.css'

function MyApp({ Component, pageProps }) {
  return <>
    <Head>
      <>
      <title>Research</title>
      </>
    </Head>
    <Component {...pageProps} />
  </>
}

export default MyApp
