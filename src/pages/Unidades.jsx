import { useEffect, useState } from 'react'
import CardUnidade from '../components/dominio/CardUnidade'
import Alerta from '../components/ui/Alerta'
import Campo from '../components/ui/Campo'
import Carregando from '../components/ui/Carregando'
import EstadoVazio from '../components/ui/EstadoVazio'
import TituloSecao from '../components/ui/TituloSecao'
import { unidadesService } from '../services/unidadesService'
import { normalizarTexto } from '../utils/formatadores'

export default function Unidades() {
  const [unidades, setUnidades] = useState([])
  const [busca, setBusca] = useState('')
  const [apenasAbertas, setApenasAbertas] = useState(false)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    unidadesService
      .listar()
      .then((lista) => {
        if (ativo) setUnidades(lista)
      })
      .catch((erroCarregamento) => {
        if (ativo) setErro(erroCarregamento.message)
      })
      .finally(() => {
        if (ativo) setCarregando(false)
      })

    return () => {
      ativo = false
    }
  }, [])

  const termo = normalizarTexto(busca.trim())
  const filtradas = unidades.filter((unidade) => {
    const correspondeBusca =
      !termo ||
      normalizarTexto(unidade.nome).includes(termo) ||
      normalizarTexto(unidade.cidade).includes(termo)
    const correspondeStatus = !apenasAbertas || unidade.aberta
    return correspondeBusca && correspondeStatus
  })

  return (
    <div>
      <TituloSecao
        nivel="h1"
        titulo="Nossas unidades"
        descricao="Cada loja tem o seu cardápio, horário e tempo de retirada."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Campo
          id="busca-unidade"
          label="Buscar unidade"
          placeholder="Cidade ou nome da loja"
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />

        <label className="flex items-center gap-2 pb-2 text-sm text-marrom">
          <input
            type="checkbox"
            checked={apenasAbertas}
            onChange={(evento) => setApenasAbertas(evento.target.checked)}
            className="h-4 w-4 accent-terracota"
          />
          Mostrar apenas abertas
        </label>
      </div>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      {carregando ? (
        <Carregando mensagem="Buscando unidades..." />
      ) : filtradas.length === 0 ? (
        <EstadoVazio
          emoji="📍"
          titulo="Nenhuma unidade encontrada"
          descricao="Tente buscar por outra cidade ou desmarque o filtro de unidades abertas."
        />
      ) : (
        <>
          <p className="mb-3 text-sm text-marrom-claro">
            {filtradas.length} unidade(s) encontrada(s)
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtradas.map((unidade) => (
              <CardUnidade key={unidade.id} unidade={unidade} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
