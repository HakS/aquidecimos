import Head from 'next/head'
import Layout from './Layout'
import { backendCDN } from '../client';
import groq from 'groq';
import Expression from '../components/expression';
import ReactPaginate from 'react-paginate';
import { useState, useEffect } from 'react';

const pages = 5;

const getWords = async (offset = 0) => {
  const results = await backendCDN.fetch(groq`
    *[
      _type == "meaning"
    ] | order(_createdAt) [$offset..$pages] {
      _id,
      signifier,
      "meaning": signified->signifier,
      "definition": signified->definition,
      "type": signified->type,
      examples,
      countries[] {country, locality},
      "related": *[
        _type == "meaning" &&
        signified._ref == ^.signified._ref &&
        _id != ^._id
      ] {
        _id,
        signifier,
        countries[] {country, locality},
      }
    }
  `, {pages: offset + pages, offset})
  return results
}

const Home = ({lastWords, wordsCount}) => {
  const [words, setWords] = useState(lastWords);
  const [pageCount] = useState(Math.ceil(wordsCount / pages));
  const [itemOffset, setItemOffset] = useState(0);

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
    const newOffset = (event.selected * pages) % wordsCount
    setItemOffset(newOffset)
  }

  return (
    <>
      <Head>
        <title>Aqui Decimos</title>
      </Head>

      <Layout>
        {lastWords && lastWords.length > 0 && (
          <div className="flex flex-col gap-4">
            {words.map(meaning => (
              <Expression key={meaning._id} meaning={meaning} />
            ))}
            <ReactPaginate
              breakLabel="..."
              nextLabel="next >"
              onPageChange={handlePageClick}
              pageRangeDisplayed={2}
              pageCount={pageCount}
              previousLabel="< previous"
              renderOnZeroPageCount={null}
            />
          </div>
        )}
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const lastWords = await getWords()
  const wordsCount = await backendCDN.fetch(groq`
    count(*[_type == "meaning"])
  `)
  return {
    props: {
      lastWords,
      wordsCount
    }
  }
}

export default Home;