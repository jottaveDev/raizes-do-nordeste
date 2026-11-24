import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Card from '../components/ui/Card'
import Carregando from '../components/ui/Carregando'
import EstadoVazio from '../components/ui/EstadoVazio'
import Etiqueta from '../components/ui/Etiqueta'
import { useAuth } from '../contexts/AuthContext'
import { STATUS_PEDIDO } from '../data/statusPedido'
import { pedidosService } from '../services/pedidosService'
import { formatarDataHora, formatarMoeda } from '../utils/formatadores'

export default function MeusPedidos() {
  const { usuario } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    pedidosService
      .listarPorUsuario(usuario.id)
      .then((lista) => {
        if (ativo) setPedidos(lista)
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
  }, [usuario.id])

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-marrom">Meus pedidos</h1>
          <p className="mt-1 text-sm text-marrom-claro">
            Histórico de pedidos feitos neste navegador.
          </p>
        </div>
        <Botao para="/unidades" variante="contorno">
          Fazer novo pedido
        </Botao>
      </div>

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      {carregando ? (
        <Carregando mensagem="Buscando seus pedidos..." />
      ) : pedidos.length === 0 ? (
        <EstadoVazio
          emoji="🧾"
          titulo="Você ainda não fez pedidos"
          descricao="Quando finalizar um pedido, ele aparecerá aqui com o status atualizado."
        >
          <Botao para="/unidades">Escolher unidade</Botao>
        </EstadoVazio>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {pedidos.map((pedido) => {
            const dadosStatus = STATUS_PEDIDO[pedido.status]

            return (
              <Card key={pedido.id} className="flex h-full flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-marrom">#{pedido.codigo}</p>
                    <p className="text-xs text-marrom-claro">
                      {formatarDataHora(pedido.criadoEm)}
                    </p>
                  </div>
                  <Etiqueta
                    variante={pedido.status === 'retirado' ? 'sucesso' : 'destaque'}
                  >
                    {dadosStatus.emoji} {dadosStatus.rotulo}
                  </Etiqueta>
                </div>

                <p className="text-sm text-marrom-claro">{pedido.unidade.nome}</p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-marrom-claro">
                    {pedido.itens.reduce((total, item) => total + item.quantidade, 0)} item(ns)
                  </span>
                  <span className="font-bold text-terracota">
                    {formatarMoeda(pedido.valores.total)}
                  </span>
                </div>

                <Link
                  to={`/pedidos/${pedido.id}`}
                  className="mt-auto text-sm font-semibold text-terracota hover:underline"
                >
                  Acompanhar pedido →
                </Link>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
