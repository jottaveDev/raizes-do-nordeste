import { formatarMoeda } from '../../utils/formatadores'
import ControleQuantidade from '../ui/ControleQuantidade'

export default function ItemCarrinho({ item, aoAlterar, aoRemover }) {
  return (
    <div className="flex flex-col gap-3 border-b border-marrom/10 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <span className="text-2xl" aria-hidden="true">
          {item.emoji}
        </span>
        <div>
          <h3 className="font-semibold text-marrom">{item.nome}</h3>
          <p className="text-sm text-marrom-claro">{formatarMoeda(item.preco)} cada</p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <ControleQuantidade
          quantidade={item.quantidade}
          onAlterar={(quantidade) => aoAlterar(item.produtoId, quantidade)}
          rotulo={item.nome}
          compacto
        />
        <span className="min-w-20 text-right font-bold text-terracota">
          {formatarMoeda(item.preco * item.quantidade)}
        </span>
        <button
          type="button"
          onClick={() => aoRemover(item.produtoId)}
          className="text-xs font-medium text-marrom-claro underline transition hover:text-red-600"
        >
          Remover
        </button>
      </div>
    </div>
  )
}
