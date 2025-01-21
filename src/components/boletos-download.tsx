import { useState, useEffect } from "react";
import {
  Download,
  CheckCircle,
  ArrowRight,
  PartyPopper,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CircularProgress } from "./circular-progress";
import { useNavigate } from "react-router-dom"; // Substituto de next/navigation
import { useBoletosContext } from "@/contexts/boletos/boletos-context";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

interface Boleto {
  id: string;
  nome: string;
  url: string;
  vencimento: string;
  valor: string;
}

const boletos: Boleto[] = [
  {
    id: "jan2024",
    nome: "Boleto Janeiro",
    url: "/boletos/janeiro.pdf",
    vencimento: "31/01/2024",
    valor: "R$ 150,00",
  },
  {
    id: "fev2024",
    nome: "Boleto Fevereiro",
    url: "/boletos/fevereiro.pdf",
    vencimento: "29/02/2024",
    valor: "R$ 150,00",
  },
  {
    id: "mar2024",
    nome: "Boleto Março",
    url: "/boletos/marco.pdf",
    vencimento: "31/03/2024",
    valor: "R$ 150,00",
  },
];

export default function BoletosDownload() {
  const [downloadedBoletos, setDownloadedBoletos] = useState<Set<string>>(
    new Set()
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(
    null
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const navigate = useNavigate(); // Substitui useRouter

  const {
    setAllBoletosDownloaded,
    setHasBoletosToDownload,
    setIsProcessFinalized,
  } = useBoletosContext();

  const allDownloaded = downloadedBoletos.size === boletos.length;
  const progress =
    boletos.length > 0 ? (downloadedBoletos.size / boletos.length) * 100 : 0;

  useEffect(() => {
    setHasBoletosToDownload(boletos.length > 0);
    setAllBoletosDownloaded(allDownloaded);
  }, [setHasBoletosToDownload, setAllBoletosDownloaded, allDownloaded]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!allDownloaded && boletos.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [allDownloaded]);

  useEffect(() => {
    const storedBoletos = localStorage.getItem("downloadedBoletos");
    if (storedBoletos) {
      setDownloadedBoletos(new Set(JSON.parse(storedBoletos)));
    }
  }, []);

  const handleDownload = async (boleto: Boleto) => {
    setIsDownloading(true);
    setCurrentDownloadId(boleto.id);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setDownloadedBoletos((prev) => {
      const newSet = new Set(prev);
      newSet.add(boleto.id);
      localStorage.setItem(
        "downloadedBoletos",
        JSON.stringify(Array.from(newSet))
      );
      return newSet;
    });

    const historico = JSON.parse(
      localStorage.getItem("historicoBoletosDownload") || "[]"
    );
    historico.push({
      id: boleto.id,
      nome: boleto.nome,
      dataDownload: new Date().toLocaleString(),
      vencimento: boleto.vencimento,
      valor: boleto.valor,
    });
    localStorage.setItem("historicoBoletosDownload", JSON.stringify(historico));

    setIsDownloading(false);
    setCurrentDownloadId(null);
  };

  const handleFinalize = () => {
    if (allDownloaded) {
      setIsProcessFinalized(true);
      setShowCelebration(true);
      setTimeout(() => {
        setDownloadedBoletos(new Set());
        setShowCelebration(false);
        localStorage.removeItem("downloadedBoletos");
        navigate("/imobiliaria/download-boletos/historico");
      }, 3000);
    }
  };

  if (boletos.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-semibold">
          Nenhum boleto disponível no momento.
        </p>
        <p className="mt-2">Volte mais tarde para verificar novos boletos.</p>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className="text-center mb-6 animate-fade-in p-8">
        <PartyPopper className="h-16 w-16 mx-auto text-green-600 mb-4" />
        <h2 className="text-2xl font-bold text-green-700">Parabéns!</h2>
        <p className="text-green-600 text-lg">
          Você baixou todos os boletos disponíveis.
        </p>
        <p className="text-green-600 mt-4 text-lg">
          Redirecionando para o histórico...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50">
      {/* Cabeçalho do progresso */}
      <div className="mb-6 flex justify-center">
        <CircularProgress progress={progress} size={120} strokeWidth={8} />
      </div>

      {/* Lista de boletos */}
      <div className="space-y-4">
        {boletos.map((boleto) => (
          <div
            key={boleto.id}
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            {/* Informações do boleto */}
            <div className="flex flex-col mb-4 sm:mb-0">
              <span className="font-semibold text-gray-800 text-lg">
                {boleto.nome}
              </span>
              <span className="text-sm text-gray-600">
                Vencimento: {boleto.vencimento}
              </span>
              <span className="text-sm text-gray-600">
                Valor: {boleto.valor}
              </span>
            </div>

            {/* Botão de download */}
            {downloadedBoletos.has(boleto.id) ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span>Baixado</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(boleto)}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {isDownloading && currentDownloadId === boleto.id ? (
                  <div className="flex items-center">
                    <CircularProgress
                      progress={100}
                      size={20}
                      strokeWidth={3}
                    />
                    <span className="ml-2">Baixando...</span>
                  </div>
                ) : (
                  <>
                    <Download className="mr-2 w-5 h-5" />
                    Baixar Boleto
                  </>
                )}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Botão de finalização */}
      <div className="mt-6">
        <Button
          onClick={handleFinalize}
          disabled={!allDownloaded}
          className={`w-full py-3 px-6 font-bold rounded-full text-white transition-all duration-300 transform ${
            allDownloaded
              ? "bg-green-600 hover:bg-green-700 scale-105"
              : "bg-gray-300 cursor-not-allowed"
          }`}
        >
          {allDownloaded ? (
            <>
              Finalizar e Ver Histórico
              <ArrowRight className="ml-2 w-5 h-5" />
            </>
          ) : (
            "Baixe todos os boletos para finalizar"
          )}
        </Button>
      </div>

      {/* Mensagem de atenção */}
      {!allDownloaded && boletos.length > 0 && (
        <div className="mt-4 bg-red-100 text-red-600 p-4 rounded-lg text-center">
          <AlertTriangle className="w-6 h-6 mx-auto mb-2" />
          <p className="font-bold">
            Atenção: Você precisa baixar todos os boletos antes de acessar o
            histórico.
          </p>
          <p className="mt-2">
            Não feche esta janela ou navegue para outra página até concluir
            todos os downloads.
          </p>
        </div>
      )}

      {/* Alerta de saída */}
      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atenção! Boletos pendentes</AlertDialogTitle>
            <AlertDialogDescription>
              Você ainda não baixou todos os boletos. É extremamente importante
              que você baixe todos os boletos antes de sair desta página.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg">
              Voltar e baixar os boletos
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
