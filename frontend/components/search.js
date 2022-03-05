import groq from 'groq';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { backendCDN } from '../client';

const Search = () => {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])

  const fetchResults = async query => {
    const result = await backendCDN.fetch(
      groq`*[_type in ["meaning", "signified"] && signifier match $query] {
        signifier,
        _type
      }`,
      { query: `${query}*` }
    )

    setResults(result.map(({_type, signifier}) => {
      return {
        word: signifier,
        link: `/${ _type == 'meaning' ? 'expresion' : 'concepto' }/${ signifier }`
      }
    }))
  }

  const onChange = useCallback(event => {
    const query = event.target.value;
    setQuery(query)
    if (query.length) {
      fetchResults(query)
    } else {
      setResults([])
    }
  }, [])

  const onFocus = useCallback(() => {
    setActive(true)
    window.addEventListener('click', onClick)
  }, [])

  const onClick = useCallback(event => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }, [])

  return (
    <div className="w-full flex grow shrink-0 relative" ref={searchRef}>
      <input type="text"
      onChange={onChange}
      onFocus={onFocus}
      value={query}
      className="p-3 grow shrink-0"
      placeholder="Escribe cualquier palabra aquí..." />
      { active && results.length > 0 && (
        <ul className="absolute top-full w-full bg-white border border-slate-200">
          { results.map(result => (
            <li key={ result.word }>
              <Link href={result.link} passHref={true}>
                <a className="p-3 block hover:bg-slate-100">{result.word}</a>
              </Link>
            </li>
          )) }
        </ul>
      )}
    </div>
  )
}

export default Search