import sanityClient from '@sanity/client'

const apiVersion = '2021-10-21'
const projectId = 'x93jjbcj'
const dataset = 'production'

export const backendCDN = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: true
})

export const backendCDN_RxJS = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: true,
  isPromiseAPI: false
})

export const backend = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: false
})

export const backend_RxJS = sanityClient({
  apiVersion, projectId, dataset,
  useCdn: false,
  isPromiseAPI: false
})