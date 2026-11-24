import { Link } from 'react-router-dom'

const variantes = {
  primario: 'bg-terracota text-white hover:bg-terracota-escuro',
  secundario: 'bg-verde text-white hover:bg-verde/90',
  contorno: 'border border-terracota text-terracota hover:bg-terracota-claro',
  fantasma: 'text-marrom hover:bg-terracota-claro',
  perigo: 'bg-red-600 text-white hover:bg-red-700',
}

const tamanhos = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Botao({
  children,
  variante = 'primario',
  tamanho = 'md',
  para,
  className = '',
  tipo = 'button',
  ...props
}) {
  const classes = `inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${variantes[variante]} ${tamanhos[tamanho]} ${className}`

  if (para) {
    return (
      <Link to={para} className={classes} {...props}>
        {children}
      </Link>
    )
  }

  return (
    <button type={tipo} className={classes} {...props}>
      {children}
    </button>
  )
}
