import { createContext, useContext, type ReactNode } from 'react'
import type { Side } from './sideConfig'

/** Read ?side=groom|bride from window.location once. Anything else falls back to 'combined'. */
export function detectSide(): Side {
  if (typeof window === 'undefined') return 'combined'
  const param = new URLSearchParams(window.location.search).get('side')
  return param === 'groom' || param === 'bride' ? param : 'combined'
}

const SideContext = createContext<Side>('combined')

export function SideProvider({ side, children }: { side: Side; children: ReactNode }) {
  return <SideContext.Provider value={side}>{children}</SideContext.Provider>
}

export function useSide(): Side {
  return useContext(SideContext)
}
