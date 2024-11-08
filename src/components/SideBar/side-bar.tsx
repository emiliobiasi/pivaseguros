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
  ChartBar,
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
import { useEffect, useState } from "react";
import { Notificacao } from "@/types/Notificacao";
import {
  fetchAllNotifications,
  subscribeToNotificationsUpdates,
  unsubscribeFromNotificationsUpdates,
  deleteNotifications,
} from "@/utils/api/NotificacoesService";

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
      </div>

      {/* Sidebar para telas maiores */}
      <aside className="hidden md:flex flex-col w-60 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span
            className="text-xl font-bold text-gray-800 dark:text-white cursor-pointer"
            onClick={() => navigate("/inicio")}
          >
            <img
              src={logo}
              alt="Logo"
              onClick={() => window.location.reload()}
            />
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
  const [notifications, setNotifications] = useState<Notificacao[]>([]);
  const [notificationsCount, setNotificationsCount] = useState({
    form_seguro_incendio: 0,
    form_seguro_incendio_comercial: 0,
    form_seguro_fianca_residencial: 0,
    form_seguro_fianca_empresarial_mais_2_anos: 0,
    form_seguro_fianca_empresarial_menos_2_anos: 0,
    form_efetivacao_seguro_fianca_tb: 0,
    // form_titulo_capitalizacao: 0, COMENTANDO ATÉ CORRIGIR O ERRO
  });

  useEffect(() => {
    // Função para buscar as notificações inicialmente
    async function fetchNotifications() {
      const { items: notifications } = await fetchAllNotifications();
      setNotifications(notifications); // Armazena as notificações

      const counts = {
        form_seguro_incendio: 0,
        form_seguro_incendio_comercial: 0,
        form_seguro_fianca_residencial: 0,
        form_seguro_fianca_empresarial_mais_2_anos: 0,
        form_seguro_fianca_empresarial_menos_2_anos: 0,
        form_efetivacao_seguro_fianca_tb: 0,
        // form_titulo_capitalizacao: 0, COMENTANDO ATÉ CORRIGIR O ERRO
      };

      // Contar notificações por tipo de formulário
      notifications.forEach((notification) => {
        if (notification.form_seguro_incendio) counts.form_seguro_incendio++;
        if (notification.form_seguro_incendio_comercial)
          counts.form_seguro_incendio_comercial++;
        if (notification.form_seguro_fianca_residencial)
          counts.form_seguro_fianca_residencial++;
        if (notification.form_seguro_fianca_empresarial_mais_2_anos)
          counts.form_seguro_fianca_empresarial_mais_2_anos++;
        if (notification.form_seguro_fianca_empresarial_menos_2_anos)
          counts.form_seguro_fianca_empresarial_menos_2_anos++;
        if (notification.form_efetivacao_seguro_fianca_tb)
          counts.form_efetivacao_seguro_fianca_tb++;
        // if (notification.form_titulo_capitalizacao)
        //   counts.form_titulo_capitalizacao++; COMENTANDO ATÉ CORRIGIR O ERRO
      });

      setNotificationsCount(counts);
    }

    // Chamando a função para buscar notificações inicialmente
    fetchNotifications();

    // Função para ouvir as mudanças em tempo real
    subscribeToNotificationsUpdates((e) => {
      console.log("Real-time event:", e);

      // Atualiza as notificações com base nos eventos em tempo real
      if (e.action === "create") {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          e.record,
        ]);

        setNotificationsCount((prevCounts) => {
          const newCounts = { ...prevCounts };
          const notification = e.record as Notificacao;

          if (notification.form_seguro_incendio)
            newCounts.form_seguro_incendio++;
          if (notification.form_seguro_incendio_comercial)
            newCounts.form_seguro_incendio_comercial++;
          if (notification.form_seguro_fianca_residencial)
            newCounts.form_seguro_fianca_residencial++;
          if (notification.form_seguro_fianca_empresarial_mais_2_anos)
            newCounts.form_seguro_fianca_empresarial_mais_2_anos++;
          if (notification.form_seguro_fianca_empresarial_menos_2_anos)
            newCounts.form_seguro_fianca_empresarial_menos_2_anos++;
          if (notification.form_efetivacao_seguro_fianca_tb)
            newCounts.form_efetivacao_seguro_fianca_tb++;
          // if (notification.form_titulo_capitalizacao)
          //   newCounts.form_titulo_capitalizacao++; COMENTANDO ATÉ CORRIGIR O ERRO

          return newCounts;
        });
      } else if (e.action === "delete") {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((n) => n.id !== e.record.id)
        );
      }
    });

    // Cleanup: cancelar a inscrição do real-time quando o componente desmontar
    return () => {
      unsubscribeFromNotificationsUpdates();
    };
  }, []);

  // Função para deletar notificações de um tipo específico
  const handledeleteNotifications = async (
    formType: keyof typeof notificationsCount
  ) => {
    const notificationsToDelete = notifications.filter(
      (notification) => notification[formType]
    );

    if (notificationsToDelete.length > 0) {
      await deleteNotifications(notificationsToDelete); // Chama o serviço para deletar as notificações
      setNotifications((prevNotifications) =>
        prevNotifications.filter(
          (notification) => !notificationsToDelete.includes(notification)
        )
      );
      setNotificationsCount((prevCounts) => ({
        ...prevCounts,
        [formType]: 0, // Reseta o contador de notificações localmente
      }));
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="flex flex-col flex-grow justify-between">
      <ul className="space-y-2 py-4">
        {/* Início */}
        <li>
          <button
            onClick={() => {
              navigate("/inicio");
              window.location.reload();
            }}
            className={`flex items-center w-full px-4 py-2 text-left text-sm ${
              location.pathname === "/inicio"
                ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <Home className="h-5 w-5 mr-3" />
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
                      onClick={async () => {
                        navigate("/dashboard-incendio");
                        await handledeleteNotifications("form_seguro_incendio");
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-incendio"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      <span>Incêndio Residencial</span>
                      {notificationsCount.form_seguro_incendio > 0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {notificationsCount.form_seguro_incendio}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Incêndio Comercial */}
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-incendio-comercial");
                        await handledeleteNotifications(
                          "form_seguro_incendio_comercial"
                        );
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-incendio-comercial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building className="h-5 w-5 mr-3" />
                      <span>Incêndio Comercial</span>
                      {notificationsCount.form_seguro_incendio_comercial >
                        0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {notificationsCount.form_seguro_incendio_comercial}
                        </span>
                      )}
                    </button>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>

        {/* Outros dashboards de Fiança */}
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
                      onClick={async () => {
                        navigate("/dashboard-fianca-residencial");
                        await handledeleteNotifications(
                          "form_seguro_fianca_residencial"
                        );
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname === "/dashboard-fianca-residencial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <HomeIcon className="h-5 w-5 mr-3" />
                      <span>Fiança Residencial</span>
                      {notificationsCount.form_seguro_fianca_residencial >
                        0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {notificationsCount.form_seguro_fianca_residencial}
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Fiança Empresarial Mais de 2 Anos */}
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-fianca-empresarial-mais-2-anos");
                        await handledeleteNotifications(
                          "form_seguro_fianca_empresarial_mais_2_anos"
                        );
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-mais-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building className="h-5 w-5 mr-3" />
                      <span>Fiança CNPJ Acima de 2 Anos</span>
                      {notificationsCount.form_seguro_fianca_empresarial_mais_2_anos >
                        0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {
                            notificationsCount.form_seguro_fianca_empresarial_mais_2_anos
                          }
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Fiança Empresarial Menos de 2 Anos */}
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-fianca-empresarial-menos-2-anos");
                        await handledeleteNotifications(
                          "form_seguro_fianca_empresarial_menos_2_anos"
                        );
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-menos-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Building2 className="h-5 w-5 mr-3" />
                      <span>Fiança CNPJ Menos de 2 Anos</span>
                      {notificationsCount.form_seguro_fianca_empresarial_menos_2_anos >
                        0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {
                            notificationsCount.form_seguro_fianca_empresarial_menos_2_anos
                          }
                        </span>
                      )}
                    </button>
                  </li>

                  {/* Efetivação Seguro Fiança */}
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-efetivacao-seguro-fianca");
                        await handledeleteNotifications(
                          "form_efetivacao_seguro_fianca_tb"
                        );
                      }}
                      className={`flex items-center w-full px-4 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-efetivacao-seguro-fianca"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      <Coins className="h-5 w-5 mr-3" />
                      <span>Efetivação Seguro Fiança</span>
                      {notificationsCount.form_efetivacao_seguro_fianca_tb >
                        0 && (
                        <span
                          className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                          style={{ width: "0.95rem", height: "0.95rem" }}
                        >
                          {notificationsCount.form_efetivacao_seguro_fianca_tb}
                        </span>
                      )}
                    </button>
                  </li>
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </li>

        {/* Título de Capitalização */}
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
            {/* {notificationsCount.form_titulo_capitalizacao > 0 && (
              <span
                className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ width: "0.95rem", height: "0.95rem" }}
              >
                {notificationsCount.form_titulo_capitalizacao}
              </span>
            )}    COMENTADO ATÉ CORRIGIR O ERRO */}
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

        {/* Gráfic */}
        <li>
          <button
            onClick={() => navigate("/graficos")}
            className={`flex items-center w-full px-4 py-2 text-left text-sm ${
              location.pathname === "/graficos"
                ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}
          >
            <ChartBar className="h-5 w-5 mr-3" />
            <span>Gráficos</span>
          </button>
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
