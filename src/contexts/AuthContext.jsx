import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    setUsuario(authService.usuarioSalvo())
    setCarregando(false)
  }, [])

  async function entrar(email, senha) {
    const usuarioAutenticado = await authService.login(email, senha)
    setUsuario(usuarioAutenticado)
    return usuarioAutenticado
  }

  async function cadastrar(dados) {
    const novoUsuario = await authService.cadastrar(dados)
    setUsuario(novoUsuario)
    return novoUsuario
  }

  function sair() {
    authService.sair()
    setUsuario(null)
  }

  function atualizarUsuario(dados) {
    const atualizado = authService.atualizarUsuario(dados)
    setUsuario(atualizado)
    return atualizado
  }

  function registrarPontos(quantidade, descricao) {
    const atualizado = authService.registrarPontos(quantidade, descricao)
    setUsuario(atualizado)
    return atualizado
  }

  function excluirConta() {
    authService.excluirConta()
    setUsuario(null)
  }

  const valor = {
    usuario,
    carregando,
    entrar,
    cadastrar,
    sair,
    atualizarUsuario,
    registrarPontos,
    excluirConta,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const contexto = useContext(AuthContext)
  if (!contexto) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.')
  }
  return contexto
}
