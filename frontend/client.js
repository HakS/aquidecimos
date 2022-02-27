import sanityClient from '@sanity/client'

export const backendCDN = sanityClient({
  apiVersion: '2021-10-21',
  projectId: 'x93jjbcj', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  useCdn: true // `false` if you want to ensure fresh data
})

export const backend = sanityClient({
  apiVersion: '2021-10-21',
  projectId: 'x93jjbcj', // you can find this in sanity.json
  dataset: 'production', // or the name you chose in step 1
  useCdn: false // `false` if you want to ensure fresh data
})