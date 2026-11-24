export function esperar(ms = 400) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function simularRequisicao(dados, ms = 400) {
  await esperar(ms)
  return dados
}

export function lerStorage(chave, valorPadrao) {
  try {
    const valor = localStorage.getItem(chave)
    if (!valor) return valorPadrao
    return JSON.parse(valor)
  } catch (erro) {
    console.error(`Nao foi possivel ler a chave ${chave}`, erro)
    return valorPadrao
  }
}

export function salvarStorage(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor))
}

export function removerStorage(chave) {
  localStorage.removeItem(chave)
}
