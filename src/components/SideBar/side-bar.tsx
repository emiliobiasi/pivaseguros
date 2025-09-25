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
  DockIcon,
  User,
  FileClock,
  ChevronLeft,
  ChevronRight,
  FileX,
} from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"
import logo from "@/assets/logo.png"
import { useAuth } from "@/contexts/auth/useAuth"
import { HomeIcon } from "@radix-ui/react-icons"
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion"
import { useEffect, useState, useRef } from "react"
import { Notificacao } from "@/types/Notificacao"
import {
  fetchAllNotifications,
  subscribeToNotificationsUpdates,
  unsubscribeFromNotificationsUpdates,
  deleteNotifications,
} from "@/utils/api/NotificacoesService"
import pb from "@/utils/backend/pb"
import notificacao_som from "@/assets/notificacao_som.mp3"
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/ui/tooltip"

// Props originais (controle mobile externo)
type SideBarProps = {
  sidebarOpen: boolean
  toggleSidebar: () => void
}

// Sidebar principal (controla colapso em desktop + exibe versão mobile)
export function SideBar({ sidebarOpen, toggleSidebar }: SideBarProps) {
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    try {
      return localStorage.getItem("sidebar_collapsed") === "true"
    } catch {
      return false
    }
  })

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev
      try {
        localStorage.setItem("sidebar_collapsed", String(next))
      } catch {}
      return next
    })
  }

  return (
    <div>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between h-14 px-3 bg-white dark:bg-gray-800 shadow">
        <button
          onClick={toggleSidebar}
          className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen transition-all duration-300 ease-in-out ${
          collapsed ? "w-14" : "w-56"
        } text-[13px]`}
      >
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
          <span
            className={`font-bold text-gray-800 dark:text-white cursor-pointer transition-opacity duration-300 ${
              collapsed ? "opacity-0 pointer-events-none w-0" : "text-lg"
            }`}
            onClick={() => navigate("/inicio")}
          >
            <img
              src={logo}
              alt="Logo"
              onClick={() => window.location.reload()}
              className={`${
                collapsed ? "scale-0" : "scale-100"
              } transition-transform duration-300 origin-left`}
            />
          </span>
          <button
            onClick={toggleCollapsed}
            className="ml-auto text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white rounded-md p-0.5 focus:outline-none focus:ring-2 focus:ring-green-500"
            aria-label={collapsed ? "Expandir sidebar" : "Recolher sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>
        <SidebarContent collapsed={collapsed} />
      </aside>

      {/* Mobile overlay sidebar */}
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
            <SidebarContent collapsed={false} />
          </div>
        </div>
      )}
    </div>
  )
}

function SidebarContent({ collapsed }: { collapsed: boolean }) {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [notifications, setNotifications] = useState<Notificacao[]>([])
  const [cancelamentoRealtimeCount, setCancelamentoRealtimeCount] = useState(0)
  const [tituloRealtimeCount, setTituloRealtimeCount] = useState(0)
  // Some backends may use different field names for the same notification type.
  // For cancelamento de seguros, consider these alias keys when counting/clearing.
  const cancelamentoKeys = [
    "form_cancelamento_seguros",
    "form_protocolo_cancelamento",
    "form_protocolo_cancelamento_seguros",
    "form_cancelamento",
    "protocolo_cancelamento",
    "cancelamento_seguros",
    "form_protocolo_cancelamentos",
  ] as const

  const isCancelamentoNotification = (n: any) => {
    // Explicit aliases first
    if (cancelamentoKeys.some((k) => n?.[k])) return true
    // Heuristic fallback: any custom key that mentions cancelamento/cancel
    try {
      const keys = Object.keys(n || {})
      return keys.some((key) => {
        const k = key.toLowerCase()
        return (
          k.includes("cancelamento") ||
          k.includes("cancel_") ||
          (k.includes("protocolo") &&
            (k.includes("cancel") || k.includes("cancelamento")))
        )
      })
    } catch {
      return false
    }
  }
  const soundRef = useRef<HTMLAudioElement | null>(null)
  const [notificationsCount, setNotificationsCount] = useState({
    form_seguro_incendio: 0,
    form_seguro_incendio_comercial: 0,
    form_seguro_fianca_residencial: 0,
    form_seguro_fianca_empresarial_mais_2_anos: 0,
    form_seguro_fianca_empresarial_menos_2_anos: 0,
    form_efetivacao_seguro_fianca_tb: 0,
    form_titulo_capitalizacao: 0,
    form_cancelamento_seguros: 0,
  })

  const authorizedUsers = [
    { id: "g6f27sjx3kjqktf", email: "comercial@pivaseguros.com.br" },
    { id: "bdq7guk6qiwyggd", email: "teste@email.com" },
  ]

  const currentUser = pb.authStore.model
  const currentUserId = currentUser?.id
  const currentUserEmail = currentUser?.email

  const isAuthorized = authorizedUsers.some(
    (user) => user.id === currentUserId && user.email === currentUserEmail
  )

  // Helper para recomputar contadores a partir do array de notificações
  const computeCounts = (notifs: Notificacao[]) => {
    const counts = {
      form_seguro_incendio: 0,
      form_seguro_incendio_comercial: 0,
      form_seguro_fianca_residencial: 0,
      form_seguro_fianca_empresarial_mais_2_anos: 0,
      form_seguro_fianca_empresarial_menos_2_anos: 0,
      form_efetivacao_seguro_fianca_tb: 0,
      form_titulo_capitalizacao: 0,
      form_cancelamento_seguros: 0,
    }
    for (const n of notifs) {
      if (n.form_seguro_incendio) counts.form_seguro_incendio++
      if (n.form_seguro_incendio_comercial)
        counts.form_seguro_incendio_comercial++
      if (n.form_seguro_fianca_residencial)
        counts.form_seguro_fianca_residencial++
      if (n.form_seguro_fianca_empresarial_mais_2_anos)
        counts.form_seguro_fianca_empresarial_mais_2_anos++
      if (n.form_seguro_fianca_empresarial_menos_2_anos)
        counts.form_seguro_fianca_empresarial_menos_2_anos++
      if (n.form_efetivacao_seguro_fianca_tb)
        counts.form_efetivacao_seguro_fianca_tb++
      if (n.form_titulo_capitalizacao) counts.form_titulo_capitalizacao++
      if (isCancelamentoNotification(n)) counts.form_cancelamento_seguros++
    }
    return counts
  }

  // Inicializa áudio de notificação
  useEffect(() => {
    const audio = new Audio(notificacao_som)
    audio.preload = "auto"
    audio.volume = 0.5
    soundRef.current = audio
    return () => {
      if (soundRef.current) {
        soundRef.current.pause()
        soundRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    async function fetchNotifications() {
      const { items: notifications } = await fetchAllNotifications()
      setNotifications(notifications)

      setNotificationsCount(computeCounts(notifications))
    }

    fetchNotifications()

    subscribeToNotificationsUpdates((e) => {
      if (e.action === "create") {
        setNotifications((prev) => {
          const updated = [...prev, e.record]
          setNotificationsCount(computeCounts(updated))
          // Toca som para novas notificações
          soundRef.current?.play().catch(() => {})
          return updated
        })
      } else if (e.action === "delete") {
        setNotifications((prev) => {
          const updated = prev.filter((n) => n.id !== e.record.id)
          setNotificationsCount(computeCounts(updated))
          return updated
        })
      }
    })

    return () => {
      unsubscribeFromNotificationsUpdates()
    }
  }, [])

  // Realtime subscription specifically for cancelamento_seguros (in case no generic notificacao is emitted)
  useEffect(() => {
    const unsub = pb.collection("cancelamento_seguros").subscribe("*", (e) => {
      if (e.action === "create") {
        setCancelamentoRealtimeCount((prev) => prev + 1)
        // Play sound for newly created cancelamento as well
        soundRef.current?.play().catch(() => {})
      } else if (e.action === "delete") {
        setCancelamentoRealtimeCount((prev) => Math.max(0, prev - 1))
      }
    })
    return () => {
      try {
        pb.collection("cancelamento_seguros").unsubscribe("*")
      } catch {}
      if (typeof unsub === "function") {
        ;(unsub as any)()
      }
    }
  }, [])

  // Seed initial unseen count for cancelamento using last seen timestamp
  useEffect(() => {
    ;(async () => {
      try {
        const lastSeenRaw = localStorage.getItem("last_seen_cancelamento")
        const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0
        const res = await pb
          .collection("cancelamento_seguros")
          .getList<any>(1, 50, { sort: "-created" })
        const unseen = res.items.filter((it) => {
          const createdAt = new Date((it as any).created).getTime()
          return createdAt > lastSeen
        }).length
        setCancelamentoRealtimeCount(unseen)
      } catch {
        // ignore errors
      }
    })()
  }, [])

  // Realtime subscription & seed for Título de Capitalização
  useEffect(() => {
    const unsub = pb.collection("titulo_capitalizacao").subscribe("*", (e) => {
      if (e.action === "create") {
        setTituloRealtimeCount((prev) => prev + 1)
        soundRef.current?.play().catch(() => {})
      } else if (e.action === "delete") {
        setTituloRealtimeCount((prev) => Math.max(0, prev - 1))
      }
    })
    return () => {
      try {
        pb.collection("titulo_capitalizacao").unsubscribe("*")
      } catch {}
      if (typeof unsub === "function") {
        ;(unsub as any)()
      }
    }
  }, [])
  useEffect(() => {
    ;(async () => {
      try {
        const lastSeenRaw = localStorage.getItem(
          "last_seen_titulo_capitalizacao"
        )
        const lastSeen = lastSeenRaw ? Number(lastSeenRaw) : 0
        const res = await pb
          .collection("titulo_capitalizacao")
          .getList<any>(1, 50, { sort: "-created" })
        const unseen = res.items.filter((it) => {
          const createdAt = new Date((it as any).created).getTime()
          return createdAt > lastSeen
        }).length
        setTituloRealtimeCount(unseen)
      } catch {
        // ignore
      }
    })()
  }, [])

  const handledeleteNotifications = async (
    formType: keyof typeof notificationsCount
  ) => {
    const notificationsToDelete =
      formType === "form_cancelamento_seguros"
        ? notifications.filter((n) => isCancelamentoNotification(n))
        : notifications.filter((n) => (n as any)[formType])

    if (notificationsToDelete.length > 0) {
      await deleteNotifications(notificationsToDelete)
      setNotifications((prev) =>
        prev.filter((n) => !notificationsToDelete.includes(n))
      )
      setNotificationsCount((prevCounts) => {
        const next = { ...prevCounts }
        next[formType] = 0
        return next
      })
    }
  }

  const handleLogout = () => logout()

  const ItemTooltip: React.FC<{ label: string; children: React.ReactNode }> = ({
    label,
    children,
  }) => {
    if (!collapsed) return <>{children}</>
    return (
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger asChild>{children}</TooltipTrigger>
          <TooltipContent side="right">{label}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <nav className="flex flex-col flex-grow justify-between overflow-hidden">
      <ul
        className={`py-3 flex flex-col gap-0.5 ${
          collapsed ? "items-center" : "space-y-2"
        }`}
      >
        {/* Início */}
        <li>
          <ItemTooltip label="Início">
            <button
              onClick={() => {
                navigate("/inicio")
                window.location.reload()
              }}
              className={`group flex items-center w-full px-3 py-2 text-left text-[13px] transition-colors ${
                location.pathname === "/inicio"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Home className={`h-4.5 w-4.5 ${collapsed ? "" : "mr-2.5"}`} />
              {!collapsed && <span>Início</span>}
            </button>
          </ItemTooltip>
        </li>

        {/* Dashboards Incêndio */}
        <li>
          <Accordion type="single" collapsible>
            <AccordionItem value="incendio">
              <AccordionTrigger
                className={`flex items-center w-full px-3 py-2 text-left ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <ItemTooltip label="Dashboards Incêndio">
                  <span className="flex items-center relative">
                    <Flame
                      className={`h-4.5 w-4.5 ${collapsed ? "" : "mr-2.5"}`}
                    />
                    {!collapsed && <span>Dashboards Incêndio</span>}
                    {notificationsCount.form_seguro_incendio +
                      notificationsCount.form_seguro_incendio_comercial >
                      0 && (
                      <span
                        className={`${
                          collapsed ? "absolute -top-0.5 -right-0.5" : "ml-2"
                        } inline-flex h-2 w-2 rounded-full bg-green-600`}
                        aria-label="Novas notificações de Incêndio"
                      />
                    )}
                  </span>
                </ItemTooltip>
              </AccordionTrigger>
              <AccordionContent className={`${collapsed ? "pl-0" : "pl-3"}`}>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-incendio")
                        await handledeleteNotifications("form_seguro_incendio")
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname === "/dashboard-incendio"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <HomeIcon
                        className={`h-4 w-4 ${collapsed ? "" : "mr-2.5"}`}
                      />
                      {!collapsed && <span>Incêndio Residencial</span>}
                      {!collapsed &&
                        notificationsCount.form_seguro_incendio > 0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          >
                            {notificationsCount.form_seguro_incendio}
                          </span>
                        )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-incendio-comercial")
                        await handledeleteNotifications(
                          "form_seguro_incendio_comercial"
                        )
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname === "/dashboard-incendio-comercial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Building
                        className={`h-4 w-4 ${collapsed ? "" : "mr-2.5"}`}
                      />
                      {!collapsed && <span>Incêndio Comercial</span>}
                      {!collapsed &&
                        notificationsCount.form_seguro_incendio_comercial >
                          0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
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

        {/* Dashboards Fiança */}
        <li>
          <Accordion type="single" collapsible>
            <AccordionItem value="fianca">
              <AccordionTrigger
                className={`flex items-center w-full px-3 py-2 text-left ${
                  collapsed ? "justify-center" : ""
                }`}
              >
                <ItemTooltip label="Dashboards Fiança">
                  <span className="flex items-center relative">
                    <Coins
                      className={`h-[18px] w-[18px] ${
                        collapsed ? "" : "mr-2.5"
                      }`}
                    />
                    {!collapsed && <span>Dashboards Fiança</span>}
                    {notificationsCount.form_seguro_fianca_residencial +
                      notificationsCount.form_seguro_fianca_empresarial_mais_2_anos +
                      notificationsCount.form_seguro_fianca_empresarial_menos_2_anos +
                      notificationsCount.form_efetivacao_seguro_fianca_tb >
                      0 && (
                      <span
                        className={`${
                          collapsed ? "absolute -top-0.5 -right-0.5" : "ml-2"
                        } inline-flex h-2 w-2 rounded-full bg-green-600`}
                        aria-label="Novas notificações de Fiança"
                      />
                    )}
                  </span>
                </ItemTooltip>
              </AccordionTrigger>
              <AccordionContent className={`${collapsed ? "pl-0" : "pl-3"}`}>
                <ul className="space-y-2">
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-fianca-residencial")
                        await handledeleteNotifications(
                          "form_seguro_fianca_residencial"
                        )
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname === "/dashboard-fianca-residencial"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <HomeIcon
                        className={`h-4 w-4 ${collapsed ? "" : "mr-2.5"}`}
                      />
                      {!collapsed && <span>Fiança Residencial</span>}
                      {!collapsed &&
                        notificationsCount.form_seguro_fianca_residencial >
                          0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          >
                            {notificationsCount.form_seguro_fianca_residencial}
                          </span>
                        )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-fianca-empresarial-mais-2-anos")
                        await handledeleteNotifications(
                          "form_seguro_fianca_empresarial_mais_2_anos"
                        )
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-mais-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Building
                        className={`h-[18px] w-[18px] ${
                          collapsed ? "" : "mr-2.5"
                        }`}
                      />
                      {!collapsed && <span>Fiança CNPJ Acima de 2 Anos</span>}
                      {!collapsed &&
                        notificationsCount.form_seguro_fianca_empresarial_mais_2_anos >
                          0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          >
                            {
                              notificationsCount.form_seguro_fianca_empresarial_mais_2_anos
                            }
                          </span>
                        )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-fianca-empresarial-menos-2-anos")
                        await handledeleteNotifications(
                          "form_seguro_fianca_empresarial_menos_2_anos"
                        )
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-fianca-empresarial-menos-2-anos"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Building2
                        className={`h-[18px] w-[18px] ${
                          collapsed ? "" : "mr-2.5"
                        }`}
                      />
                      {!collapsed && <span>Fiança CNPJ Menos de 2 Anos</span>}
                      {!collapsed &&
                        notificationsCount.form_seguro_fianca_empresarial_menos_2_anos >
                          0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          >
                            {
                              notificationsCount.form_seguro_fianca_empresarial_menos_2_anos
                            }
                          </span>
                        )}
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={async () => {
                        navigate("/dashboard-efetivacao-seguro-fianca")
                        await handledeleteNotifications(
                          "form_efetivacao_seguro_fianca_tb"
                        )
                      }}
                      className={`flex items-center w-full px-3 py-2 text-left ${
                        location.pathname ===
                        "/dashboard-efetivacao-seguro-fianca"
                          ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      } ${collapsed ? "justify-center" : ""}`}
                    >
                      <Coins
                        className={`h-[18px] w-[18px] ${
                          collapsed ? "" : "mr-2.5"
                        }`}
                      />
                      {!collapsed && <span>Efetivação Seguro Fiança</span>}
                      {!collapsed &&
                        notificationsCount.form_efetivacao_seguro_fianca_tb >
                          0 && (
                          <span
                            className="ml-2 text-xs text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                            style={{ width: "0.85rem", height: "0.85rem" }}
                          >
                            {
                              notificationsCount.form_efetivacao_seguro_fianca_tb
                            }
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
          <ItemTooltip label="Título de Capitalização">
            <button
              onClick={async () => {
                navigate("/dashboard-titulo-capitalizacao")
                await handledeleteNotifications("form_titulo_capitalizacao")
                try {
                  localStorage.setItem(
                    "last_seen_titulo_capitalizacao",
                    Date.now().toString()
                  )
                } catch {}
                setTituloRealtimeCount(0)
              }}
              className={`flex items-center w-full px-3 py-2 text-left text-[13px] ${
                location.pathname === "/dashboard-titulo-capitalizacao"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className="flex items-center relative">
                <CaptionsIcon
                  className={`h-[18px] w-[18px] ${collapsed ? "" : "mr-2.5"}`}
                />
                {!collapsed && <span>Título de Capitalização</span>}
                {notificationsCount.form_titulo_capitalizacao +
                  tituloRealtimeCount >
                  0 &&
                  (collapsed ? (
                    <span
                      className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-green-600"
                      aria-label="Novas notificações de Título de Capitalização"
                    />
                  ) : (
                    <span
                      className="ml-2 text-[10px] text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: "0.85rem", height: "0.85rem" }}
                    >
                      {notificationsCount.form_titulo_capitalizacao +
                        tituloRealtimeCount}
                    </span>
                  ))}
              </span>
            </button>
          </ItemTooltip>
        </li>

        {/* Protocolo de Cancelamento */}
        <li>
          <ItemTooltip label="Protocolo de Cancelamento">
            <button
              onClick={async () => {
                navigate("/dashboard-protocolo-cancelamento")
                await handledeleteNotifications("form_cancelamento_seguros")
                try {
                  localStorage.setItem(
                    "last_seen_cancelamento",
                    Date.now().toString()
                  )
                } catch {}
                setCancelamentoRealtimeCount(0)
              }}
              className={`flex items-center w-full px-3 py-2 text-left text-[13px] ${
                location.pathname === "/dashboard-protocolo-cancelamento"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <span className="flex items-center relative">
                <FileX
                  className={`h-[18px] w-[18px] ${collapsed ? "" : "mr-2.5"}`}
                />
                {!collapsed && <span>Protocolo de Cancelamento</span>}
                {notificationsCount.form_cancelamento_seguros +
                  cancelamentoRealtimeCount >
                  0 &&
                  (collapsed ? (
                    <span
                      className="absolute -top-0.5 -right-0.5 inline-flex h-2 w-2 rounded-full bg-green-600"
                      aria-label="Novas notificações de Protocolo de Cancelamento"
                    />
                  ) : (
                    <span
                      className="ml-2 text-[10px] text-white bg-green-800 flex items-center justify-center rounded-full flex-shrink-0"
                      style={{ width: "0.85rem", height: "0.85rem" }}
                    >
                      {notificationsCount.form_cancelamento_seguros +
                        cancelamentoRealtimeCount}
                    </span>
                  ))}
              </span>
            </button>
          </ItemTooltip>
        </li>

        {/* Gráficos */}
        <li>
          <ItemTooltip label="Gráficos">
            <button
              onClick={() => navigate("/graficos")}
              className={`flex items-center w-full px-3 py-2 text-left text-[13px] ${
                location.pathname === "/graficos"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <ChartBar
                className={`h-[18px] w-[18px] ${collapsed ? "" : "mr-2.5"}`}
              />
              {!collapsed && <span>Gráficos</span>}
            </button>
          </ItemTooltip>
        </li>

        {/* Boletos Upload */}
        <li>
          <ItemTooltip label="Boletos">
            <button
              onClick={() => navigate("/boletos-imobiliaria-upload")}
              className={`flex items-center w-full px-3 py-2 text-left text-[13px] ${
                location.pathname === "/boletos-imobiliaria-upload"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <DockIcon
                className={`h-[18px] w-[18px] ${collapsed ? "" : "mr-2.5"}`}
              />
              {!collapsed && <span>Boletos</span>}
            </button>
          </ItemTooltip>
        </li>

        {/* Histórico de Envios */}
        <li>
          <ItemTooltip label="Histórico de Envios">
            <button
              onClick={() => navigate("/historico-de-envio-de-boletos")}
              className={`flex items-center w-full px-3 py-2 text-left text-[13px] ${
                location.pathname === "/historico-de-envio-de-boletos"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <FileClock
                className={`h-4.5 w-4.5 ${collapsed ? "" : "mr-2.5"}`}
              />
              {!collapsed && <span>Histórico de Envios</span>}
            </button>
          </ItemTooltip>
        </li>

        {/* Fazer Orçamento */}
        <li>
          <ItemTooltip label="Fazer orçamento">
            <a
              href="https://piva-orcamentos-pdf.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center px-3 py-2 text-[13px] text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <ExternalLink
                className={`h-4.5 w-4.5 ${collapsed ? "" : "mr-2.5"}`}
              />
              {!collapsed && <span>Fazer orçamento</span>}
            </a>
          </ItemTooltip>
        </li>
      </ul>

      {/* Rodapé: ADM + Logout */}
      <div className="border-t border-gray-200 dark:border-gray-700">
        {isAuthorized && (
          <ItemTooltip label="Painel ADM">
            <button
              onClick={() => navigate("/painel-adm-imobiliarias")}
              className={`flex items-center w-full px-4 py-2 text-left text-sm ${
                location.pathname === "/painel-adm-imobiliarias"
                  ? "bg-gray-200 dark:bg-gray-700 text-green-700 dark:text-white"
                  : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <User className={`h-5 w-5 ${collapsed ? "" : "mr-3"}`} />
              {!collapsed && <span>Painel ADM</span>}
            </button>
          </ItemTooltip>
        )}
        <ItemTooltip label="Sair">
          <button
            onClick={handleLogout}
            className={`flex items-center w-full px-4 py-2 text-left text-gray-700 dark:text-gray-200 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className={`h-9 w-5 ${collapsed ? "" : "mr-3"}`} />
            {!collapsed && <span>Sair</span>}
          </button>
        </ItemTooltip>
      </div>
    </nav>
  )
}
