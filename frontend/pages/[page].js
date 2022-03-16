import { getCount, getWords, itemsPerPage } from '../service';
import Latest from './latest'


const Home = ({lastWords, wordsCount}) => {
  return (
    <Latest lastWords={lastWords} wordsCount={wordsCount} />
  )
}

export async function getServerSideProps({params: {page}}) {
  const lastWords = await getWords((parseInt(page) - 1) * itemsPerPage)
  const wordsCount = await getCount()
  return {
    props: {
      lastWords,
      wordsCount
    }
  }
}

export default Home;