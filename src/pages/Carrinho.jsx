import { Link } from 'react-router-dom'
import ItemCarrinho from '../components/dominio/ItemCarrinho'
import ResumoValores from '../components/dominio/ResumoValores'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Card from '../components/ui/Card'
import EstadoVazio from '../components/ui/EstadoVazio'
import { useCarrinho } from '../contexts/CarrinhoContext'
import { PONTOS_POR_REAL } from '../utils/constantes'

export default function Carrinho() {
  const {
    unidade,
    itens,
    alterarQuantidade,
    remover,
    limpar,
    subtotal,
    quantidadeTotal,
  } = useCarrinho()

  if (itens.length === 0) {
    return (
      <EstadoVazio
        emoji="🛒"
        nivel="h1"
        titulo="Seu carrinho está vazio"
        descricao="Escolha uma unidade e monte seu pedido com os sabores do Nordeste."
      >
        <Botao para="/unidades">Escolher unidade</Botao>
      </EstadoVazio>
    )
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-marrom">Meu carrinho</h1>
        <p className="mt-1 text-sm text-marrom-claro">
          {unidade?.nome} • {quantidadeTotal} item(ns)
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <Card>
          {itens.map((item) => (
            <ItemCarrinho
              key={item.produtoId}
              item={item}
              aoAlterar={alterarQuantidade}
              aoRemover={remover}
            />
          ))}

          <div className="mt-4 flex flex-wrap justify-between gap-3">
            <Link
              to={unidade ? `/unidades/${unidade.id}/cardapio` : '/unidades'}
              className="text-sm font-medium text-terracota hover:underline"
            >
              ← Continuar comprando
            </Link>
            <button
              type="button"
              onClick={limpar}
              className="text-sm text-marrom-claro underline transition hover:text-red-600"
            >
              Limpar carrinho
            </button>
          </div>
        </Card>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Resumo</h2>
            <ResumoValores
              subtotal={subtotal}
              total={subtotal}
              pontosGanhos={Math.floor(subtotal * PONTOS_POR_REAL)}
            />
            <Botao para="/checkout" tamanho="lg" className="mt-5 w-full">
              Ir para o checkout
            </Botao>
            <p className="mt-3 text-center text-xs text-marrom-claro">
              O pagamento é processado por um serviço externo simulado.
            </p>
          </Card>

          <Alerta tipo="info">
            Os pontos de fidelidade são creditados após a confirmação do pagamento.
          </Alerta>
        </div>
      </div>
    </div>
  )
}
