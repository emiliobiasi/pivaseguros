import { Flame, Building, Home, ExternalLink, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // Importe o useNavigate
import logo from "@/assets/logo.png";

type SideBarProps = {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
};

export function SideBar({ sidebarOpen, toggleSidebar }: SideBarProps) {
  const navigate = useNavigate(); // useNavigate hook para navegação programática

  return (
    <div>
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            <img src={logo} alt="Logo" />
          </span>
        </div>
        <SidebarContent navigate={navigate} />
      </aside>

      {/* Mobile sidebar */}
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
            <SidebarContent navigate={navigate} />
          </div>
        </div>
      )}
    </div>
  );
}

type SidebarContentProps = {
  navigate: ReturnType<typeof useNavigate>; // Define o tipo de navigate
};

function SidebarContent({ navigate }: SidebarContentProps) {
  return (
    <nav className="flex-grow">
      <ul className="space-y-2 py-4">
        <li>
          <button
            onClick={() => navigate("/dashboard-incendio")}
            className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Flame className="h-5 w-5 mr-3" />
            <span>Incêndio</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/dashboard-fianca-residencial")}
            className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Building className="h-5 w-5 mr-3" />
            <span>Fiança Empresarial</span>
          </button>
        </li>
        <li>
          <button
            onClick={() => navigate("/dashboard-fianca-residencial")}
            className="flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Fiança Residencial</span>
          </button>
        </li>
        <li>
          <a
            href="https://piva-orcamentos-01.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-5 w-5 mr-3" />
            <span>Fazer orçamento</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
