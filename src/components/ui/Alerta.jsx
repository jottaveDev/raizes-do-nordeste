const estilos = {
  info: {
    caixa: 'border-blue-200 bg-blue-50 text-blue-900',
    icone: 'ℹ️',
  },
  sucesso: {
    caixa: 'border-verde/30 bg-verde-claro text-verde',
    icone: '✅',
  },
  aviso: {
    caixa: 'border-amarelo bg-amarelo-claro text-marrom',
    icone: '⚠️',
  },
  erro: {
    caixa: 'border-red-200 bg-red-50 text-red-800',
    icone: '❌',
  },
}

export default function Alerta({ children, tipo = 'info', className = '' }) {
  const estilo = estilos[tipo] || estilos.info

  return (
    <div
      role={tipo === 'erro' ? 'alert' : 'status'}
      className={`flex items-start gap-2 rounded-lg border px-4 py-3 text-sm ${estilo.caixa} ${className}`}
    >
      <span aria-hidden="true">{estilo.icone}</span>
      <div>{children}</div>
    </div>
  )
}
