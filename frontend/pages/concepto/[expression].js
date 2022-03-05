import Layout from "../Layout"
import { backendCDN } from '../../client';
import groq from "groq";
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import Flags from '../../components/flags';
import wordTypes from "../../wordTypes";
import Link from 'next/link';
import { RelatedLink } from "../../utils";

const WordConcept = ({wordDef}) => {
  const router = useRouter()
  const [absUrl, setAbsUrl] = useState('')

  const tagTitle = router.query.expression
  const tagDescription = wordDef.definition

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
        <div className="flex flex-col gap-4">

          <article className="border bg-white shadow-lg">
            <div className="p-3">
              <div className="flex justify-between mb-2 flex-wrap">
                <div className="flex gap-2 items-center justify-between w-full">
                  <div className="flex items-center gap-3">
                    <h1 className="font-bold text-xl mb-0">{ router.query.expression }</h1>
                    <div className="bg-blue-700 text-sm text-white px-2 rounded-xl">{ wordTypes[wordDef.type] }</div>
                  </div>
                  <div className="flex gap-3">
                    <FacebookShareButton url={absUrl}>
                      <FacebookIcon size={24} round={true}></FacebookIcon>
                    </FacebookShareButton>
                    <TwitterShareButton url={absUrl}>
                      <TwitterIcon size={24} round={true}></TwitterIcon>
                    </TwitterShareButton>
                  </div>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                  {/* <Flags countries={wordDef.countries} /> */}
                </div>
              </div>
              <div className="mb-3">{ wordDef.definition }</div>
            </div>
            <div className="p-3 border-t flex flex-wrap bg-gray-50">
              <div className="flex flex-wrap gap-3">
                {wordDef.slangs.map(slang => (
                  <Link key={ slang._id } href={`/expresion/${ slang.signifier.trim() }`} passHref={true}>
                    <RelatedLink className="rounded text-center border bg-white p-3 flex-grow flex-shrink-0 flex gap-2 items-center justify-center cursor-pointer transition-colors hover:border-gray-300 active:bg-gray-100 active:border-blue-300 basis-0">
                      <div className="font-bold text-lg">{ slang.signifier }</div>
                      <Flags countries={slang.countries} />
                    </RelatedLink>
                  </Link>
                ))}
              </div>
            </div>
          </article>

        </div>
      </Layout>
    </>
  )
}

export async function getStaticPaths() {
  const paths = await backendCDN.fetch(
    `*[_type == "signified"][].signifier`
  )

  return {
    paths: paths.map((word) => ({params: {
      expression: word
    }})),
    fallback: true,
  }
}

export async function getStaticProps(context) {
  const { params } = context;
  const { expression = "" } = params
  const wordDef = await backendCDN.fetch(groq`
    *[
      _type == "signified" &&
      signifier match $word
    ][0] {
      definition,
      type,
      "slangs": *[_type == "meaning" && signified._ref == ^._id] {
        _id,
        signifier,
        countries[] {country, locality},
      }
    }
  `, { word: expression })
  return {
    props: {
      wordDef
    }
  }
}

export default WordConcept;