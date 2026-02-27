import { createContext, useContext } from "react";
import { useDesktop } from "../hooks/useDesktop";

const DesktopContext = createContext(null);

export function DesktopProvider({ children }) {
  const desktop = useDesktop();
  return (
    <DesktopContext.Provider value={desktop}>
      {children}
    </DesktopContext.Provider>
  );
}

export function useDesktopContext() {
  const ctx = useContext(DesktopContext);
  if (!ctx) throw new Error("useDesktopContext must be used within DesktopProvider");
  return ctx;
}
