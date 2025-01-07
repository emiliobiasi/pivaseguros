import { createContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pb, { PocketBaseError } from "@/utils/backend/pb";

interface AuthImobiliariaContextProps {
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const AuthImobiliariaContext =
  createContext<AuthImobiliariaContextProps | null>(null);

interface AuthImobiliariaProviderProps {
  children: ReactNode;
}

export const AuthImobiliariaProvider = ({
  children,
}: AuthImobiliariaProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(pb.authStore.isValid);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = pb.authStore.onChange(() => {
      setIsAuthenticated(pb.authStore.isValid);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await pb.collection("imobiliarias").authWithPassword(email, password);
      setIsAuthenticated(true);
      navigate("/dashboard-imobiliarias"); // Redireciona para o dashboard das imobiliárias
    } catch (err) {
      pb.handleError(err as PocketBaseError);
      throw err;
    }
  };

  const logout = () => {
    pb.logout();
    setIsAuthenticated(false);
    navigate("/entrar-imobiliaria");
  };

  return (
    <AuthImobiliariaContext.Provider
      value={{
        isAuthenticated,
        loginWithEmail,
        logout,
      }}
    >
      {children}
    </AuthImobiliariaContext.Provider>
  );
};
