import { NIVEIS_FIDELIDADE, PONTOS_POR_RESGATE, VALOR_RESGATE } from '../utils/constantes'
import { pedidosService } from './pedidosService'

export const beneficiosFidelidade = [
  {
    pontos: 100,
    valor: 5,
    descricao: 'R$ 5,00 de desconto no próximo pedido.',
  },
  {
    pontos: 200,
    valor: 12,
    descricao: 'R$ 12,00 de desconto em pedidos acima de R$ 50,00.',
  },
  {
    pontos: 350,
    valor: 25,
    descricao: 'R$ 25,00 de desconto e brinde surpresa na retirada.',
  },
]

function calcularNivel(pontos) {
  let nivelAtual = NIVEIS_FIDELIDADE[0]
  for (const nivel of NIVEIS_FIDELIDADE) {
    if (pontos >= nivel.minimo) nivelAtual = nivel
  }
  return nivelAtual
}

function calcularProximoNivel(pontos) {
  return NIVEIS_FIDELIDADE.find((nivel) => nivel.minimo > pontos) || null
}

export const fidelidadeService = {
  async obterResumo(usuario) {
    const pedidos = await pedidosService.listarPorUsuario(usuario.id)
    const nivel = calcularNivel(usuario.pontos)
    const proximoNivel = calcularProximoNivel(usuario.pontos)
    const pontosParaProximo = proximoNivel ? proximoNivel.minimo - usuario.pontos : 0
    const progresso = proximoNivel
      ? Math.min(100, Math.round((usuario.pontos / proximoNivel.minimo) * 100))
      : 100

    return {
      pontos: usuario.pontos,
      nivel,
      proximoNivel,
      pontosParaProximo,
      progresso,
      beneficios: beneficiosFidelidade,
      resgate: {
        pontos: PONTOS_POR_RESGATE,
        valor: VALOR_RESGATE,
      },
      historico: usuario.historicoPontos || [],
      pedidos: pedidos.map((pedido) => ({
        id: pedido.id,
        codigo: pedido.codigo,
        criadoEm: pedido.criadoEm,
        total: pedido.valores.total,
        pontosGanhos: pedido.pontosGanhos,
        status: pedido.status,
      })),
    }
  },
}
