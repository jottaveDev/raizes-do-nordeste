import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Campo from '../components/ui/Campo'
import Card from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { validarEmail } from '../utils/validacoes'

export default function Login() {
  const { usuario, entrar } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirect = searchParams.get('redirect')
  const destino = redirect && redirect !== '/login' ? redirect : '/'

  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (usuario) {
      navigate(destino, { replace: true })
    }
  }, [usuario, destino, navigate])

  function preencherDemo() {
    setEmail('demo@raizes.com')
    setSenha('123456')
    setErros({})
    setErroGeral('')
  }

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral('')

    const novosErros = {}
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido.'
    if (!senha) novosErros.senha = 'Informe sua senha.'

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    setCarregando(true)
    try {
      await entrar(email, senha)
      navigate(destino, { replace: true })
    } catch (erro) {
      setErroGeral(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-bold text-marrom">Entrar na sua conta</h1>
      <p className="mt-1 text-sm text-marrom-claro">
        Acesse para finalizar pedidos e acompanhar seus pontos.
      </p>

      <Card className="mt-5">
        {erroGeral && (
          <Alerta tipo="erro" className="mb-4">
            {erroGeral}
          </Alerta>
        )}

        <form onSubmit={enviar} className="space-y-4">
          <Campo
            id="login-email"
            label="E-mail"
            obrigatorio
            type="email"
            placeholder="voce@exemplo.com"
            value={email}
            onChange={(evento) => setEmail(evento.target.value)}
            erro={erros.email}
            autoComplete="email"
          />
          <Campo
            id="login-senha"
            label="Senha"
            obrigatorio
            type="password"
            placeholder="Sua senha"
            value={senha}
            onChange={(evento) => setSenha(evento.target.value)}
            erro={erros.senha}
            autoComplete="current-password"
          />

          <Botao tipo="submit" tamanho="lg" className="w-full" disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </Botao>
        </form>

        <div className="mt-4 rounded-lg bg-creme p-3 text-sm">
          <p className="font-semibold text-marrom">Conta de demonstração</p>
          <p className="mt-1 text-marrom-claro">
            E-mail: demo@raizes.com
            <br />
            Senha: 123456
          </p>
          <button
            type="button"
            onClick={preencherDemo}
            className="mt-2 text-sm font-semibold text-terracota underline"
          >
            Preencher automaticamente
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-marrom-claro">
          Ainda não tem conta?{' '}
          <Link to="/cadastro" className="font-semibold text-terracota underline">
            Cadastre-se
          </Link>
        </p>
      </Card>

      <p className="mt-4 text-center text-xs text-marrom-claro">
        Autenticação simulada. Nenhuma senha é enviada para servidores.
      </p>
    </div>
  )
}
