import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthImobiliariaContext } from "@/contexts/auth/imobiliarias/AuthContextImobiliárias";

interface PrivateRouteImobiliariasProps {
  children: ReactNode;
}

const PrivateRouteImobiliarias = ({
  children,
}: PrivateRouteImobiliariasProps) => {
  const authContext = useContext(AuthImobiliariaContext);

  if (!authContext?.isAuthenticated) {
    return <Navigate to="/imobiliarias/entrar" />;
  }

  return <>{children}</>;
};

export default PrivateRouteImobiliarias;
