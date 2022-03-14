import sanityClient from '@sanity/client'

const apiVersion = process.env.SANITY_IO_API_VERSION
const projectId = process.env.SANITY_IO_PROJECT_ID
const dataset = process.env.SANITY_IO_DATASET

export const backendCDN = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: true
})

export const backend = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: false
})
