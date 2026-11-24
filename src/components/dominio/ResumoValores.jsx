import { formatarMoeda } from '../../utils/formatadores'

export default function ResumoValores({
  subtotal,
  descontoCupom = 0,
  descontoPontos = 0,
  total,
  pontosGanhos,
}) {
  return (
    <div className="space-y-2 text-sm">
      <div className="flex items-center justify-between">
        <span className="text-marrom-claro">Subtotal</span>
        <span className="font-medium text-marrom">{formatarMoeda(subtotal)}</span>
      </div>

      {descontoCupom > 0 && (
        <div className="flex items-center justify-between text-verde">
          <span>Desconto do cupom</span>
          <span className="font-medium">-{formatarMoeda(descontoCupom)}</span>
        </div>
      )}

      {descontoPontos > 0 && (
        <div className="flex items-center justify-between text-verde">
          <span>Resgate de pontos</span>
          <span className="font-medium">-{formatarMoeda(descontoPontos)}</span>
        </div>
      )}

      <div className="flex items-center justify-between border-t border-marrom/10 pt-2 text-base">
        <span className="font-bold text-marrom">Total</span>
        <span className="font-bold text-terracota">{formatarMoeda(total)}</span>
      </div>

      {pontosGanhos > 0 && (
        <p className="text-xs text-verde">Você ganhará aproximadamente {pontosGanhos} pontos.</p>
      )}
    </div>
  )
}
