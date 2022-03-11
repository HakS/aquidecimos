import groq from 'groq';
import Link from 'next/link';
import React, { useCallback, useRef, useState, useEffect } from 'react';
import { backend_RxJS } from '../client';
import { useRouter } from 'next/router';
import { gtagEvent } from '../utils';

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

const SearchResultsList = React.memo(({word}) => {
  const [results, setResults] = useState([])

  useEffect(() => {
    if (word.length) {
      gtagEvent({
        action: 'search',
        params: {
          search_term: word
        }
      })
      fetchResults(word).then(finding => {
        setResults(finding.map( ({_type, signifier}) => ({
          word: signifier,
          link: `/${ _type == 'meaning' ? 'expresion' : 'concepto' }/${ signifier }`
        })))
      })
    } else {
      setResults([])
    }
  }, [word])

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
  console.log(prev.word, next.word)
  return prev.word === next.word
})

const Search = () => {
  const searchRef = useRef(null)
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(false)
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
    setQuery(query)
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
      className="p-3 grow shrink-0 border"
      placeholder="Escribe cualquier palabra aquí..." />
      { active && (
        <SearchResultsList word={query} />
      )}
    </div>
  )
}

export default Search