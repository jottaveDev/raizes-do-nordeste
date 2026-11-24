import { ORDEM_STATUS } from '../data/statusPedido'
import { CHAVES } from '../utils/constantes'
import { esperar, lerStorage, salvarStorage } from './api'

function lerPedidos() {
  return lerStorage(CHAVES.pedidos, [])
}

function gerarCodigo() {
  return Math.random().toString(36).slice(2, 8).toUpperCase()
}

export const pedidosService = {
  async criar({
    usuarioId,
    cliente,
    telefone,
    unidade,
    itens,
    valores,
    cupom,
    pontosUsados,
    pontosGanhos,
    pagamento,
    observacao,
  }) {
    await esperar(600)
    const pedidos = lerPedidos()
    const agora = new Date().toISOString()

    const pedido = {
      id: `pedido-${Date.now()}`,
      codigo: gerarCodigo(),
      usuarioId,
      cliente,
      telefone,
      unidade: {
        id: unidade.id,
        nome: unidade.nome,
        cidade: unidade.cidade,
      },
      itens,
      valores,
      cupom,
      pontosUsados,
      pontosGanhos,
      pagamento,
      observacao,
      status: 'recebido',
      criadoEm: agora,
      historico: [{ status: 'recebido', em: agora }],
    }

    pedidos.unshift(pedido)
    salvarStorage(CHAVES.pedidos, pedidos)
    return pedido
  },

  async listarPorUsuario(usuarioId) {
    await esperar(300)
    return lerPedidos().filter((pedido) => pedido.usuarioId === usuarioId)
  },

  async obterPorId(id) {
    await esperar(300)
    const pedido = lerPedidos().find((item) => item.id === id)
    if (!pedido) {
      throw new Error('Pedido não encontrado.')
    }
    return pedido
  },

  async avancarStatus(id) {
    await esperar(300)
    const pedidos = lerPedidos()
    const indice = pedidos.findIndex((item) => item.id === id)
    if (indice === -1) {
      throw new Error('Pedido não encontrado.')
    }

    const pedido = pedidos[indice]
    const posicaoAtual = ORDEM_STATUS.indexOf(pedido.status)

    if (posicaoAtual === -1 || posicaoAtual >= ORDEM_STATUS.length - 1) {
      return pedido
    }

    const novoStatus = ORDEM_STATUS[posicaoAtual + 1]
    const atualizado = {
      ...pedido,
      status: novoStatus,
      historico: [
        ...pedido.historico,
        { status: novoStatus, em: new Date().toISOString() },
      ],
    }

    pedidos[indice] = atualizado
    salvarStorage(CHAVES.pedidos, pedidos)
    return atualizado
  },

  async excluirPorUsuario(usuarioId) {
    await esperar(200)
    const pedidos = lerPedidos().filter((pedido) => pedido.usuarioId !== usuarioId)
    salvarStorage(CHAVES.pedidos, pedidos)
  },
}
