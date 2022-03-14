import Head from 'next/head'
import Layout from './Layout'
import Expression from '../components/expression'
import ReactPaginate from 'react-paginate'
import { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import { getAbsUrl } from '../utils'
import { getCount, getWords, itemsPerPage } from '../service';

const DefinedPager = ({className, children}) => (
  <div className={`${className} bg-white flex justify-center my-4`}>
    {children}
  </div>
)

const Pager = styled(DefinedPager)`
  ul {
    display: flex;
  }
  li {
    border: 1px solid #e7ebee;
    + li {
      border-left: 0;
    }
    a {
      display: block;
      padding: .55rem .95rem;
      cursor: pointer;
      &:hover {
        background-color: #e7ebee;
      }
    }
  }
`

const Home = ({lastWords, wordsCount}) => {
  const [words, setWords] = useState(lastWords);
  const [pageCount] = useState(Math.ceil(wordsCount / itemsPerPage));
  const [itemOffset, setItemOffset] = useState(0);
  const router = useRouter()
  const absUrl = getAbsUrl(router)

  useEffect(() => {
    if (itemOffset == 0) {
      setWords(lastWords)
    } else {
      (async () => {
        const newWords = await getWords(itemOffset + 1)
        setWords(newWords)
      })()
    }
  }, [itemOffset]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [words]);

  const handlePageClick = event => {
    const newOffset = (event.selected * itemsPerPage) % wordsCount
    setItemOffset(newOffset)
  }

  const tagTitle = 'Aqui Decimos'
  const tagDescription = 'Diccionario para entender nuestra diversa cultura linguística latina.'
  const tagImage = `${getAbsUrl()}/social-share-img.png`

  return (
    <>
      <Head>
        <title>Aqui Decimos</title>
        <meta name="description" content={tagDescription} />
        <meta itemProp="name" content={tagTitle} />
        <meta itemProp="description" content={tagDescription} />
        <meta itemprop="image" content={tagImage}></meta>
        <meta property="og:title" content={tagTitle} />
        <meta property="og:description" content={tagDescription} />
        <meta property="og:image" content={tagImage} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={absUrl} />
        <meta name="twitter:title" content={tagTitle} />
        <meta name="twitter:description" content={tagDescription} />
        <meta name="twitter:image" content={tagImage} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={absUrl} />
      </Head>

      <Layout>
        {lastWords && lastWords.length > 0 && (
          <div className="flex flex-col gap-4">
            {words.map(meaning => (
              <Expression key={meaning._id} meaning={meaning} />
            ))}
            <div className='flex justify-center'>
              <Pager>
                <ReactPaginate
                  breakLabel="..."
                  nextLabel=">"
                  onPageChange={handlePageClick}
                  pageRangeDisplayed={2}
                  pageCount={pageCount}
                  previousLabel="<"
                  renderOnZeroPageCount={null}
                />
              </Pager>
            </div>
          </div>
        )}
      </Layout>
    </>
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