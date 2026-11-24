import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Carregando from '../ui/Carregando'

export default function RotaProtegida({ children }) {
  const { usuario, carregando } = useAuth()
  const local = useLocation()

  if (carregando) {
    return <Carregando mensagem="Verificando sua sessão..." />
  }

  if (!usuario) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(local.pathname)}`}
        replace
      />
    )
  }

  return children
}
