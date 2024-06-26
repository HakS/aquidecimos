import { getCount, getWords } from '../service';
import Latest from './latest'


const Home = ({lastWords, wordsCount}) => {
  return (
    <Latest lastWords={lastWords} wordsCount={wordsCount} />
  )
}

export async function getServerSideProps() {
  const lastWords = await getWords()
  const wordsCount = await getCount()
  return {
    props: {
      lastWords,
      wordsCount
    }
  }
}

export default Home;