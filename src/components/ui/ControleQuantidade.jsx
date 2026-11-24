export default function ControleQuantidade({
  quantidade,
  onAlterar,
  rotulo = 'Quantidade',
  compacto = false,
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-lg border border-marrom/20 bg-white p-1">
      <button
        type="button"
        onClick={() => onAlterar(quantidade - 1)}
        className={`rounded-md font-bold text-terracota transition hover:bg-terracota-claro focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota ${
          compacto ? 'h-7 w-7' : 'h-8 w-8'
        }`}
        aria-label={`Diminuir ${rotulo.toLowerCase()}`}
      >
        −
      </button>
      <span
        className={`min-w-6 text-center text-sm font-semibold text-marrom ${
          compacto ? 'px-1' : 'px-2'
        }`}
        aria-live="polite"
      >
        {quantidade}
      </span>
      <button
        type="button"
        onClick={() => onAlterar(quantidade + 1)}
        className={`rounded-md font-bold text-terracota transition hover:bg-terracota-claro focus:outline-none focus-visible:ring-2 focus-visible:ring-terracota ${
          compacto ? 'h-7 w-7' : 'h-8 w-8'
        }`}
        aria-label={`Aumentar ${rotulo.toLowerCase()}`}
      >
        +
      </button>
    </div>
  )
}
