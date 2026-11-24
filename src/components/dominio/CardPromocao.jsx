import { useState } from 'react'
import { formatarData } from '../../utils/formatadores'
import Card from '../ui/Card'
import Etiqueta from '../ui/Etiqueta'

export default function CardPromocao({ promocao }) {
  const [copiado, setCopiado] = useState(false)

  async function copiarCodigo() {
    try {
      await navigator.clipboard.writeText(promocao.codigo)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 2000)
    } catch (erro) {
      console.error('Nao foi possivel copiar o cupom.', erro)
    }
  }

  return (
    <Card className="flex h-full flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-3xl" aria-hidden="true">
          {promocao.emoji}
        </span>
        <Etiqueta variante={promocao.expirada ? 'erro' : 'sucesso'}>
          {promocao.expirada ? 'Expirada' : `-${promocao.descontoPercentual}%`}
        </Etiqueta>
      </div>

      <div>
        <h3 className="font-bold text-marrom">{promocao.titulo}</h3>
        <p className="mt-1 text-sm text-marrom-claro">{promocao.descricao}</p>
        <p className="mt-2 text-xs text-marrom-claro">
          Válida até {formatarData(promocao.validade)}
        </p>
      </div>

      <div className="mt-auto flex items-center gap-2">
        <code className="flex-1 rounded-md border border-dashed border-terracota bg-creme px-3 py-2 text-center text-sm font-bold tracking-wider text-terracota">
          {promocao.codigo}
        </code>
        <button
          type="button"
          onClick={copiarCodigo}
          disabled={promocao.expirada}
          className="rounded-md border border-terracota px-3 py-2 text-xs font-semibold text-terracota transition hover:bg-terracota-claro disabled:cursor-not-allowed disabled:opacity-50"
        >
          {copiado ? 'Copiado!' : 'Copiar'}
        </button>
      </div>
    </Card>
  )
}
