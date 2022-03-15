import '../styles/global.css'
import LoadingScreen from '../components/loadingScreen';

function MyApp({ Component, pageProps }) {
  return <>
    <LoadingScreen />
    <Component {...pageProps} />
  </>
}

export default MyApp
