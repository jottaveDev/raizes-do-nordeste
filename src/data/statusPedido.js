export const STATUS_PEDIDO = {
  recebido: {
    rotulo: 'Recebido',
    descricao: 'O pedido foi confirmado e aguarda o início do preparo.',
    emoji: '📝',
  },
  em_preparo: {
    rotulo: 'Em preparo',
    descricao: 'A cozinha está preparando o seu pedido.',
    emoji: '👩‍🍳',
  },
  pronto: {
    rotulo: 'Pronto',
    descricao: 'O pedido está pronto para retirada no balcão.',
    emoji: '✅',
  },
  retirado: {
    rotulo: 'Retirado',
    descricao: 'Pedido retirado. Bom apetite!',
    emoji: '🛍️',
  },
  cancelado: {
    rotulo: 'Cancelado',
    descricao: 'O pedido foi cancelado.',
    emoji: '❌',
  },
}

export const ORDEM_STATUS = ['recebido', 'em_preparo', 'pronto', 'retirado']
