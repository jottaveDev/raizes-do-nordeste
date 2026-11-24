import { produtos } from '../data/produtos'
import { simularRequisicao } from './api'

const QUANTIDADE_MAIS_PEDIDOS = 5

function disponivelNaUnidade(produto, unidadeId) {
  if (produto.unidadesDisponiveis && !produto.unidadesDisponiveis.includes(unidadeId)) {
    return false
  }
  if (produto.indisponivelEm && produto.indisponivelEm.includes(unidadeId)) {
    return false
  }
  return true
}

function ordenarProdutos(lista) {
  const ranking = [...lista]
    .filter((produto) => produto.disponivel)
    .sort((a, b) => b.pedidos - a.pedidos)
    .slice(0, QUANTIDADE_MAIS_PEDIDOS)

  const idsMaisPedidos = new Set(ranking.map((produto) => produto.id))

  return lista
    .map((produto) => ({
      ...produto,
      maisPedido: idsMaisPedidos.has(produto.id),
    }))
    .sort((a, b) => {
      if (a.maisPedido !== b.maisPedido) {
        return a.maisPedido ? -1 : 1
      }
      if (a.maisPedido) {
        return b.pedidos - a.pedidos
      }
      return a.nome.localeCompare(b.nome, 'pt-BR')
    })
}

export const produtosService = {
  async listarPorUnidade(unidadeId) {
    const lista = produtos
      .filter(
        (produto) =>
          !produto.unidadesDisponiveis || produto.unidadesDisponiveis.includes(unidadeId),
      )
      .map((produto) => ({
        ...produto,
        disponivel: disponivelNaUnidade(produto, unidadeId),
      }))

    return simularRequisicao(ordenarProdutos(lista))
  },

  listarCategorias(listaDeProdutos) {
    const categorias = [...new Set(listaDeProdutos.map((produto) => produto.categoria))]
    const ordem = ['Tapiocas', 'Cuscuz', 'Bolos', 'Bebidas', 'Combos']

    // Mantém a ordem do cardápio mesmo depois de reordenar os produtos por popularidade.
    categorias.sort((a, b) => {
      const posicaoA = ordem.indexOf(a)
      const posicaoB = ordem.indexOf(b)

      if (posicaoA === -1 && posicaoB === -1) return a.localeCompare(b, 'pt-BR')
      if (posicaoA === -1) return 1
      if (posicaoB === -1) return -1
      return posicaoA - posicaoB
    })

    return ['Todas', ...categorias]
  },
}
