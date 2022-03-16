import Head from 'next/head';
import Layout from './Layout';

export default function Custom404() {
  return <>
    <Head>
      <title>500: Lo sentimos - Aqui Decimos</title>
    </Head>
    <Layout>
      <h1 className="font-bold text-xl mb-4">Lo sentimos, esta página no funciona momentaneamente</h1>
      <p className="">Vuelva a acceder a esta página en otro momento.</p>
    </Layout>
  </>
}