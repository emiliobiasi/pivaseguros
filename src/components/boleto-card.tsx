import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useBoletosContext } from "@/contexts/boletos/boletos-context";

export function BoletoCard({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasBoletosToDownload, isProcessFinalized } =
    useBoletosContext();

  useEffect(() => {
    if (
      location.pathname === "/imobiliaria/download-boletos/historico" &&
      hasBoletosToDownload &&
      !isProcessFinalized
    ) {
      navigate("/");
    }
  }, [location.pathname, hasBoletosToDownload, isProcessFinalized, navigate]);

  const canAccessHistory = !hasBoletosToDownload || isProcessFinalized;

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <Card className="w-full max-w-4xl mx-auto overflow-hidden bg-white shadow-xl">
        <div className="p-6 border-b flex flex-col items-center gap-6 md:items-start md:gap-4">
          <h1 className="text-2xl font-bold text-center md:text-left">
            Portal de Boletos
          </h1>
          <div className="flex flex-col gap-3 w-full md:flex-row md:gap-4">
            <Button
              variant={location.pathname === "/" ? "default" : "outline"}
              className={`w-full md:w-auto ${
                location.pathname === "/"
                  ? "bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900"
                  : ""
              }`}
              asChild
            >
              <Link to="/imobiliaria/download-boletos">Boletos Atuais</Link>
            </Button>
            <Button
              variant={
                location.pathname === "/imobiliaria/download-boletos/historico"
                  ? "default"
                  : "outline"
              }
              className={`w-full md:w-auto ${
                location.pathname === "/imobiliaria/download-boletos/historico"
                  ? "bg-gradient-to-r from-green-700 to-green-800 text-white hover:from-green-800 hover:to-green-900"
                  : ""
              } 
                ${!canAccessHistory ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canAccessHistory}
              onClick={(e) => {
                if (!canAccessHistory) {
                  e.preventDefault();
                }
              }}
              asChild
            >
              <Link
                to={
                  canAccessHistory
                    ? "/imobiliaria/download-boletos/historico"
                    : "#"
                }
              >
                Histórico
              </Link>
            </Button>
          </div>
        </div>
        <CardContent className="p-6">{children}</CardContent>
      </Card>
    </div>
  );
}
