import { Link } from 'react-router-dom'

export default function Rodape() {
  return (
    <footer className="mt-12 border-t border-marrom/10 bg-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-8 sm:px-6 md:grid-cols-3">
        <div>
          <p className="flex items-center gap-2 font-bold text-marrom">
            <span aria-hidden="true">🌵</span> Raízes do Nordeste
          </p>
          <p className="mt-2 text-sm text-marrom-claro">
            Comida nordestina de verdade, com o carinho da nossa terra. Projeto acadêmico
            com dados fictícios.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-marrom">Navegar</p>
          <ul className="mt-2 space-y-1 text-sm text-marrom-claro">
            <li>
              <Link to="/unidades" className="hover:text-terracota">
                Unidades
              </Link>
            </li>
            <li>
              <Link to="/promocoes" className="hover:text-terracota">
                Promoções
              </Link>
            </li>
            <li>
              <Link to="/fidelidade" className="hover:text-terracota">
                Fidelidade
              </Link>
            </li>
            <li>
              <Link to="/pedidos" className="hover:text-terracota">
                Meus pedidos
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold text-marrom">Privacidade e ajuda</p>
          <ul className="mt-2 space-y-1 text-sm text-marrom-claro">
            <li>
              <Link to="/lgpd" className="hover:text-terracota">
                Política de privacidade
              </Link>
            </li>
            <li>
              <Link to="/perfil" className="hover:text-terracota">
                Meus dados
              </Link>
            </li>
            <li>📞 Central de atendimento: 0800 000 0000</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-marrom/10 px-4 py-4 text-center text-xs text-marrom-claro">
        © 2026 Raízes do Nordeste • Projeto Multidisciplinar • Nenhum pagamento real é
        processado.
      </div>
    </footer>
  )
}
