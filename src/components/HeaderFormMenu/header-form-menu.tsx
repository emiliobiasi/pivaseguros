import { useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import pivaLogo from "@/assets/logo.png";

export function HeaderFormMenu() {
  const navigate = useNavigate();

  return (
    <header className="flex h-28 w-full shrink-0 items-center justify-between px-4 md:px-6">
      {/* Logo na esquerda */}
      <div
        onClick={() => navigate("/formulario")}
        className="w-40 h-auto  sm:my-8 cursor-pointer"
      >
        <img src={pivaLogo} alt="Logo" className="lg:ms-20 md:ms-10" />
      </div>

      {/* Menu e Ícone do Menu Hambúrguer à direita */}
      <div className="flex items-center space-x-4 lg:me-20 md:me-10">
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuLink asChild>
              <div
                onClick={() => navigate("/formulario")}
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none cursor-pointer"
              >
                Home
              </div>
            </NavigationMenuLink>
            {/* Adicione outros itens de menu aqui */}
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <MenuIcon className="h-6 w-6" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div
              onClick={() => navigate("/")}
              className="mr-6 flex cursor-pointer"
            >
              <img src={pivaLogo} alt="Logo" className="h-30 w-40" />
              <span className="sr-only">Logo</span>
            </div>
            <div className="grid gap-2 py-6">
              <div
                onClick={() => navigate("/formulario")}
                className="flex w-full items-center py-2 text-lg font-semibold cursor-pointer"
              >
                Home
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  );
}
