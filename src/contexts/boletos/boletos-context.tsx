import React, { createContext, useContext, useState } from "react";

interface BoletosContextType {
  allBoletosDownloaded: boolean;
  setAllBoletosDownloaded: (value: boolean) => void;
  hasBoletosToDownload: boolean;
  setHasBoletosToDownload: (value: boolean) => void;
  isProcessFinalized: boolean;
  setIsProcessFinalized: (value: boolean) => void;
}

const BoletosContext = createContext<BoletosContextType | undefined>(undefined);

export function BoletosProvider({ children }: { children: React.ReactNode }) {
  const [allBoletosDownloaded, setAllBoletosDownloaded] = useState(false);
  const [hasBoletosToDownload, setHasBoletosToDownload] = useState(false);
  const [isProcessFinalized, setIsProcessFinalized] = useState(false);

  return (
    <BoletosContext.Provider
      value={{
        allBoletosDownloaded,
        setAllBoletosDownloaded,
        hasBoletosToDownload,
        setHasBoletosToDownload,
        isProcessFinalized,
        setIsProcessFinalized,
      }}
    >
      {children}
    </BoletosContext.Provider>
  );
}

export function useBoletosContext() {
  const context = useContext(BoletosContext);
  if (!context) {
    throw new Error("useBoletosContext must be used within a BoletosProvider");
  }
  return context;
}
