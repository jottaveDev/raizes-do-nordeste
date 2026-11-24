import Botao from '../ui/Botao'
import Card from '../ui/Card'
import Etiqueta from '../ui/Etiqueta'

export default function CardUnidade({ unidade }) {
  return (
    <Card className="flex h-full flex-col justify-between gap-4">
      <div>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-marrom">{unidade.nome}</h3>
            <p className="text-sm text-marrom-claro">
              {unidade.cidade} - {unidade.estado}
            </p>
          </div>
          <Etiqueta variante={unidade.aberta ? 'sucesso' : 'erro'}>
            {unidade.aberta ? 'Aberta' : 'Fechada'}
          </Etiqueta>
        </div>

        <ul className="mt-4 space-y-1.5 text-sm text-marrom-claro">
          <li>📍 {unidade.endereco}</li>
          <li>🕒 {unidade.horario}</li>
          <li>🛍️ Retirada em ~{unidade.tempoRetiradaMin} min</li>
          <li>📞 {unidade.telefone}</li>
        </ul>

        {!unidade.cozinhaCompleta && (
          <p className="mt-3 rounded-md bg-amarelo-claro px-3 py-2 text-xs text-marrom">
            ⚠️ Cozinha reduzida: alguns itens do cardápio podem não estar disponíveis.
          </p>
        )}
      </div>

      <Botao para={`/unidades/${unidade.id}/cardapio`} variante="contorno" className="w-full">
        Ver cardápio
      </Botao>
    </Card>
  )
}
