import React, { createContext, useContext, useState } from "react"

interface BoletosContextType {
  allBoletosDownloaded: boolean
  setAllBoletosDownloaded: (value: boolean) => void
  hasBoletosToDownload: boolean
  setHasBoletosToDownload: (value: boolean) => void
  isProcessFinalized: boolean
  setIsProcessFinalized: (value: boolean) => void
  refreshData: () => void
  isRefreshing: boolean
}

const BoletosContext = createContext<BoletosContextType | undefined>(undefined)

export function BoletosProvider({ children }: { children: React.ReactNode }) {
  const [allBoletosDownloaded, setAllBoletosDownloaded] = useState(false)
  const [hasBoletosToDownload, setHasBoletosToDownload] = useState(false)
  const [isProcessFinalized, setIsProcessFinalized] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = () => {
    setIsRefreshing(true)

    // Simula um pequeno delay para dar feedback visual ao usuário
    setTimeout(() => {
      setIsRefreshing(false)
    }, 500)
  }

  return (
    <BoletosContext.Provider
      value={{
        allBoletosDownloaded,
        setAllBoletosDownloaded,
        hasBoletosToDownload,
        setHasBoletosToDownload,
        isProcessFinalized,
        setIsProcessFinalized,
        refreshData,
        isRefreshing,
      }}
    >
      {children}
    </BoletosContext.Provider>
  )
}

export function useBoletosContext() {
  const context = useContext(BoletosContext)
  if (!context) {
    throw new Error("useBoletosContext must be used within a BoletosProvider")
  }
  return context
}
