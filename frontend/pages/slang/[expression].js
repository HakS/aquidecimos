import groq from 'groq'
import { useRouter } from 'next/router'
import client from '../../client'

const SlangData = ({slangMeaning}) => {
  const router = useRouter()
  console.log(slangMeaning)

  return (
    <div>
      <h1>TEST</h1>
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