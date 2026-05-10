import { createContext, useContext, type ReactNode } from 'react'
import type { Side } from './sideConfig'

/** Read ?side=groom|bride from window.location once. Anything else falls back to 'groom'. */
export function detectSide(): Side {
  if (typeof window === 'undefined') return 'groom'
  const param = new URLSearchParams(window.location.search).get('side')
  return param === 'groom' || param === 'bride' ? param : 'groom'
}

const SideContext = createContext<Side>('groom')

export function SideProvider({ side, children }: { side: Side; children: ReactNode }) {
  return <SideContext.Provider value={side}>{children}</SideContext.Provider>
}

export function useSide(): Side {
  return useContext(SideContext)
}
