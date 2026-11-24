export default function EstadoVazio({
  emoji = '🍽️',
  titulo = 'Nada por aqui',
  descricao = '',
  nivel = 'h2',
  children,
}) {
  const Tag = nivel

  return (
    <div className="rounded-xl border border-dashed border-marrom/20 bg-white px-6 py-12 text-center">
      <p className="text-4xl" aria-hidden="true">
        {emoji}
      </p>
      <Tag className="mt-3 text-lg font-semibold text-marrom">{titulo}</Tag>
      {descricao && <p className="mx-auto mt-2 max-w-md text-sm text-marrom-claro">{descricao}</p>}
      {children && <div className="mt-5 flex flex-wrap justify-center gap-3">{children}</div>}
    </div>
  )
}
