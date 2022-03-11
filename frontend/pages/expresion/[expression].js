import groq from 'groq'
import { useRouter } from 'next/router'
import Head from 'next/head';
import { backendCDN } from '../../client'
import Layout from '../Layout'
import { removeLastDot, truncate, getAbsUrl } from '../../utils';
import Expression from '../../components/expression';
import Share from '../../components/share';

const SlangData = ({slangMeaning}) => {
  const router = useRouter()
  const absUrl = getAbsUrl(router)

  const tagTitle = slangMeaning != undefined && slangMeaning.length > 0 ? `"${router.query.expression}" significa...` : null
  const tagDescription = slangMeaning != undefined && slangMeaning.length > 0 ?
    `${slangMeaning.map(meaning => `${meaning.meaning}: ${truncate(removeLastDot(meaning.definition), 90)}`).join(', ')}` : null

  return (
    <>
      <Head>
        <title>{ router.query.expression } - Aqui Decimos</title>
        <meta name="description" content={tagDescription} />
        <meta itemProp="name" content={tagTitle} />
        <meta itemProp="description" content={tagDescription} />
        <meta property="og:title" content={tagTitle} />
        <meta property="og:description" content={tagDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={absUrl} />
        <meta name="twitter:title" content={tagTitle} />
        <meta name="twitter:description" content={tagDescription} />
        <meta name="twitter:card" content="summary" />
        <link rel="canonical" href={absUrl} />
      </Head>
      <Layout>
        {slangMeaning && slangMeaning.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h1 className="font-bold text-xl">"{ router.query.expression }" significa</h1>
              <div className="flex gap-3">
                <Share absUrl={absUrl} />
              </div>
            </div>
            {slangMeaning.map(meaning => (
              <Expression key={meaning._id} meaning={meaning} />
            ))}
          </div>
        ) : (
          <>
            <h1>Palabra no encontrada</h1>
            <div>¿Quieres definir una palabra?</div>
          </>
        )}
      </Layout>
    </>
  )
}

export async function getStaticPaths() {
  const paths = await backendCDN.fetch(
    `*[_type == "meaning"][].signifier`
  )

  return {
    paths: paths.map((slang) => ({params: {
      expression: slang
    }})),
    fallback: true,
  }
}

export async function getStaticProps({ params}) {
  const { expression = "" } = params
  const slangMeaning = await backendCDN.fetch(groq`
    *[
      _type == "meaning" &&
      signifier match $slang
    ] {
      _id,
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
  `, { slang: expression })
  return {
    props: {
      slangMeaning
    }
  }
}

export default SlangData