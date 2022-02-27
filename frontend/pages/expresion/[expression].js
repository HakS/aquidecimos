import groq from 'groq'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Head from 'next/head';
import styled from 'styled-components';
import PortableText from 'react-portable-text'
import { FacebookIcon, FacebookShareButton, TwitterIcon, TwitterShareButton } from 'react-share'
import client from '../../client'
import wordTypes from '../../wordTypes'
import Layout from '../Layout'
import { removeLastDot, truncate } from '../../utils';
import Flags from '../../components/flags';

const PortableTextStyles = styled.div`
  ul {
    list-style: disc;
    margin-left: 1.4rem;
  }
`

const RelatedLink = styled.a`
  gap: 0.7rem;
  flex-basis: 100%;
  @media (min-width: 1024px) {
    min-width: calc(50% - 0.75rem);
    flex-basis: calc(50% - 0.75rem);
  }
`

const SlangData = ({slangMeaning}) => {
  const router = useRouter()

  const tagTitle = slangMeaning != undefined && slangMeaning.length > 0 ? `"${router.query.expression}" significa...` : null
  const tagDescription = slangMeaning != undefined && slangMeaning.length > 0 ?
    `${slangMeaning.map(meaning => `${meaning.meaning}: ${truncate(removeLastDot(meaning.definition), 90)}`).join(', ')}` : null

  let absUrl = '';
  if (typeof window !== "undefined") {
    absUrl = window.location.protocol + "//" + window.location.host  + window.location.pathname
  }

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
              <article key={meaning._id} className="border bg-white shadow-lg">
                <div className="p-3">
                  <div className="flex justify-between mb-2 flex-wrap">
                    <div className="flex gap-2 items-center">
                      <h2 className="font-semibold text-xl mb-0">{ meaning.meaning }</h2>
                      <div className="bg-blue-700 text-sm text-white px-2 rounded-xl">{ wordTypes[meaning.type] }</div>
                    </div>
                    <div className="flex gap-4 w-full sm:w-auto">
                      <Flags countries={meaning.countries} />
                    </div>
                  </div>
                  <div className="mb-3">{ meaning.definition }</div>
                </div>
                {(meaning.examples != undefined && meaning.examples.length > 0) && (
                  <PortableTextStyles className="p-3 border-t">
                    <div>Ejemplos: </div>
                    <PortableText content={meaning.examples}/>
                  </PortableTextStyles>
                )}
                {meaning.related != undefined && meaning.related.length > 0 && (
                  <div className="p-3 border-t flex flex-wrap bg-gray-50">
                    <div className="flex-grow w-full mb-2">Otros usos</div>
                    <div className="flex flex-wrap gap-3">
                      {meaning.related.map(word => (
                        <Link key={ word._id } href={`/expresion/${ word.signifier.trim() }`} passHref={true}>
                          <RelatedLink className="rounded text-center border bg-white p-3 flex-grow flex-shrink-0 flex gap-2 items-center justify-center cursor-pointer transition-colors hover:border-gray-300 active:bg-gray-100 active:border-blue-300 basis-0">
                            <div className="font-bold text-lg">{ word.signifier }</div>
                            <Flags countries={word.countries} />
                          </RelatedLink>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </article>
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
  const paths = await client.fetch(
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
  const slangMeaning = await client.fetch(groq`
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