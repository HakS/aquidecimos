import tw from 'twin.macro'
import { css, jsx } from '@emotion/react'

export default (props) => {
  return (
    <>
      <header tw="bg-gray-100">
        <div tw="max-w-screen-lg mx-auto px-4 py-6">
          Aqui Decimos
        </div>
      </header>
      <div tw="max-w-screen-lg mx-auto flex flex-wrap px-4 my-10">
        <main tw="w-full md:w-8/12 md:pr-4">
          { props.children }
        </main>
        <aside tw="w-full md:w-4/12">
          test
        </aside>
      </div>
      <footer tw="max-w-screen-lg mx-auto px-4">
        Aqui Decimos, { new Date().getFullYear() } todos los derechos reservados.
      </footer>
    </>
  )
}
