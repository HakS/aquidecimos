import groq from 'groq'
import { useRouter } from 'next/router'
import client from '../../client'
import tw from 'twin.macro'
import { css, jsx } from '@emotion/react'
import ReactCountryFlag from 'react-country-flag'
import spanishCountryLabels from '../../spanishCountryLabels'
import wordTypes from '../../wordTypes'
import PortableText from 'react-portable-text'
import Link from 'next/link'
import Layout from '../Layout'
import Head from 'next/head';
import { removeLastDot, truncate, getAbsoluteUrl } from '../../utils';
import { FacebookIcon, FacebookShareButton } from 'react-share'
import absoluteUrl from 'next-absolute-url'

const SlangData = ({slangMeaning, fullUrl}) => {
  const router = useRouter()
  
  const tooltip = css`
    position:relative;
    &:after{
      content: attr(tip);
      font-size: .8rem;
      color: #fff;
      padding:5px 10px;
      border-radius: 6px;
      background: #565656;
      box-shadow: 0px 3px 4px rgba(0,0,0, .35);
      position: absolute;
      top: 27px;
      left: -10px;
      display:none;
    }
    &:before{
      z-index:1000;
      position:absolute;
      content:"";
      top:15px;
      left:0px;
      border-right:7px transparent solid;
      border-left:7px transparent solid;
      display:none;
    }
    &:hover{
      z-index:1000;
      position:relative;
      color:#8325f7;
      &:after{
        display: inline;
      }
    }
  `

  const portableTextStyles = css`
    ul {
      list-style: disc;
      margin-left: 1.4rem;
    }
  `

  const tagTitle = slangMeaning.length > 0 ? `"${router.query.expression}" significa...` : null
  const tagDescription = slangMeaning.length > 0 ?
    `${slangMeaning.map(meaning => `${meaning.meaning}: ${truncate(removeLastDot(meaning.definition), 90)}`).join(', ')}` : null

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
      </Head>
      <Layout>
        {slangMeaning && slangMeaning.length > 0 ? (
          <div tw="flex flex-col gap-4">
            <div tw="flex justify-between">
              <h1 tw="font-bold text-xl">"{ router.query.expression }" significa</h1>
              <div>
                <FacebookShareButton>
                  <FacebookIcon size={24} round={false}></FacebookIcon>
                </FacebookShareButton>
              </div>
            </div>
            {slangMeaning.map(meaning => (
              <article key={meaning._id} tw="border bg-white shadow-lg">
                <div tw="p-3">
                  <div tw="flex justify-between mb-2 flex-wrap">
                    <div tw="flex gap-2 items-center">
                      <h2 tw="font-semibold text-xl mb-0">{ meaning.meaning }</h2>
                      <div tw="bg-blue-700 text-sm text-white px-2 rounded-xl">{ wordTypes[meaning.type] }</div>
                    </div>
                    <div tw="flex gap-4 w-full sm:w-auto">
                      {meaning.countries.map(country => (
                        <div
                        tip={`${spanishCountryLabels[country.country]}${country.locality ? ` (${country.locality})` : ''}`}
                        key={country.country}
                        tw="text-center sm:flex-grow sm:flex-shrink-0"
                        css={tooltip}>
                          <ReactCountryFlag countryCode={country.country}
                          svg
                          aria-label={spanishCountryLabels[country.country]}
                          style={{
                            width: '1.4em',
                            height: '1.4em',
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div tw="mb-3">{ meaning.definition }</div>
                </div>
                {(meaning.examples != undefined && meaning.examples.length > 0) && (
                  <div css={portableTextStyles} tw="p-3 border-t">
                    <div>Ejemplos: </div>
                    <PortableText content={meaning.examples}/>
                  </div>
                )}
                {meaning.related.length > 0 && (
                  <div tw="p-3 border-t flex flex-wrap bg-gray-50">
                    <div tw="flex-grow w-full mb-2">Otros usos</div>
                    {meaning.related.map(word => (
                      <Link key={ word._id } href={`/expresion/${ word.signifier.trim() }`}>
                        <a tw="rounded text-center border bg-white p-3 flex-grow flex-shrink-0 flex gap-2 items-center justify-center cursor-pointer hover:border-gray-300 active:bg-gray-100 active:border-blue-300" css={css`flex-basis: 0`}>
                          <div tw="font-bold text-lg">{ word.signifier }</div>
                          {word.countries.map(country => (
                            <div key={country.country} css={tooltip} tip={spanishCountryLabels[country.country]}>
                              <ReactCountryFlag countryCode={country.country}
                                svg
                                aria-label={spanishCountryLabels[country.country]}
                                style={{
                                  width: '1.3em',
                                  height: '1.3em',
                                }} />
                            </div>
                          ))}
                        </a>
                      </Link>
                    ))}
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