import { currentDomain, urlQuerySerialize } from './utils';

export const itemsPerPage = 5;

export const getWords = async (offset = 0) => {
  const response = await fetch(`${currentDomain}/api/last-words?${urlQuerySerialize({offset, pages: itemsPerPage})}`)
  return await response.json()
}

export const getCount = async () => {
  const response = await fetch(`${currentDomain}/api/words-count`)
  return await response.json()
}
