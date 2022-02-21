import Head from 'next/head'
import Layout from './Layout'

export default function Home() {
  return (
    <>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout>
        <h1>Hello world</h1>
      </Layout>
    </>
  )
}
