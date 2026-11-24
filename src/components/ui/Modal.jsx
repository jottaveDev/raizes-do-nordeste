import { useEffect } from 'react'

export default function Modal({ aberto, titulo, children, onFechar }) {
  useEffect(() => {
    if (!aberto) return

    function aoPressionarTecla(evento) {
      if (evento.key === 'Escape') onFechar()
    }

    document.addEventListener('keydown', aoPressionarTecla)
    return () => document.removeEventListener('keydown', aoPressionarTecla)
  }, [aberto, onFechar])

  if (!aberto) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-marrom/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="titulo-modal"
      onClick={onFechar}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(evento) => evento.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2 id="titulo-modal" className="text-lg font-bold text-marrom">
            {titulo}
          </h2>
          <button
            type="button"
            onClick={onFechar}
            className="rounded-md p-1 text-marrom-claro transition hover:bg-creme focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
