import { useContext } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { ExitIcon } from "@radix-ui/react-icons";
import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, FileText, Menu, Settings } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthImobiliariaContext } from "@/contexts/auth/imobiliarias/AuthContextImobiliarias";

const menuItems = [
  { icon: FileText, label: "Formulários", path: "/formularios" },
  { icon: CreditCard, label: "Boletos", path: "/boletos" },
  { icon: Settings, label: "Configurações", path: "/configuracoes" },
  { icon: ExitIcon, label: "Sair", action: "logout" },
];

export function HamburguerMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const authContext = useContext(AuthImobiliariaContext);

  const handleNavigation = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  const handleMenuClick = (item: (typeof menuItems)[0]) => {
    if (item.action === "logout" && authContext?.logout) {
      authContext.logout();
    } else if (item.path) {
      handleNavigation(item.path);
    }
  };

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
            {menuItems.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ delay: index * 0.1 }}
              >
                <button
                  onClick={() => handleMenuClick(item)}
                  className={cn(
                    "flex items-center space-x-4 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                    "text-piva-green-800 hover:bg-piva-green-100 hover:text-piva-green-800",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-piva-green-800"
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
