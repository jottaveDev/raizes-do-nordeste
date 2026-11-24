import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import SeletorCanal from '../components/dominio/SeletorCanal'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Carregando from '../components/ui/Carregando'
import Etiqueta from '../components/ui/Etiqueta'
import TituloSecao from '../components/ui/TituloSecao'
import CardUnidade from '../components/dominio/CardUnidade'
import CardPromocao from '../components/dominio/CardPromocao'
import { promocoesService } from '../services/promocoesService'
import { unidadesService } from '../services/unidadesService'

export default function Inicio() {
  const [unidades, setUnidades] = useState([])
  const [promocoes, setPromocoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const local = useLocation()

  useEffect(() => {
    let ativo = true

    async function carregar() {
      try {
        const [listaUnidades, listaPromocoes] = await Promise.all([
          unidadesService.listar(),
          promocoesService.listar(),
        ])
        if (ativo) {
          setUnidades(listaUnidades)
          setPromocoes(listaPromocoes)
        }
      } catch (erroCarregamento) {
        if (ativo) setErro(erroCarregamento.message)
      } finally {
        if (ativo) setCarregando(false)
      }
    }

    carregar()
    return () => {
      ativo = false
    }
  }, [])

  return (
    <div className="space-y-12">
      {local.state?.mensagem && <Alerta tipo="sucesso">{local.state.mensagem}</Alerta>}

      <section className="overflow-hidden rounded-2xl bg-terracota-claro px-6 py-10 sm:px-10 lg:py-14">
        <div className="max-w-2xl">
          <Etiqueta variante="destaque">Rede Raízes do Nordeste</Etiqueta>
          <h1 className="mt-4 text-3xl font-extrabold leading-tight text-marrom sm:text-4xl lg:text-5xl">
            Comida nordestina de verdade, do seu jeito.
          </h1>
          <p className="mt-4 max-w-xl text-marrom-claro">
            Tapiocas, cuscuz, bolos e cafés da manhã completos. Peça pelo site, pelo app ou
            pelo totem da loja e retire sem fila.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Botao para="/unidades" tamanho="lg">
              Pedir agora
            </Botao>
            <Botao para="/promocoes" variante="contorno" tamanho="lg">
              Ver promoções
            </Botao>
          </div>
        </div>
      </section>

      <section>
        <TituloSecao
          titulo="Como você está pedindo?"
          descricao="A mesma jornada, adaptada para cada canal de atendimento."
        />
        <SeletorCanal />
      </section>

      <section>
        <TituloSecao
          titulo="Unidades em destaque"
          descricao="Escolha a unidade mais próxima para ver o cardápio disponível."
          acao={
            <Botao para="/unidades" variante="fantasma">
              Ver todas
            </Botao>
          }
        />

        {erro && <Alerta tipo="erro">{erro}</Alerta>}
        {carregando ? (
          <Carregando mensagem="Buscando unidades..." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {unidades
              .filter((unidade) => unidade.destaque)
              .slice(0, 3)
              .map((unidade) => (
                <CardUnidade key={unidade.id} unidade={unidade} />
              ))}
          </div>
        )}
      </section>

      <section>
        <TituloSecao
          titulo="Promoções da semana"
          descricao="Use o cupom no checkout e economize no seu pedido."
          acao={
            <Botao para="/promocoes" variante="fantasma">
              Ver todas
            </Botao>
          }
        />

        {!carregando && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {promocoes
              .filter((promocao) => !promocao.expirada)
              .slice(0, 2)
              .map((promocao) => (
                <CardPromocao key={promocao.id} promocao={promocao} />
              ))}
          </div>
        )}
      </section>

      <section className="grid gap-4 rounded-2xl bg-verde-claro p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-verde">
            Programa de fidelidade
          </p>
          <h2 className="mt-1 text-2xl font-bold text-marrom">
            Cada real vira ponto. Cada ponto vira desconto.
          </h2>
          <p className="mt-2 text-sm text-marrom-claro">
            Junte pontos a cada pedido e troque por descontos exclusivos. Consulte seu saldo
            na área de fidelidade.
          </p>
        </div>
        <Botao para="/fidelidade" variante="secundario">
          Ver meus pontos
        </Botao>
      </section>

      <section>
        <TituloSecao titulo="Como funciona" descricao="Em quatro passos simples." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { emoji: '📍', titulo: 'Escolha a unidade', texto: 'Veja o horário e o tempo de retirada.' },
            { emoji: '🍽️', titulo: 'Monte o pedido', texto: 'Adicione itens disponíveis na unidade.' },
            { emoji: '💳', titulo: 'Pague com segurança', texto: 'Pagamento processado por serviço externo.' },
            { emoji: '🛍️', titulo: 'Retire no balcão', texto: 'Acompanhe o status até ficar pronto.' },
          ].map((passo) => (
            <div key={passo.titulo} className="rounded-xl border border-marrom/10 bg-white p-5">
              <p className="text-2xl" aria-hidden="true">
                {passo.emoji}
              </p>
              <p className="mt-2 font-bold text-marrom">{passo.titulo}</p>
              <p className="mt-1 text-sm text-marrom-claro">{passo.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-dashed border-marrom/20 p-5 text-sm text-marrom-claro">
        <p className="font-semibold text-marrom">Sobre este projeto</p>
        <p className="mt-1">
          Protótipo acadêmico da rede Raízes do Nordeste. Todos os dados são fictícios e o
          pagamento é simulado. Consulte a{' '}
          <Link to="/lgpd" className="font-semibold text-terracota underline">
            política de privacidade
          </Link>
          .
        </p>
      </section>
    </div>
  )
}
