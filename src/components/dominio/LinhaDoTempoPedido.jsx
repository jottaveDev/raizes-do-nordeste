import { ORDEM_STATUS, STATUS_PEDIDO } from '../../data/statusPedido'
import { formatarHora } from '../../utils/formatadores'

export default function LinhaDoTempoPedido({ pedido }) {
  const historico = pedido.historico || []
  const horarios = new Map(historico.map((item) => [item.status, item.em]))
  const cancelado = pedido.status === 'cancelado'

  return (
    <ol className="space-y-0">
      {ORDEM_STATUS.map((status, indice) => {
        const dados = STATUS_PEDIDO[status]
        const concluido = horarios.has(status)
        const atual = pedido.status === status
        const ultimo = indice === ORDEM_STATUS.length - 1

        return (
          <li key={status} className="relative flex gap-3 pb-6 last:pb-0">
            {!ultimo && (
              <span
                className={`absolute left-3 top-7 h-full w-0.5 ${
                  concluido ? 'bg-verde' : 'bg-marrom/15'
                }`}
                aria-hidden="true"
              />
            )}

            <span
              className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                concluido
                  ? 'border-verde bg-verde text-white'
                  : 'border-marrom/20 bg-white text-marrom-claro'
              }`}
              aria-hidden="true"
            >
              {concluido ? '✓' : indice + 1}
            </span>

            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p
                  className={`font-semibold ${
                    atual ? 'text-terracota' : concluido ? 'text-marrom' : 'text-marrom-claro'
                  }`}
                >
                  {dados.rotulo}
                </p>
                {atual && !cancelado && (
                  <span className="rounded-full bg-terracota-claro px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-terracota-escuro">
                    Status atual
                  </span>
                )}
              </div>
              <p className="text-xs text-marrom-claro">{dados.descricao}</p>
              {horarios.get(status) && (
                <p className="mt-1 text-xs font-medium text-verde">
                  {formatarHora(horarios.get(status))}
                </p>
              )}
            </div>
          </li>
        )
      })}
    </ol>
  )
}
