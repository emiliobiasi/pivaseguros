import {
  Flame,
  Home,
  ExternalLink,
  X,
  LogOut,
  Menu,
  Building2,
  Building,
  CaptionsIcon,
  Coins,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";
import { useAuth } from "@/contexts/auth/useAuth";
import { HomeIcon } from "@radix-ui/react-icons";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

type SideBarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export function SideBar({ sidebarOpen, toggleSidebar }: SideBarProps) {
  const navigate = useNavigate();

  return (
    <div>
      {/* Botão de hambúrguer para telas menores */}
      <div className="md:hidden flex items-center justify-between h-16 px-4 bg-white dark:bg-gray-800 shadow">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Menu className="h-6 w-6" />
        </button>
        {/* Removemos a imagem do logo aqui para que não apareça em telas menores */}
      </div>

      {/* Sidebar para telas maiores */}
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span
            className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
            onClick={() => navigate("/inicio")}
          >
            <img src={logo} alt="Logo" />
          </span>
        </div>
        <SidebarContent />
      </aside>

      {/* Sidebar móvel */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Piva Seguros
              </span>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}
    </div>
  );
}

function SidebarContent() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex flex-col flex-grow justify-between">
      <ul className="space-y-2 py-4">
        {/* Início */}
        <li>
          <button
            onClick={() => navigate("/inicio")}
            className={`flex items-center w-full px-4 py-2 text-left text-sm ${
              location.pathname === "/inicio"
                ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Home className="h-5 w-5 mr-3 " />
            <span>Início</span>
          </button>
        </li>

        {/* Dashboards Incêndio */}
        <li>
          <Accordion type="single" collapsible>
            <AccordionItem value="incendio">
              <AccordionTrigger className="flex items-center w-full px-4 py-2 text-left">
                <Flame className="h-5 w-5 mr-3" />
                <span>Dashboards Incêndio</span>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <ul className="space-y-2">
                  {/* Incêndio Residencial */}
                  <li>
                    <button
                      onClick={() => navigate("/dashboard-incendio")}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-incendio"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      <span>Incêndio Residencial</span>
                    </button>
                  </li>

                  {/* Incêndio Comercial */}
                  <li>
                    <button
                      onClick={() => navigate("/dashboard-incendio-comercial")}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-incendio-comercial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building className="h-5 w-5 mr-3" />
                      <span>Incêndio Comercial</span>
                    </button>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>

        {/* Dashboards Fiança */}
        <li>
          <Accordion type="single" collapsible>
            <AccordionItem value="fianca">
              <AccordionTrigger className="flex items-center w-full px-4 py-2 text-left">
                <Coins className="h-5 w-5 mr-3" />
                <span>Dashboards Fiança</span>
              </AccordionTrigger>
              <AccordionContent className="pl-4">
                <ul className="space-y-2">
                  {/* Fiança Residencial */}
                  <li>
                    <button
                      onClick={() => navigate("/dashboard-fianca-residencial")}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-fianca-residencial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      <span>Fiança Residencial</span>
                    </button>
                  </li>

                  {/* Fiança Empresarial Mais de 2 Anos */}
                  <li>
                    <button
                      onClick={() =>
                        navigate("/dashboard-fianca-empresarial-mais-2-anos")
                      }
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-mais-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building className="h-5 w-5 mr-3" />
                      <span>Fiança CNPJ Acima de 2 Anos</span>
                    </button>
                  </li>

                  {/* Fiança Empresarial Menos de 2 Anos */}
                  <li>
                    <button
                      onClick={() =>
                        navigate("/dashboard-fianca-empresarial-menos-2-anos")
                      }
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-menos-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mr-3" />
                      <span>Fiança CNPJ Menos de 2 Anos</span>
                    </button>
                  </li>

                  {/* EFETIVACAO SEGURO FIANCA */}
                  <li>
                    <button
                      onClick={() =>
                        navigate("/dashboard-efetivacao-seguro-fianca")
                      }
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-efetivacao-seguro-fianca"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Coins className="h-5 w-5 mr-3" />
                      <span>Efetivação Seguro Fiança</span>
                    </button>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>

        {/* TT CAPITALIZACAO */}
        <li>
          <button
            onClick={() => navigate("/dashboard-titulo-capitalizacao")}
            className={`flex items-center w-full px-4 py-2 text-left text-sm ${
              location.pathname === "/dashboard-titulo-capitalizacao"
                ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <CaptionsIcon className="h-5 w-5 mr-3" />
            <span>Título de Capitalização</span>
          </button>
        </li>

        <li>
          <a
            href="https://piva-orcamentos-01.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-5 w-5 mr-3" />
            <span>Fazer orçamento</span>
          </a>
        </li>
      </ul>

      {/* Botão de Logout */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white dark:hover:bg-red-600"
        >
          <LogOut className="h-9 w-5 mr-3" />
          <span>Sair</span>
        </button>
      </div>
    </nav>
  );
}