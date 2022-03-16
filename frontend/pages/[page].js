import { getCount, getWords, itemsPerPage } from '../service';
import Latest from './latest'


const Home = ({lastWords, wordsCount}) => {
  return (
    <Latest lastWords={lastWords} wordsCount={wordsCount} />
  )
}

export async function getServerSideProps({params: {page}}) {
  if (isNaN(page + 1)) {
    return {
      notFound: true,
    }
  }

  const currentPage = parseInt(page)
  if (currentPage <= 1) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const lastWords = await getWords((currentPage - 1) * itemsPerPage)
  if (lastWords.length <= 0) {
    return {
      notFound: true,
    }
  }

  const wordsCount = await getCount()
  return {
    props: {
      lastWords,
      wordsCount
    }
  }
}

export default Home;