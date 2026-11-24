export default function Campo({
  label,
  id,
  erro,
  dica,
  obrigatorio = false,
  multilinha = false,
  className = '',
  ...props
}) {
  const Componente = multilinha ? 'textarea' : 'input'
  const descricaoId = erro ? `${id}-erro` : dica ? `${id}-dica` : undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-marrom">
        {label}
        {obrigatorio && <span className="text-terracota"> *</span>}
      </label>

      <Componente
        id={id}
        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-marrom outline-none transition placeholder:text-marrom-claro/60 focus:border-terracota focus:ring-2 focus:ring-terracota/20 ${
          erro ? 'border-red-500' : 'border-marrom/20'
        }`}
        aria-invalid={Boolean(erro)}
        aria-describedby={descricaoId}
        {...props}
      />

      {dica && !erro && (
        <p id={`${id}-dica`} className="mt-1 text-xs text-marrom-claro">
          {dica}
        </p>
      )}

      {erro && (
        <p id={`${id}-erro`} className="mt-1 text-xs font-medium text-red-600">
          {erro}
        </p>
      )}
    </div>
  )
}
