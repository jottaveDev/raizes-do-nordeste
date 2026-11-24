import { useCanal } from '../../contexts/CanalContext'

export default function SeletorCanal() {
  const { canal, canais, selecionarCanal } = useCanal()

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {canais.map((item) => {
        const selecionado = canal === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => selecionarCanal(item.id)}
            aria-pressed={selecionado}
            className={`rounded-xl border-2 p-4 text-left transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota ${
              selecionado
                ? 'border-terracota bg-terracota-claro'
                : 'border-marrom/10 bg-white hover:border-terracota/50'
            }`}
          >
            <span className="text-2xl" aria-hidden="true">
              {item.emoji}
            </span>
            <p className="mt-2 font-bold text-marrom">{item.nome}</p>
            <p className="mt-1 text-xs text-marrom-claro">{item.descricao}</p>
            {selecionado && (
              <p className="mt-2 text-xs font-semibold text-terracota-escuro">
                Canal selecionado
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}
