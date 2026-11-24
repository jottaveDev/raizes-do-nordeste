import { formatarMoeda } from '../../utils/formatadores'
import Botao from '../ui/Botao'
import Card from '../ui/Card'
import Etiqueta from '../ui/Etiqueta'

export default function CardProduto({ produto, quantidade = 0, aoAdicionar }) {
  return (
    <Card
      className={`flex h-full flex-col ${
        produto.maisPedido ? 'border-terracota/40 bg-terracota-claro/25' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl" aria-hidden="true">
          {produto.emoji}
        </span>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap gap-1">
            {produto.maisPedido && <Etiqueta variante="destaque">🔥 Mais pedido</Etiqueta>}
            {produto.sazonal && <Etiqueta variante="alerta">Sazonal</Etiqueta>}
            {!produto.disponivel && <Etiqueta variante="erro">Indisponível</Etiqueta>}
          </div>
          <h3 className="font-bold leading-tight text-marrom">{produto.nome}</h3>
          <p className="mt-1 text-sm text-marrom-claro">{produto.descricao}</p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        <span className="font-bold text-terracota">{formatarMoeda(produto.preco)}</span>

        {produto.disponivel ? (
          <Botao tamanho="sm" onClick={() => aoAdicionar(produto)}>
            Adicionar{quantidade > 0 ? ` (${quantidade})` : ''}
          </Botao>
        ) : (
          <span className="text-xs font-medium text-marrom-claro">
            Não disponível nesta unidade
          </span>
        )}
      </div>
    </Card>
  )
}
