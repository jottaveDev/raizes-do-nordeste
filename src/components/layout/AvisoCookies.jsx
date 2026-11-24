import { useState } from 'react'
import { Link } from 'react-router-dom'
import { lerStorage, salvarStorage } from '../../services/api'
import { CHAVES } from '../../utils/constantes'

export default function AvisoCookies() {
  const [aceito, setAceito] = useState(() => Boolean(lerStorage(CHAVES.cookies, false)))

  function aceitar() {
    salvarStorage(CHAVES.cookies, true)
    setAceito(true)
  }

  if (aceito) return null

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 border-t border-marrom/15 bg-white px-4 py-4 shadow-[0_-4px_16px_rgba(74,46,34,0.12)]"
      role="region"
      aria-label="Aviso de cookies e armazenamento local"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-marrom">
          🍪 Usamos o armazenamento local do navegador para manter seu carrinho, sessão e
          preferências. Nenhum dado é enviado a servidores.{' '}
          <Link to="/lgpd" className="font-semibold text-terracota underline">
            Saiba mais
          </Link>
          .
        </p>
        <button
          type="button"
          onClick={aceitar}
          className="shrink-0 rounded-lg bg-terracota px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-terracota-escuro"
        >
          Aceitar e continuar
        </button>
      </div>
    </div>
  )
}
