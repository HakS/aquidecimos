import groq from 'groq';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { backend } from '../client';

const Search = () => {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])

  const fetchResults = async query => {
    const result = await backend.fetch(
      groq`*[
        _type == "meaning" && (
          signifier match $query ||
          signified._ref in *[
            _type == "signified" &&
            signifier match $query
          ]._id
        )
      ] {
        "expression": select(
          signifier match $query => "slang:" + signifier,
          signified._ref in *[
            _type == "signified" &&
            signifier match $query
          ]._id => "meaning:" + signified->signifier
        )
      }[].expression`
    , { query: `${query}*` })

    setResults(result.map(item => {
      const [type, word] = item.split(':');
      return {
        word: word,
        link: type == 'slang' ? `/expresion/${ word }` : `/concepto/${ word }`
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

  const onClick = useCallback(() => {
    setActive(false)
    window.removeEventListener('click', onClick)
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
            <li>
              <Link key={ result.word } href={result.link} passHref={true}>
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