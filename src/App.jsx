import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import RotaProtegida from './components/layout/RotaProtegida'
import Acompanhamento from './pages/Acompanhamento'
import Cadastro from './pages/Cadastro'
import Cardapio from './pages/Cardapio'
import Carrinho from './pages/Carrinho'
import Checkout from './pages/Checkout'
import Fidelidade from './pages/Fidelidade'
import Inicio from './pages/Inicio'
import Lgpd from './pages/Lgpd'
import Login from './pages/Login'
import MeusPedidos from './pages/MeusPedidos'
import NaoEncontrado from './pages/NaoEncontrado'
import Perfil from './pages/Perfil'
import Promocoes from './pages/Promocoes'
import Unidades from './pages/Unidades'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Inicio />} />
        <Route path="/unidades" element={<Unidades />} />
        <Route path="/unidades/:id/cardapio" element={<Cardapio />} />
        <Route path="/carrinho" element={<Carrinho />} />
        <Route path="/promocoes" element={<Promocoes />} />
        <Route path="/lgpd" element={<Lgpd />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/pedidos/:id" element={<Acompanhamento />} />

        <Route
          path="/checkout"
          element={
            <RotaProtegida>
              <Checkout />
            </RotaProtegida>
          }
        />
        <Route
          path="/pedidos"
          element={
            <RotaProtegida>
              <MeusPedidos />
            </RotaProtegida>
          }
        />
        <Route
          path="/fidelidade"
          element={
            <RotaProtegida>
              <Fidelidade />
            </RotaProtegida>
          }
        />
        <Route
          path="/perfil"
          element={
            <RotaProtegida>
              <Perfil />
            </RotaProtegida>
          }
        />

        <Route path="*" element={<NaoEncontrado />} />
      </Route>
    </Routes>
  )
}
