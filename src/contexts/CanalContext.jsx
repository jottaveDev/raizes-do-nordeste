import { createContext, useContext, useState } from 'react'
import { canais } from '../data/canais'
import { lerStorage, salvarStorage } from '../services/api'
import { CHAVES } from '../utils/constantes'

const CanalContext = createContext(null)

const idsValidos = canais.map((canal) => canal.id)

export function CanalProvider({ children }) {
  const [canal, setCanal] = useState(() => {
    const salvo = lerStorage(CHAVES.canal, 'web')
    return idsValidos.includes(salvo) ? salvo : 'web'
  })

  function selecionarCanal(id) {
    if (!idsValidos.includes(id)) return
    setCanal(id)
    salvarStorage(CHAVES.canal, id)
  }

  const dadosCanal = canais.find((item) => item.id === canal) || canais[0]

  return (
    <CanalContext.Provider value={{ canal, dadosCanal, canais, selecionarCanal }}>
      {children}
    </CanalContext.Provider>
  )
}

export function useCanal() {
  const contexto = useContext(CanalContext)
  if (!contexto) {
    throw new Error('useCanal deve ser usado dentro de CanalProvider.')
  }
  return contexto
}
