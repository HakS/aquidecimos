import Head from 'next/head';
import Layout from '../Layout';
import { useState } from 'react';

export default function NewWord({word = ''}) {
  const [inputWord, setWord] = useState(word)
  const [meaning, setMeaning] = useState('')

  const registerWord = async event => {
    event.preventDefault()
  }

  return <>
    <Head>
      <title>Nueva palabra - Aqui Decimos</title>
    </Head>
    <Layout>
      <form onSubmit={registerWord}>
        <div className="flex flex-col mb-4">
          <label htmlFor="word" className="inline-block mb-1 text-sm font-bold">Palabra</label>
          <input
            id="word"
            className="p-3"
            name="name"
            type="text"
            value={inputWord}
            onChange={event => setWord(event.currentTarget.value)} />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="word" className="inline-block mb-1 text-sm font-bold">Significado</label>
          <input
            id="word"
            className="p-3"
            name="name"
            type="text"
            value={meaning}
            onChange={event => setMeaning(event.currentTarget.value)} />
        </div>
        <button type="submit" className="bg-blue-700 text-white py-3 px-4">Añadir palabra</button>
      </form>
    </Layout>
  </>
}
