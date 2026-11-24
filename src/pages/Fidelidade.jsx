import { useEffect, useState } from 'react'
import CardBeneficio from '../components/dominio/CardBeneficio'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Card from '../components/ui/Card'
import Carregando from '../components/ui/Carregando'
import Etiqueta from '../components/ui/Etiqueta'
import { useAuth } from '../contexts/AuthContext'
import { fidelidadeService } from '../services/fidelidadeService'
import { formatarData, formatarMoeda } from '../utils/formatadores'

export default function Fidelidade() {
  const { usuario } = useAuth()
  const [resumo, setResumo] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    setCarregando(true)

    fidelidadeService
      .obterResumo(usuario)
      .then((dados) => {
        if (ativo) setResumo(dados)
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
  }, [usuario])

  if (carregando) {
    return <Carregando mensagem="Calculando seus pontos..." />
  }

  if (erro || !resumo) {
    return <Alerta tipo="erro">{erro || 'Não foi possível carregar a fidelidade.'}</Alerta>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-marrom">Programa de fidelidade</h1>
        <p className="mt-1 text-sm text-marrom-claro">
          Cada R$ 1,00 pago vira 1 ponto. Troque seus pontos por descontos no checkout.
        </p>
      </div>

      <Card className="bg-verde-claro">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-verde">Seu saldo</p>
            <p className="text-4xl font-extrabold text-marrom">{resumo.pontos} pontos</p>
            <p className="mt-1 text-sm text-marrom-claro">
              Nível atual: <strong>{resumo.nivel.nome}</strong>
            </p>
          </div>
          <Etiqueta variante="sucesso">{resumo.nivel.nome}</Etiqueta>
        </div>

        <div className="mt-4">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white">
            <div
              className="h-full rounded-full bg-verde transition-all"
              style={{ width: `${resumo.progresso}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-marrom-claro">
            {resumo.proximoNivel
              ? `Faltam ${resumo.pontosParaProximo} pontos para o nível ${resumo.proximoNivel.nome}.`
              : 'Você chegou ao nível máximo. Aproveite os benefícios!'}
          </p>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-bold text-marrom">Benefícios disponíveis</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumo.beneficios.map((beneficio) => (
            <CardBeneficio
              key={beneficio.pontos}
              beneficio={beneficio}
              pontosAtuais={resumo.pontos}
            />
          ))}
        </div>
        <p className="mt-3 text-xs text-marrom-claro">
          Neste protótipo, o resgate de 100 pontos ({formatarMoeda(resumo.resgate.valor)})
          pode ser feito diretamente no checkout.
        </p>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="mb-3 text-lg font-bold text-marrom">Histórico de pontos</h2>
          {resumo.historico.length === 0 ? (
            <p className="text-sm text-marrom-claro">Nenhuma movimentação de pontos ainda.</p>
          ) : (
            <ul className="divide-y divide-marrom/10">
              {resumo.historico.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 py-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-marrom">{item.descricao}</p>
                    <p className="text-xs text-marrom-claro">{formatarData(item.data)}</p>
                  </div>
                  <span
                    className={`font-bold ${
                      item.pontos >= 0 ? 'text-verde' : 'text-terracota'
                    }`}
                  >
                    {item.pontos >= 0 ? '+' : ''}
                    {item.pontos}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card>
          <h2 className="mb-3 text-lg font-bold text-marrom">Como funciona</h2>
          <ol className="list-inside list-decimal space-y-2 text-sm text-marrom-claro">
            <li>Faça um pedido e pague pelo serviço externo simulado.</li>
            <li>Os pontos são creditados após a aprovação.</li>
            <li>
              No checkout, marque o resgate de 100 pontos para ganhar{' '}
              {formatarMoeda(resumo.resgate.valor)}.
            </li>
            <li>Quanto mais pedidos, maior o seu nível: Bronze, Prata ou Ouro.</li>
          </ol>

          {resumo.pedidos.length > 0 && (
            <p className="mt-4 text-xs text-marrom-claro">
              Você já tem {resumo.pedidos.length} pedido(s) registrado(s) neste navegador.
            </p>
          )}

          <Botao para="/unidades" className="mt-4">
            Fazer um pedido
          </Botao>
        </Card>
      </section>
    </div>
  )
}
