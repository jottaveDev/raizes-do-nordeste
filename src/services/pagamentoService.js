import { esperar } from './api'

export const pagamentoService = {
  async solicitarPagamento({ valor, metodo, simularRecusa = false }) {
    await esperar(1400)

    if (!valor || valor <= 0) {
      return {
        status: 'recusado',
        transacaoId: null,
        metodo,
        mensagem: 'Valor inválido para pagamento.',
      }
    }

    if (simularRecusa) {
      return {
        status: 'recusado',
        transacaoId: null,
        metodo,
        mensagem: 'Pagamento recusado pela operadora. Revise os dados e tente novamente.',
      }
    }

    return {
      status: 'aprovado',
      transacaoId: `TX-${Date.now()}`,
      metodo,
      mensagem: 'Pagamento aprovado pelo serviço externo.',
    }
  },
}
