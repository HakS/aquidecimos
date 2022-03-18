import Head from 'next/head';
import Search from '../components/search';
import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { gtagPageView } from '../utils';
import Script from 'next/script';
import Modal from 'react-modal'
import { SiBuymeacoffee } from 'react-icons/si';
import { FaFacebook, FaInstagram, FaPaypal, FaBitcoin } from 'react-icons/fa';

Modal.setAppElement('#__next')

export default (props) => {
  const [modal, setModal] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url) => {
      gtagPageView(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  const handleDonationClick = () => {
    setModal(true)
  }

  return (
    <>
      <Modal
        isOpen={modal}
        onRequestClose={() => setModal(false)}
        contentLabel="Donar"
      >
        <h1 className="font-bold text-xl">Donar</h1>
        <div className="grid gap-3 grid-cols-2 text-center">
          <a href="https://www.buymeacoffee.com/aquidecimos" target="_blank">
            <SiBuymeacoffee />
            Buy me a coffee (Cómprame un café)
          </a>
          <a href="https://www.paypal.com/donate/?hosted_button_id=HVRPCFGRZD3WL" target="_blank">
            <FaPaypal />
            PayPal
          </a>
          <a href="https://www.blockonomics.co/pay-url/54dff52c5e5a4777" target="_blank">
            <FaBitcoin />
            Bitcoin
          </a>
        </div>
      </Modal>

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
            <div className="w-full md:w-4/12 text-slate-400 text-sm text-center">
              <div className='sticky top-0'>
                <aside>
                  <div className="mb-5 flex gap-1 justify-center">
                    <Link href='/nueva-palabra' passHref={true}>
                      <a className="bg-blue-700 text-white py-3 px-4 inline-block uppercase font-bold hover:bg-blue-600 active:bg-blue-800">Nueva palabra</a>
                    </Link>
                    <a onClick={handleDonationClick} className="cursor-pointer bg-blue-700 text-white py-3 px-4 inline-block uppercase font-bold hover:bg-blue-600 active:bg-blue-800">Donar</a>
                  </div>
                  <div className="flex gap-3 w-full justify-center mb-3">
                    <a className="w-50 flex justify-center gap-2 items-center hover:text-blue-600 active:text-blue-800" href="https://www.facebook.com/aqui.decimos.diccionario" target="_blank">
                      <FaFacebook className="text-lg" />
                      Facebook
                    </a>
                    <a className="w-50 flex justify-center gap-2 items-center hover:text-pink-600 active:text-pink-800" href="https://www.instagram.com/aquidecimos.app/" target="_blank">
                      <FaInstagram className="text-lg" />
                      Instagram
                    </a>
                  </div>
                </aside>
                <footer>
                  Aqui Decimos, { new Date().getFullYear() } todos los derechos reservados.
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', '${process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS}');
        `}
      </Script>
    </>
  )
}
