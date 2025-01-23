import { useNavigate } from "react-router-dom";
import pivaLogo from "@/assets/logo.png";
import { HamburguerMenu } from "../HambuguerMenu/hamburguer-menu";

export function HeaderFormMenu() {
  const navigate = useNavigate();

  return (
    <header className="flex h-28 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Menu Hambúrguer à esquerda */}
      <HamburguerMenu />

      {/* Logo */}
      <div
        onClick={() => navigate("/imobiliaria/formulario")}
        className="w-40 h-auto cursor-pointer sm:mx-auto lg:ml-auto lg:mr-0"
      >
        <img
          src={pivaLogo}
          alt="Logo"
          className="lg:me-10 md:me-6 sm:mx-auto"
        />
      </div>
    </header>
  );
}
