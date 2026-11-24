import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useCanal } from '../../contexts/CanalContext'
import AvisoCookies from './AvisoCookies'
import Cabecalho from './Cabecalho'
import Rodape from './Rodape'

export default function Layout() {
  const { pathname } = useLocation()
  const { canal, dadosCanal } = useCanal()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])

  return (
    <div
      className={`flex min-h-screen flex-col bg-creme ${
        canal === 'totem' ? 'text-[17px]' : ''
      }`}
    >
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-white focus:px-4 focus:py-2 focus:text-terracota"
      >
        Pular para o conteúdo
      </a>

      <Cabecalho />

      {canal === 'totem' && (
        <div className="bg-verde px-4 py-2 text-center text-sm font-medium text-white">
          {dadosCanal.emoji} Modo Totem: use os botões grandes para navegar.
        </div>
      )}

      <main
        id="conteudo"
        className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-6 lg:py-10"
      >
        <Outlet />
      </main>

      <Rodape />
      <AvisoCookies />
    </div>
  )
}
