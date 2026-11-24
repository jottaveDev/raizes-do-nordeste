export default function Carregando({ mensagem = 'Carregando...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-marrom-claro">
      <span
        className="h-8 w-8 animate-spin rounded-full border-4 border-terracota-claro border-t-terracota"
        aria-hidden="true"
      />
      <p className="text-sm">{mensagem}</p>
    </div>
  )
}
