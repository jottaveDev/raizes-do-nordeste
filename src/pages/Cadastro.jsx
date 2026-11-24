import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Alerta from '../components/ui/Alerta'
import AvisoLGPD from '../components/ui/AvisoLGPD'
import Botao from '../components/ui/Botao'
import Campo from '../components/ui/Campo'
import Card from '../components/ui/Card'
import { useAuth } from '../contexts/AuthContext'
import { validarEmail, validarNome, validarSenha, validarTelefone } from '../utils/validacoes'

export default function Cadastro() {
  const { usuario, cadastrar } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const redirect = searchParams.get('redirect')
  const destino = redirect && redirect !== '/cadastro' ? redirect : '/'

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [consentimento, setConsentimento] = useState(false)
  const [marketing, setMarketing] = useState(false)
  const [erros, setErros] = useState({})
  const [erroGeral, setErroGeral] = useState('')
  const [carregando, setCarregando] = useState(false)

  useEffect(() => {
    if (usuario) {
      navigate(destino, { replace: true })
    }
  }, [usuario, destino, navigate])

  async function enviar(evento) {
    evento.preventDefault()
    setErroGeral('')

    const novosErros = {}
    if (!validarNome(nome)) novosErros.nome = 'Informe seu nome completo.'
    if (!validarEmail(email)) novosErros.email = 'Informe um e-mail válido.'
    if (!validarTelefone(telefone)) novosErros.telefone = 'Informe um telefone com DDD.'
    if (!validarSenha(senha)) novosErros.senha = 'A senha deve ter pelo menos 6 caracteres.'
    if (senha !== confirmarSenha) {
      novosErros.confirmarSenha = 'As senhas não conferem.'
    }
    if (!consentimento) {
      novosErros.consentimento = 'O consentimento é obrigatório para criar a conta.'
    }

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    setCarregando(true)
    try {
      await cadastrar({
        nome,
        email,
        telefone,
        senha,
        consentimentoMarketing: marketing,
      })
      navigate(destino, { replace: true })
    } catch (erro) {
      setErroGeral(erro.message)
    } finally {
      setCarregando(false)
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="text-2xl font-bold text-marrom">Criar conta</h1>
      <p className="mt-1 text-sm text-marrom-claro">
        Ganhe 20 pontos de boas-vindas e acompanhe seus pedidos.
      </p>

      <Card className="mt-5">
        {erroGeral && (
          <Alerta tipo="erro" className="mb-4">
            {erroGeral}
          </Alerta>
        )}

        <form onSubmit={enviar} className="space-y-4">
          <Campo
            id="cadastro-nome"
            label="Nome completo"
            obrigatorio
            value={nome}
            onChange={(evento) => setNome(evento.target.value)}
            erro={erros.nome}
            autoComplete="name"
          />
          <Campo
            id="cadastro-email"
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
            id="cadastro-telefone"
            label="Telefone"
            obrigatorio
            placeholder="(81) 99999-0000"
            value={telefone}
            onChange={(evento) => setTelefone(evento.target.value)}
            erro={erros.telefone}
            autoComplete="tel"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <Campo
              id="cadastro-senha"
              label="Senha"
              obrigatorio
              type="password"
              value={senha}
              onChange={(evento) => setSenha(evento.target.value)}
              erro={erros.senha}
              dica="Mínimo de 6 caracteres."
              autoComplete="new-password"
            />
            <Campo
              id="cadastro-confirmar-senha"
              label="Confirmar senha"
              obrigatorio
              type="password"
              value={confirmarSenha}
              onChange={(evento) => setConfirmarSenha(evento.target.value)}
              erro={erros.confirmarSenha}
              autoComplete="new-password"
            />
          </div>

          <AvisoLGPD
            aceito={consentimento}
            aoMudar={setConsentimento}
            marketing={marketing}
            aoMudarMarketing={setMarketing}
            erro={erros.consentimento}
          />

          <Botao tipo="submit" tamanho="lg" className="w-full" disabled={carregando}>
            {carregando ? 'Criando conta...' : 'Criar conta'}
          </Botao>
        </form>

        <p className="mt-4 text-center text-sm text-marrom-claro">
          Já tem conta?{' '}
          <Link to="/login" className="font-semibold text-terracota underline">
            Entrar
          </Link>
        </p>
      </Card>

      <p className="mt-4 text-center text-xs text-marrom-claro">
        Cadastro simulado: os dados ficam apenas neste navegador.
      </p>
    </div>
  )
}
