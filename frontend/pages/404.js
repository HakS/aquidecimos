import Head from 'next/head';
import Layout from './Layout';

export default function Custom404() {
  return <>
    <Head>
      <title>404: Esta pagina no existe - Aqui Decimos</title>
    </Head>
    <Layout>
      <h1 className="font-bold text-xl mb-4">Lo sentimos, esta página no existe</h1>
      <p className="">Aconsejamos revisar la dirección URL de la página que intenta acceder.</p>
    </Layout>
  </>
}