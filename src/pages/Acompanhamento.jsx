import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import LinhaDoTempoPedido from '../components/dominio/LinhaDoTempoPedido'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Card from '../components/ui/Card'
import Carregando from '../components/ui/Carregando'
import EstadoVazio from '../components/ui/EstadoVazio'
import Etiqueta from '../components/ui/Etiqueta'
import { STATUS_PEDIDO } from '../data/statusPedido'
import { pedidosService } from '../services/pedidosService'
import { formatarDataHora, formatarMoeda } from '../utils/formatadores'

export default function Acompanhamento() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const [pedido, setPedido] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [avancando, setAvancando] = useState(false)
  const novo = searchParams.get('novo') === '1'

  useEffect(() => {
    let ativo = true

    pedidosService
      .obterPorId(id)
      .then((dados) => {
        if (ativo) setPedido(dados)
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [id])

  async function avancarStatus() {
    setAvancando(true)
    try {
      const atualizado = await pedidosService.avancarStatus(id)
      setPedido(atualizado)
    } catch (erroAtualizacao) {
      setErro(erroAtualizacao.message)
    } finally {
      setAvancando(false)
    }
  }

  if (carregando) {
    return <Carregando mensagem="Buscando seu pedido..." />
  }

  if (erro || !pedido) {
    return (
      <EstadoVazio
        emoji="🧾"
        nivel="h1"
        titulo="Pedido não encontrado"
        descricao={erro || 'Não localizamos este pedido no armazenamento local.'}
      >
        <Botao para="/pedidos">Ver meus pedidos</Botao>
      </EstadoVazio>
    )
  }

  const dadosStatus = STATUS_PEDIDO[pedido.status]
  const podeAvancar = pedido.status !== 'retirado' && pedido.status !== 'cancelado'

  return (
    <div>
      {novo && (
        <Alerta tipo="sucesso" className="mb-4">
          Pedido confirmado! O pagamento foi aprovado e você já pode acompanhar o preparo.
        </Alerta>
      )}

      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link to="/pedidos" className="text-sm font-medium text-terracota hover:underline">
            ← Meus pedidos
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-marrom">
            Pedido #{pedido.codigo}
          </h1>
          <p className="text-sm text-marrom-claro">
            Feito em {formatarDataHora(pedido.criadoEm)} • {pedido.unidade.nome}
          </p>
        </div>
        <Etiqueta variante={pedido.status === 'retirado' ? 'sucesso' : 'destaque'}>
          {dadosStatus.emoji} {dadosStatus.rotulo}
        </Etiqueta>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Acompanhe o preparo</h2>
            <LinhaDoTempoPedido pedido={pedido} />

            {podeAvancar && (
              <div className="mt-6 rounded-lg bg-creme p-3">
                <p className="text-xs text-marrom-claro">
                  Demonstração: na operação real, a cozinha atualiza este status. Use o botão
                  abaixo para simular o avanço.
                </p>
                <Botao
                  variante="secundario"
                  tamanho="sm"
                  className="mt-2"
                  onClick={avancarStatus}
                  disabled={avancando}
                >
                  {avancando ? 'Atualizando...' : 'Simular próximo status'}
                </Botao>
              </div>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Itens do pedido</h2>
            <ul className="divide-y divide-marrom/10">
              {pedido.itens.map((item) => (
                <li
                  key={item.produtoId}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <span className="flex items-center gap-2 text-marrom">
                    <span aria-hidden="true">{item.emoji}</span>
                    {item.quantidade}x {item.nome}
                  </span>
                  <span className="font-semibold text-marrom">
                    {formatarMoeda(item.preco * item.quantidade)}
                  </span>
                </li>
              ))}
            </ul>

            {pedido.observacao && (
              <p className="mt-3 rounded-md bg-amarelo-claro p-3 text-sm text-marrom">
                <strong>Observação:</strong> {pedido.observacao}
              </p>
            )}
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Resumo</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-marrom-claro">Subtotal</dt>
                <dd>{formatarMoeda(pedido.valores.subtotal)}</dd>
              </div>
              {pedido.valores.descontoCupom > 0 && (
                <div className="flex justify-between text-verde">
                  <dt>Cupom {pedido.cupom}</dt>
                  <dd>-{formatarMoeda(pedido.valores.descontoCupom)}</dd>
                </div>
              )}
              {pedido.valores.descontoPontos > 0 && (
                <div className="flex justify-between text-verde">
                  <dt>Resgate de pontos</dt>
                  <dd>-{formatarMoeda(pedido.valores.descontoPontos)}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-marrom/10 pt-2 text-base font-bold">
                <dt>Total</dt>
                <dd className="text-terracota">{formatarMoeda(pedido.valores.total)}</dd>
              </div>
            </dl>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Pagamento</h2>
            <p className="text-sm text-marrom-claro">
              {pedido.pagamento.metodo === 'pix' ? 'Pix' : 'Cartão'} •{' '}
              <span className="font-semibold text-verde">
                {pedido.pagamento.status === 'aprovado' ? 'Aprovado' : 'Recusado'}
              </span>
            </p>
            <p className="mt-1 break-all text-xs text-marrom-claro">
              Transação: {pedido.pagamento.transacaoId}
            </p>
            <p className="mt-3 text-xs text-marrom-claro">
              Processado por serviço externo simulado. Nenhum valor real foi cobrado.
            </p>
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-bold text-marrom">Retirada</h2>
            <p className="text-sm text-marrom-claro">{pedido.unidade.nome}</p>
            <p className="text-sm text-marrom-claro">{pedido.unidade.cidade}</p>
            <p className="mt-2 text-sm text-marrom-claro">
              Cliente: {pedido.cliente}
              <br />
              Telefone: {pedido.telefone}
            </p>
          </Card>

          <Botao para="/unidades" variante="contorno" className="w-full">
            Pedir novamente
          </Botao>
        </div>
      </div>
    </div>
  )
}
