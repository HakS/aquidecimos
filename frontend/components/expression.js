import wordTypes from "../wordTypes";
import PortableText from 'react-portable-text';
import styled from 'styled-components';
import Flags from './flags';
import Link from 'next/link';
import { RelatedLink } from "../utils";

const PortableTextStyles = styled.div`
  ul {
    list-style: disc;
    margin-left: 1.4rem;
  }
`

const Expression = ({meaning}) => {
  return (
    <article className="border bg-white">
      <div className="p-3">
        <div className="flex justify-between mb-2 flex-wrap">
          <div className="flex gap-2 items-center">
            <h2 className="font-semibold text-xl mb-0">
              { typeof meaning.signifier !== 'undefined' ? `"${meaning.signifier}" = ${meaning.meaning}` : meaning.meaning }
            </h2>
            <div className="bg-blue-700 text-sm text-white px-2 rounded-xl">{ wordTypes[meaning.type] }</div>
          </div>
          <div className="flex gap-4 w-full sm:w-auto">
            <Flags countries={meaning.countries} />
          </div>
        </div>
        <div className="mb-3">{ meaning.definition }</div>
      </div>
      {(meaning.examples != undefined && meaning.examples.length > 0) && (
        <PortableTextStyles className="p-3 border-t">
          <div>Ejemplos: </div>
          <PortableText content={meaning.examples}/>
        </PortableTextStyles>
      )}
      {meaning.related != undefined && meaning.related.length > 0 && (
        <div className="p-3 border-t flex flex-wrap bg-gray-50">
          <div className="flex-grow w-full mb-2">Otros usos</div>
          <div className="flex flex-wrap gap-3">
            {meaning.related.map(word => (
              <Link key={ word._id } href={`/expresion/${ word.signifier.trim() }`} passHref={true}>
                <RelatedLink className="rounded text-center border bg-white p-3 flex-grow flex-shrink-0 flex gap-2 items-center justify-center cursor-pointer transition-colors hover:border-gray-300 active:bg-gray-100 active:border-blue-300 basis-0">
                  <div className="font-bold text-lg">{ word.signifier }</div>
                  <Flags countries={word.countries} />
                </RelatedLink>
              </Link>
            ))}
          </div>
        </div>
      )}
    </article>
  )
}

export default Expression;