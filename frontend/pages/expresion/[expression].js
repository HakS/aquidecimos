import groq from 'groq'
import { useRouter } from 'next/router'
import client from '../../client'
import tw from 'twin.macro'
import { css, jsx } from '@emotion/react'
import ReactCountryFlag from 'react-country-flag'
import spanishCountryLabels from '../../spanishCountryLabels'

const SlangData = ({slangMeaning}) => {
  const router = useRouter()
  console.log(slangMeaning);

  return (
    <div tw="max-w-screen-lg mx-auto">
      {slangMeaning && slangMeaning.length > 0 ? (
        <div tw="flex flex-col gap-4 m-4">
          <h1 tw="font-bold text-xl">"{ router.query.expression }" significa</h1>
          {slangMeaning.map(meaning => (
            <div key={meaning._id} tw="border bg-white shadow-lg">
              <div tw="p-3">
                <div tw="flex justify-around">
                  <h2 tw="mb-3 font-semibold text-xl">{ meaning.meaning }</h2>
                </div>
                <div tw="mb-3">{ meaning.definition }</div>
                <div>
                  <div tw="text-sm mb-2">Dicho en</div>
                  <div tw="flex gap-2">
                    {meaning.countries.map(country => (
                      <>
                        <div tw="text-center flex-grow flex-shrink-0" css={css`flex-basis: 0`}>
                          <ReactCountryFlag countryCode={country.country}
                          svg
                          aria-label="United States"
                          style={{
                            width: '2.5em',
                            height: '2.5em',
                          }} />
                          <div tw="text-xs">
                            <div>{spanishCountryLabels[country.country]}</div>
                            <div>{country.locality && `(${country.locality})`}</div>
                          </div>
                        </div>
                      </>
                    ))}
                  </div>
                </div>
              </div>
              {meaning.related.length > 0 && (
                <div tw="p-3 border-t">
                  <h2>test</h2>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <>
          <h1>Palabra no encontrada</h1>
          <div>¿Quieres definir una palabra?</div>
        </>
      )}
    </div>
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
  const { expression = "" } = context.params
  const slangMeaning = await client.fetch(groq`
    *[
      _type == "meaning" &&
      signifier match $slang
    ] {
      _id,
      "meaning": signified->signifier,
      "definition": signified->definition,
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