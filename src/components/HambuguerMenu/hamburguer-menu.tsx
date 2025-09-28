// import { useContext } from "react";
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import { ExitIcon } from "@radix-ui/react-icons"
import { AnimatePresence, motion } from "framer-motion"
import { CreditCard, FileText, FileX, FilePlus2, Menu } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuthImobiliarias } from "@/contexts/auth/imobiliarias/useAuthImobiliarias"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
// import { AuthImobiliariaContext } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias";

const menuItems = [
  { icon: FileText, label: "Formulários", path: "/imobiliaria/formulario" },
  {
    icon: CreditCard,
    label: "Boletos",
    path: "/imobiliaria/download-boletos",
  },
  {
    icon: FileX,
    label: "Protocolos de Cancelamento de Apólices",
    path: "/imobiliaria/protocolo-cancelamento",
  },
  {
    icon: FilePlus2,
    label: "Protocolos de Abertura de Sinistros",
    path: "/imobiliaria/protocolo-abertura-sinistro",
  },
  // { icon: Settings, label: "Configurações", path: "/imobiliaria/configuracoes" },
  { icon: ExitIcon, label: "Sair", action: "logout" },
]

export function HamburguerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewProtocolsBadge, setShowNewProtocolsBadge] = useState(
    () => !localStorage.getItem("protocolosFeatureSeen")
  )
  const [showNewProtocolsAberturaBadge, setShowNewProtocolsAberturaBadge] =
    useState(() => !localStorage.getItem("protocolosAberturaFeatureSeen"))
  const [showIntroPulse, setShowIntroPulse] = useState(
    () => !localStorage.getItem("hamburguerMenuIntroSeen")
  )
  const navigate = useNavigate()
  const { logout } = useAuthImobiliarias()

  const handleNavigation = (path: string) => {
    setIsOpen(false)
    navigate(path)
  }

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (item.action === "logout") {
      logout()
    } else if (item.path) {
      // Se for o item de Protocolos, marcar como visto para esconder o badge "Novo"
      if (item.path === "/imobiliaria/protocolo-cancelamento") {
        localStorage.setItem("protocolosFeatureSeen", "1")
        setShowNewProtocolsBadge(false)
      } else if (item.path === "/imobiliaria/protocolo-abertura-sinistro") {
        localStorage.setItem("protocolosAberturaFeatureSeen", "1")
        setShowNewProtocolsAberturaBadge(false)
      }
      handleNavigation(item.path)
    }
  }

  // Marcar como visto quando abrir o menu
  useEffect(() => {
    if (isOpen) {
      try {
        localStorage.setItem("hamburguerMenuIntroSeen", "1")
      } catch {}
      setShowIntroPulse(false)
    }
  }, [isOpen])

  // Caso o usuário não abra, mostrar o destaque por alguns segundos e esconder
  useEffect(() => {
    if (!showIntroPulse) return
    const t = setTimeout(() => {
      try {
        localStorage.setItem("hamburguerMenuIntroSeen", "1")
      } catch {}
      setShowIntroPulse(false)
    }, 5000)
    return () => clearTimeout(t)
  }, [showIntroPulse])

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="default"
          size="default"
          className={cn(
            "relative inline-flex items-center gap-2.5 rounded-full bg-white text-black shadow-md hover:shadow-lg hover:bg-white border border-green-700",
            "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-piva-green-800 focus:ring-offset-transparent",
            "h-11 md:h-12 px-4"
          )}
          aria-label="Abrir menu"
        >
          {/* Removido overlay de ping para não atrapalhar a legibilidade */}
          <Menu className="h-7 w-7 drop-shadow-sm" strokeWidth={2.5} />
          <span className="font-semibold leading-none">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <SheetHeader className="p-6 text-left border-b">
          <SheetTitle className="text-2xl font-bold text-piva-green-800">
            PMJ & Piva
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 p-4">
          <AnimatePresence>
            {menuItems.map((item, index) => {
              const isCancelamentoProtocols =
                item.path === "/imobiliaria/protocolo-cancelamento"
              const isAberturaProtocols =
                item.path === "/imobiliaria/protocolo-abertura-sinistro"
              const showNewBadge =
                (isCancelamentoProtocols && showNewProtocolsBadge) ||
                (isAberturaProtocols && showNewProtocolsAberturaBadge)
              const ButtonContent = (
                <button
                  onClick={() => handleMenuClick(item)}
                  className={cn(
                    "flex w-full items-center px-4 py-3 rounded-lg text-sm font-medium transition-colors text-left",
                    "text-piva-green-800 hover:bg-piva-green-100 hover:text-piva-green-800",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-piva-green-800"
                  )}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <div className="ml-4 flex items-center gap-2 text-left">
                    <span className="leading-snug text-left whitespace-normal break-words">
                      {item.label}
                    </span>
                    {showNewBadge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
                        Novo
                      </span>
                    )}
                  </div>
                </button>
              )

              return (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {showNewBadge ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{ButtonContent}</TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          {isCancelamentoProtocols
                            ? "Novidade! Acompanhe e baixe seus Protocolos de Cancelamento de Seguros aqui."
                            : isAberturaProtocols
                            ? "Novidade! Acompanhe e baixe seus Protocolos de Abertura de Sinistro aqui."
                            : null}
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ) : (
                    ButtonContent
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  )
}
