import groq from 'groq'
import { useRouter } from 'next/router'
import Head from 'next/head';
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import { backendCDN } from '../../client'
import Layout from '../Layout'
import { removeLastDot, truncate } from '../../utils';
import { useEffect, useState } from 'react';
import Expression from '../../components/expression';

const SlangData = ({slangMeaning}) => {
  const router = useRouter()
  const [absUrl, setAbsUrl] = useState('')

  const tagTitle = slangMeaning != undefined && slangMeaning.length > 0 ? `"${router.query.expression}" significa...` : null
  const tagDescription = slangMeaning != undefined && slangMeaning.length > 0 ?
    `${slangMeaning.map(meaning => `${meaning.meaning}: ${truncate(removeLastDot(meaning.definition), 90)}`).join(', ')}` : null

  useEffect(() => {
    setAbsUrl(window.location.protocol + "//" + window.location.host  + window.location.pathname)
  })

  return (
    <>
      <Head>
        <title>{ router.query.expression } - Aqui Decimos</title>
        <meta name="description" content={tagDescription} />
        <meta itemProp="name" content={tagTitle} />
        <meta itemProp="description" content={tagDescription} />
        <meta name="og:title" content={tagTitle} />
        <meta name="og:description" content={tagDescription} />
        <meta name="og:type" content="article" />
        <meta name="og:url" content={useRouter().asPath} />
        <meta name="twitter:title" content={tagTitle} />
        <meta name="twitter:description" content={tagDescription} />
        <link rel="canonical" href={absUrl} />
      </Head>
      <Layout>
        {slangMeaning && slangMeaning.length > 0 ? (
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <h1 className="font-bold text-xl">"{ router.query.expression }" significa</h1>
              <div className="flex gap-3">
                <FacebookShareButton url={absUrl}>
                  <FacebookIcon size={24} round={true}></FacebookIcon>
                </FacebookShareButton>
                <TwitterShareButton url={absUrl}>
                  <TwitterIcon size={24} round={true}></TwitterIcon>
                </TwitterShareButton>
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

export async function getStaticProps(context) {
  const { params } = context;
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