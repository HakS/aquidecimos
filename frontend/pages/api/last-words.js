import Cors from 'cors'
import { initMiddleware } from "../../utils"
import { backendCDN } from '../../client';
import groq from 'groq';

const cors = initMiddleware(
  Cors({
    origin: ["http://localhost", /\.aquidecimos\.vercel\.app$/],
    methods: ['GET', 'OPTIONS'],
  })
)

export default async function handler(req, res) {
  await cors(req, res)

  const {
    query: { offset = 0, pages = 5 },
    method,
  } = req
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
  `, {
    pages: parseInt(offset) + parseInt(pages),
    offset: parseInt(offset)
  })

  switch (method) {
    case 'GET':
      res.status(200).json(results)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}