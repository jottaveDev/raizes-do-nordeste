import { unidades } from '../data/unidades'
import { simularRequisicao } from './api'

export const unidadesService = {
  async listar() {
    return simularRequisicao(unidades)
  },

  async obterPorId(id) {
    const unidade = unidades.find((item) => item.id === id)
    if (!unidade) {
      throw new Error('Unidade não encontrada.')
    }
    return simularRequisicao(unidade, 250)
  },
}
