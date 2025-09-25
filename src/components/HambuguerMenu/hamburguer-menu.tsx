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
import { CreditCard, FileText, FileX, Menu } from "lucide-react"
import { useState } from "react"
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
    label: "Protocolos de Cancelamento",
    path: "/imobiliaria/protocolo-cancelamento",
  },
  // { icon: Settings, label: "Configurações", path: "/imobiliaria/configuracoes" },
  { icon: ExitIcon, label: "Sair", action: "logout" },
]

export function HamburguerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const [showNewProtocolsBadge, setShowNewProtocolsBadge] = useState(
    () => !localStorage.getItem("protocolosFeatureSeen")
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
      }
      handleNavigation(item.path)
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="fixed top-4 left-4 z-50"
        >
          <Menu className="h-6 w-6" />
          <span className="sr-only">Abrir menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[300px]">
        <SheetHeader className="p-6 text-left border-b">
          <SheetTitle className="text-2xl font-bold text-piva-green-800">
            Piva Seguros
          </SheetTitle>
        </SheetHeader>
        <nav className="space-y-2 p-4">
          <AnimatePresence>
            {menuItems.map((item, index) => {
              const isProtocols =
                item.path === "/imobiliaria/protocolo-cancelamento"
              const ButtonContent = (
                <button
                  onClick={() => handleMenuClick(item)}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    "text-piva-green-800 hover:bg-piva-green-100 hover:text-piva-green-800",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-piva-green-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="flex items-center gap-2">
                    {item.label}
                    {isProtocols && showNewProtocolsBadge && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-green-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                        <span className="h-1.5 w-1.5 rounded-full bg-white/90 animate-pulse" />
                        Novo
                      </span>
                    )}
                  </span>
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
                  {isProtocols && showNewProtocolsBadge ? (
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>{ButtonContent}</TooltipTrigger>
                        <TooltipContent side="right" className="max-w-xs">
                          Novidade! Acompanhe e baixe seus Protocolos de
                          Cancelamento de Seguros aqui.
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
