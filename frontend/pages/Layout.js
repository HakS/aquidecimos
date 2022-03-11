import Head from 'next/head';
import Search from '../components/search';
import Link from 'next/link';
import Image from 'next/image';

export default (props) => {
  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="60x60" href="/apple-icon-60x60.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-icon-180x180.png" />
        <link rel="icon" type="image/png" sizes="192x192"  href="/android-icon-192x192.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-TileImage" content="/ms-icon-144x144.png" />
        <meta name="theme-color" content="#ffffff" />
        <meta property="og:site_name" content="Aqui Decimos"></meta>
      </Head>
      <div className="flex flex-col min-h-screen">
        <header className="bg-white py-6">
          <div className="max-w-screen-lg mx-auto px-4 ">
            <Link href="/" passHref={true}>
              <a className="mb-0 inline-flex">
                <Image src="/logo.png" width={296} height={80} />
              </a>
            </Link>
            <div className="flex w-full">
              <Search />
            </div>
          </div>
        </header>
        <div className="bg-slate-100 pt-3 overflow-hidden grow">
          <div className="max-w-screen-lg mx-auto flex flex-wrap px-4 my-10">
            <main className="w-full md:w-8/12 md:pr-4">
              { props.children }
            </main>
            <aside className="w-full md:w-4/12 text-slate-400 text-sm text-center">
              Aqui Decimos, { new Date().getFullYear() } todos los derechos reservados.
            </aside>
          </div>
        </div>
      </div>
    </>
  )
}
