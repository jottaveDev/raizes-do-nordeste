import { Link } from 'react-router-dom'

export default function AvisoLGPD({
  aceito,
  aoMudar,
  marketing,
  aoMudarMarketing,
  erro,
  className = '',
}) {
  return (
    <div
      className={`rounded-lg border border-marrom/15 bg-creme p-4 text-sm ${className}`}
    >
      <p className="mb-3 font-semibold text-marrom">🔒 Privacidade dos seus dados</p>

      <label className="flex items-start gap-2 text-marrom">
        <input
          type="checkbox"
          checked={aceito}
          onChange={(evento) => aoMudar(evento.target.checked)}
          className="mt-1 h-4 w-4 accent-terracota"
          aria-invalid={Boolean(erro)}
        />
        <span>
          Li e concordo com a{' '}
          <Link to="/lgpd" className="font-semibold text-terracota underline">
            Política de Privacidade
          </Link>{' '}
          e autorizo o uso dos meus dados para processar este pedido.{' '}
          <span className="font-semibold text-terracota">*</span>
        </span>
      </label>

      {erro && <p className="mt-1 text-xs font-medium text-red-600">{erro}</p>}

      {aoMudarMarketing && (
        <label className="mt-3 flex items-start gap-2 text-marrom">
          <input
            type="checkbox"
            checked={marketing}
            onChange={(evento) => aoMudarMarketing(evento.target.checked)}
            className="mt-1 h-4 w-4 accent-terracota"
          />
          <span>
            Quero receber promoções e novidades da Raízes do Nordeste. Esta opção é
            opcional e pode ser alterada no perfil.
          </span>
        </label>
      )}
    </div>
  )
}
