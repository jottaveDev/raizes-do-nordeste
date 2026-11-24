import { usuariosIniciais } from '../data/usuarios'
import { CHAVES, PONTOS_BOAS_VINDAS } from '../utils/constantes'
import { esperar, lerStorage, removerStorage, salvarStorage } from './api'

function garantirUsuarios() {
  const usuarios = lerStorage(CHAVES.usuarios, null)
  if (!usuarios) {
    salvarStorage(CHAVES.usuarios, usuariosIniciais)
  }
}

function lerUsuarios() {
  garantirUsuarios()
  return lerStorage(CHAVES.usuarios, [])
}

function usuarioPublico(usuario) {
  const { senha, ...publico } = usuario
  return publico
}

function salvarSessao(usuario) {
  salvarStorage(CHAVES.sessao, usuarioPublico(usuario))
}

export const authService = {
  usuarioSalvo() {
    return lerStorage(CHAVES.sessao, null)
  },

  async login(email, senha) {
    await esperar()
    const usuarios = lerUsuarios()
    const usuario = usuarios.find(
      (item) => item.email.toLowerCase() === String(email).trim().toLowerCase(),
    )

    if (!usuario || usuario.senha !== senha) {
      throw new Error('E-mail ou senha inválidos.')
    }

    salvarSessao(usuario)
    return usuarioPublico(usuario)
  },

  async cadastrar({ nome, email, telefone, senha, consentimentoMarketing }) {
    await esperar()
    const usuarios = lerUsuarios()
    const emailNormalizado = String(email).trim().toLowerCase()

    if (usuarios.some((item) => item.email.toLowerCase() === emailNormalizado)) {
      throw new Error('Este e-mail já está cadastrado.')
    }

    const agora = new Date().toISOString()
    const novoUsuario = {
      id: `usuario-${Date.now()}`,
      nome: String(nome).trim(),
      email: emailNormalizado,
      telefone: String(telefone).trim(),
      senha,
      pontos: PONTOS_BOAS_VINDAS,
      consentimentoMarketing: Boolean(consentimentoMarketing),
      criadoEm: agora,
      historicoPontos: [
        {
          id: `ponto-${Date.now()}`,
          descricao: 'Bônus de boas-vindas',
          pontos: PONTOS_BOAS_VINDAS,
          data: agora,
        },
      ],
    }

    usuarios.push(novoUsuario)
    salvarStorage(CHAVES.usuarios, usuarios)
    salvarSessao(novoUsuario)
    return usuarioPublico(novoUsuario)
  },

  sair() {
    removerStorage(CHAVES.sessao)
  },

  atualizarUsuario(dados) {
    const sessao = lerStorage(CHAVES.sessao, null)
    if (!sessao) throw new Error('Nenhum usuário autenticado.')

    const usuarios = lerUsuarios()
    const indice = usuarios.findIndex((item) => item.id === sessao.id)
    if (indice === -1) throw new Error('Usuário não encontrado.')

    const atualizado = { ...usuarios[indice], ...dados }
    usuarios[indice] = atualizado
    salvarStorage(CHAVES.usuarios, usuarios)
    salvarSessao(atualizado)
    return usuarioPublico(atualizado)
  },

  registrarPontos(quantidade, descricao) {
    const sessao = lerStorage(CHAVES.sessao, null)
    if (!sessao) throw new Error('Nenhum usuário autenticado.')

    const usuarios = lerUsuarios()
    const indice = usuarios.findIndex((item) => item.id === sessao.id)
    if (indice === -1) throw new Error('Usuário não encontrado.')

    const usuario = usuarios[indice]
    const historico = usuario.historicoPontos || []
    const atualizado = {
      ...usuario,
      pontos: Math.max(0, usuario.pontos + quantidade),
      historicoPontos: [
        {
          id: `ponto-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          descricao,
          pontos: quantidade,
          data: new Date().toISOString(),
        },
        ...historico,
      ],
    }

    usuarios[indice] = atualizado
    salvarStorage(CHAVES.usuarios, usuarios)
    salvarSessao(atualizado)
    return usuarioPublico(atualizado)
  },

  excluirConta() {
    const sessao = lerStorage(CHAVES.sessao, null)
    if (!sessao) return

    const usuarios = lerUsuarios().filter((item) => item.id !== sessao.id)
    salvarStorage(CHAVES.usuarios, usuarios)
    removerStorage(CHAVES.sessao)
  },
}
