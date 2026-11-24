import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import ResumoValores from '../components/dominio/ResumoValores'
import Alerta from '../components/ui/Alerta'
import AvisoLGPD from '../components/ui/AvisoLGPD'
import Botao from '../components/ui/Botao'
import Campo from '../components/ui/Campo'
import Card from '../components/ui/Card'
import EstadoVazio from '../components/ui/EstadoVazio'
import Etiqueta from '../components/ui/Etiqueta'
import { useAuth } from '../contexts/AuthContext'
import { useCarrinho } from '../contexts/CarrinhoContext'
import { pagamentoService } from '../services/pagamentoService'
import { pedidosService } from '../services/pedidosService'
import { promocoesService } from '../services/promocoesService'
import {
  PONTOS_POR_REAL,
  PONTOS_POR_RESGATE,
  VALOR_RESGATE,
} from '../utils/constantes'
import { formatarMoeda } from '../utils/formatadores'
import { validarNome, validarTelefone } from '../utils/validacoes'

const metodosPagamento = [
  { id: 'pix', nome: 'Pix', descricao: 'Aprovação imediata (simulada).' },
  { id: 'cartao', nome: 'Cartão', descricao: 'Crédito ou débito (simulado).' },
]

export default function Checkout() {
  const { usuario, registrarPontos, atualizarUsuario } = useAuth()
  const carrinho = useCarrinho()
  const navigate = useNavigate()

  const [nome, setNome] = useState(usuario?.nome || '')
  const [telefone, setTelefone] = useState(usuario?.telefone || '')
  const [observacao, setObservacao] = useState('')
  const [metodo, setMetodo] = useState('pix')
  const [consentimento, setConsentimento] = useState(false)
  const [marketing, setMarketing] = useState(usuario?.consentimentoMarketing || false)
  const [usarPontos, setUsarPontos] = useState(false)
  const [codigoCupom, setCodigoCupom] = useState('')
  const [cupom, setCupom] = useState(null)
  const [mensagemCupom, setMensagemCupom] = useState(null)
  const [simularRecusa, setSimularRecusa] = useState(false)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [processando, setProcessando] = useState(false)
  const [etapa, setEtapa] = useState('')

  const subtotal = carrinho.subtotal
  const descontoCupom = cupom
    ? Number(((subtotal * cupom.descontoPercentual) / 100).toFixed(2))
    : 0
  const descontoPontos =
    usarPontos && (usuario?.pontos || 0) >= PONTOS_POR_RESGATE ? VALOR_RESGATE : 0
  const total = Number(Math.max(0, subtotal - descontoCupom - descontoPontos).toFixed(2))
  const pontosGanhos = Math.floor(total * PONTOS_POR_REAL)

  async function aplicarCupom() {
    setMensagemCupom(null)

    if (!codigoCupom.trim()) {
      setMensagemCupom({ tipo: 'erro', texto: 'Digite um código de cupom.' })
      return
    }

    try {
      const promocao = await promocoesService.validarCupom(codigoCupom)
      setCupom(promocao)
      setMensagemCupom({
        tipo: 'sucesso',
        texto: `Cupom ${promocao.codigo} aplicado: ${promocao.descontoPercentual}% de desconto.`,
      })
    } catch (erro) {
      setCupom(null)
      setMensagemCupom({ tipo: 'erro', texto: erro.message })
    }
  }

  function removerCupom() {
    setCupom(null)
    setCodigoCupom('')
    setMensagemCupom(null)
  }

  function validarFormulario() {
    const novosErros = {}

    if (!validarNome(nome)) {
      novosErros.nome = 'Informe seu nome completo.'
    }

    if (!validarTelefone(telefone)) {
      novosErros.telefone = 'Informe um telefone com DDD.'
    }

    if (!consentimento) {
      novosErros.consentimento = 'O consentimento é obrigatório para concluir o pedido.'
    }

    if (usarPontos && (usuario?.pontos || 0) < PONTOS_POR_RESGATE) {
      novosErros.pontos = 'Saldo de pontos insuficiente para este resgate.'
    }

    setErros(novosErros)
    return Object.keys(novosErros).length === 0
  }

  async function finalizarPedido(evento) {
    evento.preventDefault()
    setErroGeral('')

    if (!validarFormulario()) return

    setProcessando(true)
    setEtapa('Solicitando pagamento ao serviço externo...')

    try {
      const pagamento = await pagamentoService.solicitarPagamento({
        valor: total,
        metodo,
        simularRecusa,
      })

      if (pagamento.status === 'recusado') {
        setErroGeral(pagamento.mensagem)
        setEtapa('')
        return
      }

      setEtapa('Pagamento aprovado. Registrando o pedido...')

      const pedido = await pedidosService.criar({
        usuarioId: usuario.id,
        cliente: nome.trim(),
        telefone: telefone.trim(),
        unidade: carrinho.unidade,
        itens: carrinho.itens,
        valores: { subtotal, descontoCupom, descontoPontos, total },
        cupom: cupom ? cupom.codigo : null,
        pontosUsados: usarPontos ? PONTOS_POR_RESGATE : 0,
        pontosGanhos,
        pagamento,
        observacao: observacao.trim(),
      })

      if (usarPontos) {
        registrarPontos(-PONTOS_POR_RESGATE, `Resgate no pedido #${pedido.codigo}`)
      }

      if (pontosGanhos > 0) {
        registrarPontos(pontosGanhos, `Compra no pedido #${pedido.codigo}`)
      }

      if (marketing !== usuario.consentimentoMarketing) {
        atualizarUsuario({ consentimentoMarketing: marketing })
      }

      carrinho.limpar()
      navigate(`/pedidos/${pedido.id}?novo=1`)
    } catch (erro) {
      setErroGeral(erro.message || 'Não foi possível concluir o pedido.')
    } finally {
      setProcessando(false)
      setEtapa('')
    }
  }

  if (carrinho.itens.length === 0) {
    return (
      <EstadoVazio
        emoji="🛒"
        nivel="h1"
        titulo="Não há itens para pagar"
        descricao="Adicione produtos ao carrinho antes de finalizar o pedido."
      >
        <Botao para="/unidades">Escolher unidade</Botao>
      </EstadoVazio>
    )
  }

  return (
    <div>
      <Link to="/carrinho" className="text-sm font-medium text-terracota hover:underline">
        ← Voltar para o carrinho
      </Link>

      <div className="mb-5 mt-3">
        <h1 className="text-2xl font-bold text-marrom">Finalizar pedido</h1>
        <p className="mt-1 text-sm text-marrom-claro">
          {carrinho.unidade?.nome} • {carrinho.quantidadeTotal} item(ns)
        </p>
      </div>

      <form
        onSubmit={finalizarPedido}
        className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start"
      >
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Dados de contato</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <Campo
                id="checkout-nome"
                label="Nome"
                obrigatorio
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                erro={erros.nome}
                autoComplete="name"
              />
              <Campo
                id="checkout-telefone"
                label="Telefone"
                obrigatorio
                placeholder="(81) 99999-0000"
                value={telefone}
                onChange={(evento) => setTelefone(evento.target.value)}
                erro={erros.telefone}
                dica="Usado apenas para contato sobre este pedido."
                autoComplete="tel"
              />
            </div>
            <Campo
              id="checkout-observacao"
              label="Observação"
              className="mt-4"
              multilinha
              rows={3}
              placeholder="Ex.: sem cebola, ponto da tapioca..."
              value={observacao}
              onChange={(evento) => setObservacao(evento.target.value)}
            />
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Cupom de desconto</h2>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end">
              <Campo
                id="checkout-cupom"
                label="Código do cupom"
                placeholder="Ex.: NORDESTE10"
                className="flex-1"
                value={codigoCupom}
                onChange={(evento) => setCodigoCupom(evento.target.value.toUpperCase())}
                disabled={Boolean(cupom)}
              />
              {cupom ? (
                <Botao variante="contorno" onClick={removerCupom}>
                  Remover cupom
                </Botao>
              ) : (
                <Botao variante="secundario" onClick={aplicarCupom}>
                  Aplicar cupom
                </Botao>
              )}
            </div>

            {cupom && (
              <p className="mt-2 flex items-center gap-2 text-sm text-verde">
                <Etiqueta variante="sucesso">{cupom.codigo}</Etiqueta>
                -{cupom.descontoPercentual}% aplicado
              </p>
            )}

            {mensagemCupom && (
              <Alerta tipo={mensagemCupom.tipo} className="mt-3">
                {mensagemCupom.texto}
              </Alerta>
            )}

            <p className="mt-3 text-xs text-marrom-claro">
              Cupons disponíveis em{' '}
              <Link to="/promocoes" className="font-semibold text-terracota underline">
                Promoções
              </Link>
              .
            </p>
          </Card>

          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Forma de pagamento</h2>
            <div className="space-y-2">
              {metodosPagamento.map((item) => (
                <label
                  key={item.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition ${
                    metodo === item.id
                      ? 'border-terracota bg-terracota-claro'
                      : 'border-marrom/15 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="metodo-pagamento"
                    value={item.id}
                    checked={metodo === item.id}
                    onChange={() => setMetodo(item.id)}
                    className="mt-1 h-4 w-4 accent-terracota"
                  />
                  <span>
                    <span className="block text-sm font-semibold text-marrom">{item.nome}</span>
                    <span className="block text-xs text-marrom-claro">{item.descricao}</span>
                  </span>
                </label>
              ))}
            </div>

            <label className="mt-4 flex items-start gap-2 rounded-lg bg-amarelo-claro p-3 text-sm text-marrom">
              <input
                type="checkbox"
                checked={simularRecusa}
                onChange={(evento) => setSimularRecusa(evento.target.checked)}
                className="mt-1 h-4 w-4 accent-terracota"
              />
              <span>
                <span className="font-semibold">Simular recusa do pagamento</span>
                <span className="block text-xs">
                  Opção de demonstração para testar o cenário negativo. Nenhum valor real é
                  cobrado.
                </span>
              </span>
            </label>
          </Card>

          <Card>
            <h2 className="mb-2 text-lg font-bold text-marrom">Fidelidade</h2>
            <p className="text-sm text-marrom-claro">
              Você tem <strong className="text-marrom">{usuario?.pontos || 0} pontos</strong>.
              100 pontos valem {formatarMoeda(VALOR_RESGATE)} de desconto.
            </p>

            {(usuario?.pontos || 0) >= PONTOS_POR_RESGATE ? (
              <label className="mt-3 flex items-start gap-2 rounded-lg border border-verde/30 bg-verde-claro p-3 text-sm text-verde">
                <input
                  type="checkbox"
                  checked={usarPontos}
                  onChange={(evento) => setUsarPontos(evento.target.checked)}
                  className="mt-1 h-4 w-4 accent-verde"
                />
                <span>
                  Usar 100 pontos e ganhar {formatarMoeda(VALOR_RESGATE)} de desconto neste
                  pedido.
                </span>
              </label>
            ) : (
              <p className="mt-3 rounded-lg bg-creme p-3 text-xs text-marrom-claro">
                Junte 100 pontos para liberar o primeiro resgate. Cada R$ 1,00 pago gera 1
                ponto.
              </p>
            )}

            {erros.pontos && (
              <p className="mt-2 text-xs font-medium text-red-600">{erros.pontos}</p>
            )}
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Privacidade</h2>
            <AvisoLGPD
              aceito={consentimento}
              aoMudar={setConsentimento}
              marketing={marketing}
              aoMudarMarketing={setMarketing}
              erro={erros.consentimento}
            />
          </Card>
        </div>

        <div className="space-y-4 lg:sticky lg:top-24">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Resumo do pedido</h2>
            <ResumoValores
              subtotal={subtotal}
              descontoCupom={descontoCupom}
              descontoPontos={descontoPontos}
              total={total}
              pontosGanhos={pontosGanhos}
            />

            {erroGeral && (
              <Alerta tipo="erro" className="mt-4">
                {erroGeral}
              </Alerta>
            )}

            {processando && (
              <Alerta tipo="info" className="mt-4">
                {etapa || 'Processando...'}
              </Alerta>
            )}

            <Botao
              tipo="submit"
              tamanho="lg"
              className="mt-5 w-full"
              disabled={processando}
            >
              {processando ? 'Processando...' : `Pagar ${formatarMoeda(total)}`}
            </Botao>

            <p className="mt-3 text-center text-xs text-marrom-claro">
              Ao pagar, você será redirecionado para o acompanhamento do pedido.
            </p>
          </Card>

          <Alerta tipo="info">
            O pagamento é apenas simulado. Nenhum dado de cartão é coletado ou armazenado.
          </Alerta>
        </div>
      </form>
    </div>
  )
}
