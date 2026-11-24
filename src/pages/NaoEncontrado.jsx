import Botao from '../components/ui/Botao'
import EstadoVazio from '../components/ui/EstadoVazio'

export default function NaoEncontrado() {
  return (
    <EstadoVazio
      emoji="🌵"
      nivel="h1"
      titulo="Página não encontrada"
      descricao="O caminho que você tentou acessar não existe. Volte ao início ou escolha uma unidade para pedir."
    >
      <Botao para="/">Ir para o início</Botao>
      <Botao para="/unidades" variante="contorno">
        Ver unidades
      </Botao>
    </EstadoVazio>
  )
}
