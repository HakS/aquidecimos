import groq from 'groq';
import Link from 'next/link';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { backend_RxJS } from '../client';
import { useRouter } from 'next/router';

let searchSubscriber = null

const fetchResults = async query => {
  const q = groq`*[_type in ["meaning", "signified"] && signifier match $query] {
    signifier,
    _type
  }`
  if (searchSubscriber != null) {
    searchSubscriber.unsubscribe()
  }
  return new Promise((res, rej) => {
    searchSubscriber = backend_RxJS.fetch(q, { query: `${query}*` }).subscribe({
      next: result => res(result),
      error: err => rej(err)
    })
  })
}

const SearchResultsList = React.memo(({word, results}) => {
  console.log(`CALLED! word: ${word}`)
  return (
    <ul className="absolute top-full w-full bg-white border border-slate-200 z-10 shadow-lg">
      { results.map(result => (
        <li key={ result.word }>
          <Link href={result.link} passHref={true}>
            <a className="p-3 block hover:bg-slate-100">{result.word}</a>
          </Link>
        </li>
      )) }
    </ul>
  )
}, (prev, next) => {
  return prev.word === next.word
})

const Search = () => {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
  const [results, setResults] = useState([])
  const router = useRouter()

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);
    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, []);

  useEffect(() => {
    if (active) {
      setActive(false)
    }
  }, [router.asPath])

  const escFunction = event => {
    if (event.key === "Escape") {
      searchRef.current.querySelector('input').blur()
      setActive(false)
    }
  }

  const onChange = useCallback(event => {
    const query = event.target.value
    if (query.length) {
      fetchResults(query).then(result => {
        setResults(result.map( ({_type, signifier}) => ({
          word: signifier,
          link: `/${ _type == 'meaning' ? 'expresion' : 'concepto' }/${ signifier }`
        })))
        setQuery(query)
      })
    } else {
      setResults([])
      setQuery(query)
    }
  })

  const onFocus = () => {
    setActive(true)
    window.addEventListener('click', onClick)
  }

  const onClick = event => {
    if (searchRef.current && !searchRef.current.contains(event.target)) {
      setActive(false)
      window.removeEventListener('click', onClick)
    }
  }

  return (
    <div className="w-full flex grow shrink-0 relative" ref={searchRef}>
      <input type="text"
      onChange={onChange}
      onFocus={onFocus}
      value={query}
      className="p-3 grow shrink-0"
      placeholder="Escribe cualquier palabra aquí..." />
      { active && results.length > 0 && (
        <SearchResultsList word={query} results={results} />
      )}
    </div>
  )
}

export default Search