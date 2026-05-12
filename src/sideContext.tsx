import { createContext, useContext, type ReactNode } from "react";
import type { Side } from "./sideConfig";

/** Read /groom or /bride from window.location.pathname once. Anything else
 *  falls back to 'groom'. The first path segment is taken so /groom/anything
 *  still resolves. Hosting layer (vercel.json rewrites) sends every path to
 *  index.html, so this works without a router. */
// eslint-disable-next-line react-refresh/only-export-components
export function detectSide(): Side {
  if (typeof window === "undefined") return "groom";
  const segment = window.location.pathname.split("/").filter(Boolean)[0];
  return segment === "groom" || segment === "bride" ? segment : "groom";
}

const SideContext = createContext<Side>("groom");

export function SideProvider({
  side,
  children,
}: {
  side: Side;
  children: ReactNode;
}) {
  return <SideContext.Provider value={side}>{children}</SideContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSide(): Side {
  return useContext(SideContext);
}
