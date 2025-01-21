import { useNavigate } from "react-router-dom";
import pivaLogo from "@/assets/logo.png";
import { HamburguerMenu } from "../HambuguerMenu/hamburguer-menu";

export function HeaderFormMenu() {
  const navigate = useNavigate();

  return (
    <header className="flex h-28 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Menu e Ícone do Menu Hambúrguer à esquerda */}
      <HamburguerMenu />

      {/* Logo na direita */}
      <div
        onClick={() => navigate("/imobiliaria/formulario")}
        className="w-40 h-auto sm:my-8 cursor-pointer"
      >
        <img src={pivaLogo} alt="Logo" className="lg:ms-20 md:ms-10" />
      </div>
    </header>
  );
}
