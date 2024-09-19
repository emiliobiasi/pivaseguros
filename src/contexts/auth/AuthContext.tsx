import { createContext, useState, ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import pb, { PocketBaseError } from "@/utils/backend/pb";

interface AuthContextProps {
  isAuthenticated: boolean;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithApple: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
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
      await pb.collection("users").authWithPassword(email, password);
      setIsAuthenticated(true);
      navigate("/inicio");
    } catch (err) {
      pb.handleError(err as PocketBaseError);
      throw err;
    }
  };

  const loginWithGoogle = async () => {
    try {
      await pb.collection("users").authWithOAuth2({
        provider: "google",
        urlCallback: (url) => {
          window.open(
            url,
            "_blank",
            "width=500,height=600,menubar=no,toolbar=no,scrollbars=yes"
          );
        },
      });
      setIsAuthenticated(true);
      navigate("/home");
    } catch (err) {
      pb.handleError(err as PocketBaseError);
      throw err;
    }
  };

  const loginWithApple = async () => {
    try {
      await pb.collection("users").authWithOAuth2({
        provider: "apple",
        urlCallback: (url) => {
          window.open(
            url,
            "_blank",
            "width=500,height=600,menubar=no,toolbar=no,scrollbars=yes"
          );
        },
      });
      setIsAuthenticated(true);
      navigate("/inicio");
    } catch (err) {
      pb.handleError(err as PocketBaseError);
      throw err;
    }
  };

  const logout = () => {
    pb.logout();
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loginWithEmail,
        loginWithGoogle,
        loginWithApple,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
