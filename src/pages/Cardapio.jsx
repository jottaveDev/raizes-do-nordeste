import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CardProduto from '../components/dominio/CardProduto'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Campo from '../components/ui/Campo'
import Carregando from '../components/ui/Carregando'
import EstadoVazio from '../components/ui/EstadoVazio'
import Etiqueta from '../components/ui/Etiqueta'
import { useCarrinho } from '../contexts/CarrinhoContext'
import { produtosService } from '../services/produtosService'
import { unidadesService } from '../services/unidadesService'
import { formatarMoeda, normalizarTexto } from '../utils/formatadores'

export default function Cardapio() {
  const { id } = useParams()
  const [unidade, setUnidade] = useState(null)
  const [produtos, setProdutos] = useState([])
  const [categoria, setCategoria] = useState('Todas')
  const [busca, setBusca] = useState('')
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')
  const [aviso, setAviso] = useState('')

  const {
    adicionar,
    quantidadeDoProduto,
    quantidadeTotal,
    subtotal,
  } = useCarrinho()

  useEffect(() => {
    let ativo = true
    setCarregando(true)
    setErro('')
    setCategoria('Todas')
    setBusca('')

    Promise.all([unidadesService.obterPorId(id), produtosService.listarPorUnidade(id)])
      .then(([dadosUnidade, listaProdutos]) => {
        if (ativo) {
          setUnidade(dadosUnidade)
          setProdutos(listaProdutos)
        }
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
  }, [id])

  const categorias = useMemo(() => produtosService.listarCategorias(produtos), [produtos])

  const filtrados = useMemo(() => {
    const termo = normalizarTexto(busca.trim())
    return produtos.filter((produto) => {
      const correspondeCategoria = categoria === 'Todas' || produto.categoria === categoria
      const correspondeBusca =
        !termo ||
        normalizarTexto(produto.nome).includes(termo) ||
        normalizarTexto(produto.descricao).includes(termo)
      return correspondeCategoria && correspondeBusca
    })
  }, [produtos, categoria, busca])

  function adicionarProduto(produto) {
    if (!unidade) return

    if (!unidade.aberta) {
      setAviso('Esta unidade está fechada agora. Você pode navegar pelo cardápio, mas não será possível adicionar itens.')
      return
    }

    const trocouUnidade = adicionar(produto, unidade)

    if (trocouUnidade) {
      setAviso('Os itens do carrinho anterior foram substituídos porque pertencem a outra unidade.')
    } else {
      setAviso('')
    }
  }

  if (carregando) {
    return <Carregando mensagem="Montando o cardápio..." />
  }

  if (erro) {
    return (
      <EstadoVazio
        emoji="😕"
        nivel="h1"
        titulo="Unidade não encontrada"
        descricao={erro}
      >
        <Botao para="/unidades">Ver unidades</Botao>
      </EstadoVazio>
    )
  }

  return (
    <div>
      <Link to="/unidades" className="text-sm font-medium text-terracota hover:underline">
        ← Voltar para unidades
      </Link>

      <div className="mt-4 rounded-2xl bg-white p-5 shadow-cartao sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-marrom">{unidade.nome}</h1>
            <p className="mt-1 text-sm text-marrom-claro">
              {unidade.endereco} • {unidade.cidade} - {unidade.estado}
            </p>
            <p className="mt-1 text-sm text-marrom-claro">
              🕒 {unidade.horario} • 🛍️ Retirada em ~{unidade.tempoRetiradaMin} min
            </p>
          </div>
          <Etiqueta variante={unidade.aberta ? 'sucesso' : 'erro'}>
            {unidade.aberta ? 'Aberta agora' : 'Fechada agora'}
          </Etiqueta>
        </div>

        {!unidade.aberta && (
          <Alerta tipo="aviso" className="mt-4">
            A unidade está fechada neste momento. Você pode navegar pelo cardápio, mas não
            será possível adicionar itens.
          </Alerta>
        )}
      </div>

      {aviso && (
        <Alerta tipo="aviso" className="mt-4">
          {aviso}
        </Alerta>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-[1fr_auto] sm:items-end">
        <Campo
          id="busca-produto"
          label="Buscar no cardápio"
          placeholder="Ex.: tapioca, cuscuz, suco..."
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />
        <p className="pb-2 text-sm text-marrom-claro">
          {filtrados.length} item(ns) encontrado(s)
        </p>
      </div>

      <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
        {categorias.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategoria(item)}
            className={`shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition ${
              categoria === item
                ? 'border-terracota bg-terracota text-white'
                : 'border-marrom/15 bg-white text-marrom hover:border-terracota'
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <p className="mt-2 text-xs text-marrom-claro">
        🔥 Os itens mais pedidos aparecem primeiro; os demais seguem em ordem alfabética.
      </p>

      {filtrados.length === 0 ? (
        <div className="mt-6">
          <EstadoVazio
            emoji="🔎"
            titulo="Nenhum item encontrado"
            descricao="Tente outra categoria ou limpe a busca."
          >
            <Botao
              variante="contorno"
              onClick={() => {
                setBusca('')
                setCategoria('Todas')
              }}
            >
              Limpar filtros
            </Botao>
          </EstadoVazio>
        </div>
      ) : (
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtrados.map((produto) => (
            <CardProduto
              key={produto.id}
              produto={produto}
              quantidade={quantidadeDoProduto(produto.id)}
              aoAdicionar={adicionarProduto}
            />
          ))}
        </div>
      )}

      {quantidadeTotal > 0 && (
        <div className="sticky bottom-4 z-20 mt-8">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-terracota/30 bg-white p-4 shadow-xl">
            <div>
              <p className="text-sm font-semibold text-marrom">
                {quantidadeTotal} item(ns) no carrinho
              </p>
              <p className="text-lg font-bold text-terracota">{formatarMoeda(subtotal)}</p>
            </div>
            <Botao para="/carrinho">Ver carrinho</Botao>
          </div>
        </div>
      )}
    </div>
  )
}
