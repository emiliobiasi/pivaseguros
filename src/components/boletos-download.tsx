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
import { useNavigate } from "react-router-dom";
import { useBoletosContext } from "@/contexts/boletos/boletos-context";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

import pb from "@/utils/backend/pb";
import { EnvioDeBoletos } from "@/types/EnviosDeBoletos";
import { fetchEnvioDeBoletosList } from "@/utils/api/EnvioDeBoletosService";

// Tipos auxiliares (se necessário você pode adaptar)
interface BoletoFetched extends EnvioDeBoletos {
  // Se quiser mapear mais campos específicos, adicione aqui
  // nome?: string;
  // vencimento?: string;
}

interface ExpandedBoleto {
  id: string;
  arquivo: string;
  created: string | undefined; // Pode usar Date, mas verifique se você está lidando com strings na API
}

// Componente principal
export default function BoletosDownload() {
  const [envios, setEnvios] = useState<BoletoFetched[]>([]);
  const [boletos, setBoletos] = useState<ExpandedBoleto[]>([]);
  const [downloadedBoletos, setDownloadedBoletos] = useState<Set<string>>(
    new Set()
  );
  const [isDownloading, setIsDownloading] = useState(false);
  const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(
    null
  );
  const [showCelebration, setShowCelebration] = useState(false);
  const [showExitAlert, setShowExitAlert] = useState(false);
  const navigate = useNavigate();

  const {
    setAllBoletosDownloaded,
    setHasBoletosToDownload,
    setIsProcessFinalized,
  } = useBoletosContext();

  // Carregar boletos do PocketBase
  useEffect(() => {
    const currentUser = pb.authStore.model;
    if (!currentUser) {
      return;
    }

    const currentUserId = currentUser.id;

    console.log("Buscando boletos para o usuário:", currentUserId);

    // Busca apenas registros onde:
    // - imobiliaria == currentUserId
    // - finalizado == false
    // Ajuste o page e limit conforme sua necessidade
    fetchEnvioDeBoletosList(1, 50, "", {
      imobiliaria: currentUserId,
      finalizado: false,
    })
      .then((response) => {
        setEnvios(response.items);
      })
      .catch((error) => {
        console.error("Erro ao buscar boletos:", error);
      });
  }, []);

  // Expandir envios para boletos
  useEffect(() => {
    const expandedBoletos = envios.flatMap((envio) =>
      envio.arquivos.map((arquivo) => ({
        id: envio.id,
        arquivo,
        created: envio.created ? new Date(envio.created).toISOString() : undefined,
      }))
    );
    setBoletos(expandedBoletos);
  }, [envios]);

  // Atualiza o contexto sobre a quantidade de boletos
  useEffect(() => {
    setHasBoletosToDownload(boletos.length > 0);
    setAllBoletosDownloaded(downloadedBoletos.size === boletos.length);
  }, [
    boletos,
    downloadedBoletos,
    setHasBoletosToDownload,
    setAllBoletosDownloaded,
  ]);

  // Prevenir o usuário de sair se ainda houver boletos pendentes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (downloadedBoletos.size < boletos.length && boletos.length > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [downloadedBoletos, boletos]);

  // Recupera do localStorage se já houver boletos baixados
  useEffect(() => {
    const storedBoletos = localStorage.getItem("downloadedBoletos");
    if (storedBoletos) {
      setDownloadedBoletos(new Set(JSON.parse(storedBoletos)));
    }
  }, []);

  // Função de "download" (exemplo fictício para simular)
  const handleDownload = async (arquivo: string) => {
    setIsDownloading(true);
    setCurrentDownloadId(arquivo);

    // Simular atraso no download
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setDownloadedBoletos((prev) => {
      const newSet = new Set(prev);
      newSet.add(arquivo);
      localStorage.setItem(
        "downloadedBoletos",
        JSON.stringify(Array.from(newSet))
      );
      return newSet;
    });

    // Registrar no histórico local
    const historico = JSON.parse(
      localStorage.getItem("historicoBoletosDownload") || "[]"
    );
    historico.push({
      arquivo,
      dataDownload: new Date().toLocaleString(),
    });
    localStorage.setItem("historicoBoletosDownload", JSON.stringify(historico));

    setIsDownloading(false);
    setCurrentDownloadId(null);
  };

  // Finaliza o processo e redireciona
  const handleFinalize = () => {
    if (downloadedBoletos.size === boletos.length) {
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

  // Cálculo de progresso
  const allDownloaded = downloadedBoletos.size === boletos.length;
  const progress =
    boletos.length > 0 ? (downloadedBoletos.size / boletos.length) * 100 : 0;

  // Se nenhum boleto está disponível
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

  // Animação de "parabéns" se todos foram baixados
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

      {/* Lista de boletos (adaptado para o que você realmente tem na sua coleção) */}
      <div className="space-y-4">
        {boletos.map((boleto, index) => (
          <div
            key={`${boleto.id}-${index}`}
            className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
          >
            {/* Informações do boleto */}
            <div className="flex flex-col mb-4 sm:mb-0">
              <span className="font-semibold text-gray-800 text-lg">
                Arquivo: {boleto.arquivo}
              </span>
              <span className="text-sm text-gray-600">
                {`Anexado em: ${
                  boleto.created
                    ? new Date(boleto.created).toLocaleString()
                    : "Data inválida"
                }`}
              </span>
            </div>

            {/* Botão de download */}
            {downloadedBoletos.has(boleto.arquivo) ? (
              <div className="flex items-center text-green-600">
                <CheckCircle className="w-6 h-6 mr-2" />
                <span>Baixado</span>
              </div>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(boleto.arquivo)}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center"
              >
                {isDownloading && currentDownloadId === boleto.arquivo ? (
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

      {/* Alerta de saída (quando tentar sair sem baixar tudo) */}
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
