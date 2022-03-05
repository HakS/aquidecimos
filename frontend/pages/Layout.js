import Head from 'next/head';
import Search from '../components/search';
import Link from 'next/link';

export default (props) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="bg-gray-100">
        <div className="max-w-screen-lg mx-auto px-4 py-6">
          <Link href="/" passHref={true}>
            <a>Aqui Decimos</a>
          </Link>
          <div className="flex w-full">
            <Search />
          </div>
        </div>
      </header>
      <div className="max-w-screen-lg mx-auto flex flex-wrap px-4 my-10">
        <main className="w-full md:w-8/12 md:pr-4">
          { props.children }
        </main>
        <aside className="w-full md:w-4/12">
          test
        </aside>
      </div>
      <footer className="max-w-screen-lg mx-auto px-4">
        Aqui Decimos, { new Date().getFullYear() } todos los derechos reservados.
      </footer>
    </>
  )
}
