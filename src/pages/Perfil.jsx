import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Alerta from '../components/ui/Alerta'
import Botao from '../components/ui/Botao'
import Campo from '../components/ui/Campo'
import Card from '../components/ui/Card'
import Modal from '../components/ui/Modal'
import { useAuth } from '../contexts/AuthContext'
import { useCarrinho } from '../contexts/CarrinhoContext'
import { pedidosService } from '../services/pedidosService'
import { formatarData } from '../utils/formatadores'
import { validarNome, validarTelefone } from '../utils/validacoes'

export default function Perfil() {
  const { usuario, atualizarUsuario, excluirConta, sair } = useAuth()
  const { limpar: limparCarrinho } = useCarrinho()
  const navigate = useNavigate()

  const [nome, setNome] = useState(usuario.nome)
  const [telefone, setTelefone] = useState(usuario.telefone)
  const [marketing, setMarketing] = useState(usuario.consentimentoMarketing)
  const [erros, setErros] = useState({})
  const [mensagem, setMensagem] = useState('')
  const [erro, setErro] = useState('')
  const [modalExcluir, setModalExcluir] = useState(false)
  const [excluindo, setExcluindo] = useState(false)

  function salvarDados(evento) {
    evento.preventDefault()
    setMensagem('')
    setErro('')

    const novosErros = {}
    if (!validarNome(nome)) novosErros.nome = 'Informe seu nome completo.'
    if (!validarTelefone(telefone)) novosErros.telefone = 'Informe um telefone com DDD.'

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros)
      return
    }

    try {
      atualizarUsuario({
        nome: nome.trim(),
        telefone: telefone.trim(),
        consentimentoMarketing: marketing,
      })
      setErros({})
      setMensagem('Dados atualizados com sucesso.')
    } catch (erroAtualizacao) {
      setErro(erroAtualizacao.message)
    }
  }

  async function confirmarExclusao() {
    setExcluindo(true)
    try {
      await pedidosService.excluirPorUsuario(usuario.id)
      limparCarrinho()
      excluirConta()
      navigate('/', {
        state: {
          mensagem:
            'Seus dados de conta e pedidos foram excluídos deste navegador. Você pode criar uma nova conta quando quiser.',
        },
      })
    } catch (erroExclusao) {
      setErro(erroExclusao.message)
      setExcluindo(false)
      setModalExcluir(false)
    }
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-marrom">Meu perfil</h1>
        <p className="mt-1 text-sm text-marrom-claro">
          Gerencie seus dados, consentimentos e pedidos.
        </p>
      </div>

      {mensagem && (
        <Alerta tipo="sucesso" className="mb-4">
          {mensagem}
        </Alerta>
      )}
      {erro && (
        <Alerta tipo="erro" className="mb-4">
          {erro}
        </Alerta>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-start">
        <div className="space-y-4">
          <Card>
            <h2 className="mb-4 text-lg font-bold text-marrom">Dados pessoais</h2>
            <form onSubmit={salvarDados} className="space-y-4">
              <Campo
                id="perfil-nome"
                label="Nome completo"
                obrigatorio
                value={nome}
                onChange={(evento) => setNome(evento.target.value)}
                erro={erros.nome}
                autoComplete="name"
              />
              <Campo
                id="perfil-email"
                label="E-mail"
                value={usuario.email}
                disabled
                dica="O e-mail é usado para login e não pode ser alterado neste protótipo."
              />
              <Campo
                id="perfil-telefone"
                label="Telefone"
                obrigatorio
                value={telefone}
                onChange={(evento) => setTelefone(evento.target.value)}
                erro={erros.telefone}
                autoComplete="tel"
              />

              <label className="flex items-start gap-2 rounded-lg border border-marrom/15 bg-creme p-3 text-sm text-marrom">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(evento) => setMarketing(evento.target.checked)}
                  className="mt-1 h-4 w-4 accent-terracota"
                />
                <span>
                  Quero receber promoções e novidades. Este consentimento é opcional e pode
                  ser revogado a qualquer momento.
                </span>
              </label>

              <Botao tipo="submit">Salvar alterações</Botao>
            </form>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Privacidade e LGPD</h2>
            <p className="text-sm text-marrom-claro">
              Seus dados ficam apenas no armazenamento local deste navegador. Você pode
              consultar a{' '}
              <Link to="/lgpd" className="font-semibold text-terracota underline">
                Política de Privacidade
              </Link>{' '}
              e solicitar a exclusão a qualquer momento.
            </p>

            <dl className="mt-3 space-y-1 text-sm">
              <div className="flex justify-between gap-4">
                <dt className="text-marrom-claro">Consentimento de marketing</dt>
                <dd className="font-medium text-marrom">
                  {usuario.consentimentoMarketing ? 'Ativo' : 'Não autorizado'}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-marrom-claro">Conta criada em</dt>
                <dd className="font-medium text-marrom">{formatarData(usuario.criadoEm)}</dd>
              </div>
            </dl>

            <button
              type="button"
              onClick={() => setModalExcluir(true)}
              className="mt-4 rounded-lg border border-red-300 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-50"
            >
              Solicitar exclusão dos meus dados
            </button>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Resumo</h2>
            <p className="text-sm text-marrom-claro">
              <strong className="text-marrom">{usuario.pontos} pontos</strong> de fidelidade
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <Botao para="/pedidos" variante="contorno">
                Meus pedidos
              </Botao>
              <Botao para="/fidelidade" variante="contorno">
                Meu saldo de pontos
              </Botao>
            </div>
          </Card>

          <Card>
            <h2 className="mb-3 text-lg font-bold text-marrom">Sessão</h2>
            <p className="text-sm text-marrom-claro">
              Você está autenticado como {usuario.nome}.
            </p>
            <Botao variante="fantasma" className="mt-2 px-0" onClick={sair}>
              Sair da conta
            </Botao>
          </Card>
        </div>
      </div>

      <Modal
        aberto={modalExcluir}
        titulo="Excluir meus dados"
        onFechar={() => setModalExcluir(false)}
      >
        <p className="text-sm text-marrom-claro">
          Esta ação remove sua conta, seus pedidos e seus pontos deste navegador. Não é
          possível desfazer.
        </p>
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <Botao variante="contorno" onClick={() => setModalExcluir(false)}>
            Cancelar
          </Botao>
          <Botao variante="perigo" onClick={confirmarExclusao} disabled={excluindo}>
            {excluindo ? 'Excluindo...' : 'Excluir meus dados'}
          </Botao>
        </div>
      </Modal>
    </div>
  )
}
