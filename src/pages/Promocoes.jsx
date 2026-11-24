import { useEffect, useState } from 'react'
import CardPromocao from '../components/dominio/CardPromocao'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Carregando from '../components/ui/Carregando'
import TituloSecao from '../components/ui/TituloSecao'
import { promocoesService } from '../services/promocoesService'

export default function Promocoes() {
  const [promocoes, setPromocoes] = useState([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true

    promocoesService
      .listar()
      .then((lista) => {
        if (ativo) {
          const ordenadas = [...lista].sort(
            (a, b) => Number(a.expirada) - Number(b.expirada),
          )
          setPromocoes(ordenadas)
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
  }, [])

  return (
    <div>
      <TituloSecao
        nivel="h1"
        titulo="Promoções e campanhas"
        descricao="Copie o código e aplique no checkout. Um cupom por pedido."
        acao={
          <Botao para="/unidades" variante="contorno">
            Pedir agora
          </Botao>
        }
      />

      {erro && <Alerta tipo="erro">{erro}</Alerta>}

      {carregando ? (
        <Carregando mensagem="Buscando promoções..." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {promocoes.map((promocao) => (
            <CardPromocao key={promocao.id} promocao={promocao} />
          ))}
        </div>
      )}
    </div>
  )
}
