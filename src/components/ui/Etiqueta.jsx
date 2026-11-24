const variantes = {
  neutra: 'bg-creme text-marrom',
  sucesso: 'bg-verde-claro text-verde',
  alerta: 'bg-amarelo-claro text-marrom',
  erro: 'bg-red-100 text-red-700',
  destaque: 'bg-terracota-claro text-terracota-escuro',
}

export default function Etiqueta({ children, variante = 'neutra', className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${variantes[variante]} ${className}`}
    >
      {children}
    </span>
  )
}
