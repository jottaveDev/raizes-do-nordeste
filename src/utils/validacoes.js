export function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email).trim())
}

export function validarTelefone(telefone) {
  const digitos = String(telefone).replace(/\D/g, '')
  return digitos.length === 10 || digitos.length === 11
}

export function validarSenha(senha) {
  return String(senha).length >= 6
}

export function validarNome(nome) {
  return String(nome).trim().length >= 3
}
