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

  const { method } = req
  const wordsCount = await backendCDN.fetch(groq`
    count(*[_type == "meaning"])
  `)

  switch (method) {
    case 'GET':
      res.status(200).json(wordsCount)
      break
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}