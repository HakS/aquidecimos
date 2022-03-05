import Head from 'next/head'
import Layout from './Layout'
import { backendCDN } from '../client';
import groq from 'groq';
import Expression from '../components/expression';

const Home = ({lastWords}) => {
  return (
    <>
      <Head>
        <title>Aqui Decimos</title>
      </Head>

      <Layout>
        {lastWords && lastWords.length > 0 && (
          <div className="flex flex-col gap-4">
            {lastWords.map(meaning => (
              <Expression key={meaning._id} meaning={meaning} />
            ))}
          </div>
        )}
      </Layout>
    </>
  )
}

export async function getStaticProps() {
  const lastWords = await backendCDN.fetch(groq`
    *[
  _type == "meaning"
] | order(_createdAt) [0..4] {
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
  `)
  return {
    props: {
      lastWords
    }
  }
}

export default Home;