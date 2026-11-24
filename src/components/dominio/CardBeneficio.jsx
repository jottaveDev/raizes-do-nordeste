import { formatarMoeda } from '../../utils/formatadores'
import Etiqueta from '../ui/Etiqueta'

export default function CardBeneficio({ beneficio, pontosAtuais }) {
  const disponivel = pontosAtuais >= beneficio.pontos
  const faltam = beneficio.pontos - pontosAtuais

  return (
    <div className="rounded-lg border border-marrom/10 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold text-marrom">{formatarMoeda(beneficio.valor)} de desconto</p>
          <p className="mt-1 text-sm text-marrom-claro">{beneficio.descricao}</p>
        </div>
        <Etiqueta variante={disponivel ? 'sucesso' : 'neutra'}>
          {beneficio.pontos} pts
        </Etiqueta>
      </div>

      <p className={`mt-3 text-xs font-medium ${disponivel ? 'text-verde' : 'text-marrom-claro'}`}>
        {disponivel
          ? 'Disponível para usar no checkout.'
          : `Faltam ${faltam} pontos para desbloquear.`}
      </p>
    </div>
  )
}
