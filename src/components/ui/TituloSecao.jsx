export default function TituloSecao({
  titulo,
  descricao,
  acao,
  nivel = 'h2',
  className = '',
}) {
  const Tag = nivel

  return (
    <div className={`mb-5 flex flex-wrap items-end justify-between gap-3 ${className}`}>
      <div>
        <Tag className="text-xl font-bold text-marrom sm:text-2xl">{titulo}</Tag>
        {descricao && <p className="mt-1 text-sm text-marrom-claro">{descricao}</p>}
      </div>
      {acao}
    </div>
  )
}
