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

const q = groq`*[_type in ["meaning", "signified"] && signifier match $query] {
  signifier,
  _type
}`

export default async function handler(req, res) {
  await cors(req, res)

  const {
    query: {query},
    method
  } = req
  const results = await backendCDN.fetch(
    groq`*[_type in ["meaning", "signified"] && signifier match $query] {
      signifier,
      _type
    }`, 
    { query: `${query}*` }
  )

  switch (method) {
    case 'GET':
      res.status(200).json(results)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}