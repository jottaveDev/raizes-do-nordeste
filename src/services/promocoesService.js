import { promocoes } from '../data/promocoes'
import { simularRequisicao } from './api'

function estaExpirada(validade) {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  return new Date(`${validade}T23:59:59`) < hoje
}

export const promocoesService = {
  async listar() {
    const lista = promocoes.map((promocao) => ({
      ...promocao,
      expirada: estaExpirada(promocao.validade),
    }))
    return simularRequisicao(lista)
  },

  async validarCupom(codigo) {
    const promocao = promocoes.find(
      (item) => item.codigo.toLowerCase() === String(codigo).trim().toLowerCase(),
    )

    if (!promocao) {
      throw new Error('Cupom inválido ou expirado.')
    }

    if (estaExpirada(promocao.validade)) {
      throw new Error('Este cupom está expirado.')
    }

    return simularRequisicao(promocao, 300)
  },
}
