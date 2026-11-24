import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { lerStorage, salvarStorage } from '../services/api'
import { CHAVES } from '../utils/constantes'

const CarrinhoContext = createContext(null)

const CARRINHO_INICIAL = { unidade: null, itens: [] }

export function CarrinhoProvider({ children }) {
  const [carrinho, setCarrinho] = useState(() =>
    lerStorage(CHAVES.carrinho, CARRINHO_INICIAL),
  )

  useEffect(() => {
    salvarStorage(CHAVES.carrinho, carrinho)
  }, [carrinho])

  function adicionar(produto, unidade) {
    const trocouUnidade = Boolean(carrinho.unidade && carrinho.unidade.id !== unidade.id)

    setCarrinho((atual) => {
      const mesmaUnidade = atual.unidade && atual.unidade.id === unidade.id
      const itensBase = mesmaUnidade ? atual.itens : []
      const itemExistente = itensBase.find((item) => item.produtoId === produto.id)

      const itens = itemExistente
        ? itensBase.map((item) =>
            item.produtoId === produto.id
              ? { ...item, quantidade: item.quantidade + 1 }
              : item,
          )
        : [
            ...itensBase,
            {
              produtoId: produto.id,
              nome: produto.nome,
              preco: produto.preco,
              emoji: produto.emoji,
              quantidade: 1,
            },
          ]

      return {
        unidade: { id: unidade.id, nome: unidade.nome, cidade: unidade.cidade },
        itens,
      }
    })

    return trocouUnidade
  }

  function alterarQuantidade(produtoId, quantidade) {
    if (quantidade <= 0) {
      remover(produtoId)
      return
    }

    setCarrinho((atual) => ({
      ...atual,
      itens: atual.itens.map((item) =>
        item.produtoId === produtoId ? { ...item, quantidade } : item,
      ),
    }))
  }

  function remover(produtoId) {
    setCarrinho((atual) => ({
      ...atual,
      itens: atual.itens.filter((item) => item.produtoId !== produtoId),
    }))
  }

  function limpar() {
    setCarrinho(CARRINHO_INICIAL)
  }

  function quantidadeDoProduto(produtoId) {
    const item = carrinho.itens.find((produto) => produto.produtoId === produtoId)
    return item ? item.quantidade : 0
  }

  const subtotal = useMemo(
    () =>
      carrinho.itens.reduce((total, item) => total + item.preco * item.quantidade, 0),
    [carrinho.itens],
  )

  const quantidadeTotal = useMemo(
    () => carrinho.itens.reduce((total, item) => total + item.quantidade, 0),
    [carrinho.itens],
  )

  const valor = {
    unidade: carrinho.unidade,
    itens: carrinho.itens,
    subtotal,
    quantidadeTotal,
    adicionar,
    alterarQuantidade,
    remover,
    limpar,
    quantidadeDoProduto,
  }

  return <CarrinhoContext.Provider value={valor}>{children}</CarrinhoContext.Provider>
}

export function useCarrinho() {
  const contexto = useContext(CarrinhoContext)
  if (!contexto) {
    throw new Error('useCarrinho deve ser usado dentro de CarrinhoProvider.')
  }
  return contexto
}
