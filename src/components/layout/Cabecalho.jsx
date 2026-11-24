import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { useCanal } from '../../contexts/CanalContext'
import { useCarrinho } from '../../contexts/CarrinhoContext'
import { primeiroNome } from '../../utils/formatadores'

const links = [
  { para: '/', rotulo: 'Início' },
  { para: '/unidades', rotulo: 'Unidades' },
  { para: '/promocoes', rotulo: 'Promoções' },
  { para: '/fidelidade', rotulo: 'Fidelidade' },
]

function classesLink({ isActive }) {
  return `rounded-lg px-3 py-2 text-sm font-medium transition ${
    isActive
      ? 'bg-terracota-claro text-terracota-escuro'
      : 'text-marrom hover:bg-white'
  }`
}

export default function Cabecalho() {
  const { usuario, sair } = useAuth()
  const { quantidadeTotal } = useCarrinho()
  const { dadosCanal } = useCanal()
  const [menuAberto, setMenuAberto] = useState(false)
  const local = useLocation()

  useEffect(() => {
    setMenuAberto(false)
  }, [local.pathname])

  return (
    <header className="sticky top-0 z-30 border-b border-marrom/10 bg-creme/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden="true">
            🌵
          </span>
          <span>
            <span className="block font-bold leading-tight text-marrom">
              Raízes do Nordeste
            </span>
            <span className="block text-[10px] uppercase tracking-widest text-marrom-claro">
              Comida nordestina
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navegação principal">
          {links.map((link) => (
            <NavLink
              key={link.para}
              to={link.para}
              end={link.para === '/'}
              className={classesLink}
            >
              {link.rotulo}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-white px-3 py-1 text-xs font-semibold text-marrom sm:inline-flex">
            {dadosCanal.emoji} {dadosCanal.nome}
          </span>

          <Link
            to="/carrinho"
            className="relative rounded-lg px-2 py-1 text-xl transition hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
            aria-label={`Carrinho com ${quantidadeTotal} itens`}
          >
            🛒
            {quantidadeTotal > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-terracota px-1 text-[10px] font-bold text-white">
                {quantidadeTotal}
              </span>
            )}
          </Link>

          {usuario ? (
            <div className="hidden items-center gap-2 sm:flex">
              <Link
                to="/perfil"
                className="rounded-lg px-2 py-1 text-sm font-medium text-marrom transition hover:bg-white"
              >
                Olá, {primeiroNome(usuario.nome)}
              </Link>
              <button
                type="button"
                onClick={sair}
                className="rounded-lg px-2 py-1 text-sm text-marrom-claro transition hover:bg-white"
              >
                Sair
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg bg-terracota px-3 py-2 text-sm font-semibold text-white transition hover:bg-terracota-escuro sm:inline-flex"
            >
              Entrar
            </Link>
          )}

          <button
            type="button"
            onClick={() => setMenuAberto((aberto) => !aberto)}
            className="rounded-lg p-2 text-marrom transition hover:bg-white md:hidden"
            aria-expanded={menuAberto}
            aria-label="Abrir menu"
          >
            {menuAberto ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {menuAberto && (
        <div className="border-t border-marrom/10 bg-creme px-4 py-3 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Navegação mobile">
            {links.map((link) => (
              <NavLink
                key={link.para}
                to={link.para}
                end={link.para === '/'}
                className={classesLink}
              >
                {link.rotulo}
              </NavLink>
            ))}

            {usuario ? (
              <>
                <NavLink to="/perfil" className={classesLink}>
                  Meu perfil
                </NavLink>
                <button
                  type="button"
                  onClick={sair}
                  className="rounded-lg px-3 py-2 text-left text-sm font-medium text-marrom transition hover:bg-white"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={classesLink}>
                  Entrar
                </NavLink>
                <NavLink to="/cadastro" className={classesLink}>
                  Criar conta
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
