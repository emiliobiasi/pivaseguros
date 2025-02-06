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
import {
  downloadBoleto,
  fetchEnvioDeBoletosList,
  updateEnvioDeBoletos,
} from "@/utils/api/EnvioDeBoletosService";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

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

// Lista de nomes de meses em Português
const monthNamesPtBr = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

export default function BoletosDownload() {
  const [envios, setEnvios] = useState<BoletoFetched[]>([]);
  const [boletos, setBoletos] = useState<ExpandedBoleto[]>([]);
  const [downloadedBoletos, setDownloadedBoletos] = useState<Set<string>>(
    new Set()
  );
  // const [isDownloading, setIsDownloading] = useState(false);
  // const [currentDownloadId, setCurrentDownloadId] = useState<string | null>(
  //   null
  // );
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
        id: envio.id, // Certifique-se de incluir o ID do registro
        arquivo,
        created: envio.created
          ? new Date(envio.created).toISOString()
          : undefined,
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

  // Recupera do localStorage se já houver boletos baixados
  useEffect(() => {
    const storedBoletos = localStorage.getItem("downloadedBoletos");
    if (storedBoletos) {
      setDownloadedBoletos(new Set(JSON.parse(storedBoletos)));
    }
  }, []);

  // Função de "download"
  const handleDownload = async (arquivo: string, recordId: string) => {
    // setIsDownloading(true);
    // setCurrentDownloadId(arquivo);

    try {
      await downloadBoleto("envios_de_boletos", recordId, arquivo);

      setDownloadedBoletos((prev) => {
        const newSet = new Set(prev);
        newSet.add(arquivo);
        localStorage.setItem(
          "downloadedBoletos",
          JSON.stringify(Array.from(newSet))
        );
        return newSet;
      });

      console.log(`Download do arquivo "${arquivo}" concluído.`);
    } catch (error) {
      console.error(`Erro ao baixar o arquivo ${arquivo}:`, error);
    } finally {
      // setIsDownloading(false);
      // setCurrentDownloadId(null);
    }
  };

  // Função para baixar todos os boletos
  // const handleDownloadAll = async () => {
  //   // setIsDownloading(true);

  //   for (const boleto of boletos) {
  //     try {
  //       await handleDownload(boleto.arquivo, boleto.id);
  //     } catch (error) {
  //       console.error(
  //         `Erro ao baixar o arquivo ${boleto.arquivo} do registro ${boleto.id}:`,
  //         error
  //       );
  //     }
  //   }

  //   // setIsDownloading(false);
  // };

  // Finaliza o processo e redireciona
  const handleFinalize = async () => {
    if (!allDownloaded) return;

    try {
      // Atualizar todos os envios
      const updates = envios.map((envio) =>
        updateEnvioDeBoletos(envio.id, { finalizado: true })
      );

      // Aguarda todas as atualizações
      await Promise.all(updates);

      console.log("Todos os envios foram marcados como finalizados.");

      // Redirecionar para o histórico após a atualização
      setIsProcessFinalized(true);
      setShowCelebration(true);

      setTimeout(() => {
        setDownloadedBoletos(new Set());
        setShowCelebration(false);
        localStorage.removeItem("downloadedBoletos");
        navigate("/imobiliaria/download-boletos/historico");
      }, 3000);
    } catch (error) {
      console.error("Erro ao finalizar os envios:", error);
      alert("Houve um erro ao finalizar os envios. Tente novamente.");
    }
  };

  // Cálculo de progresso
  const allDownloaded = downloadedBoletos.size === boletos.length;
  const progress =
    boletos.length > 0 ? (downloadedBoletos.size / boletos.length) * 100 : 0;

  // Agrupa boletos por Mês/Ano
  const groupedBoletos = boletos.reduce((acc, boleto) => {
    if (boleto.created) {
      const date = new Date(boleto.created);
      const month = date.getMonth(); // 0 - 11
      const year = date.getFullYear();
      const key = `${month}-${year}`;
      if (!acc[key]) {
        acc[key] = {
          month,
          year,
          boletos: [],
        };
      }
      acc[key].boletos.push(boleto);
    }
    return acc;
  }, {} as Record<string, { month: number; year: number; boletos: ExpandedBoleto[] }>);

  // Converte o objeto em um array para podermos ordenar (se quiser por data)
  const groupedBoletosArray = Object.values(groupedBoletos).sort(
    (a, b) =>
      // Ordena por ano e mês ascendente
      a.year - b.year || a.month - b.month
  );

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
      <div className="mb-6 flex justify-center max-h-60 overflow-y-auto">
        <CircularProgress progress={progress} size={120} strokeWidth={8} />
      </div>

      <div className="max-h-[480px] overflow-y-auto">
        {/* Aqui fazemos o loop para cada grupo de mês/ano */}
        {groupedBoletosArray.map(({ month, year, boletos: boletosDoMes }) => {
          const monthName = monthNamesPtBr[month];

          return (
            <div key={`${month}-${year}`} className="mb-8 ">
              <h2 className="text-xl font-bold text-gray-700 mb-4">
                {monthName} / {year}
              </h2>

              {/* Lista de boletos para aquele Mês/Ano */}
              <div className="space-y-4">
                {boletosDoMes.map((boleto, index) => {
                  const isDownloaded = downloadedBoletos.has(boleto.arquivo);

                  return (
                    <div
                      key={`${boleto.id}-${index}`}
                      className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 mr-5 rounded-lg shadow-md"
                    >
                      {/* Informações do boleto */}
                      <div className="flex flex-col mb-4 sm:mb-0 w-ful sm:w-auto">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <span className="font-semibold text-gray-800 text-md truncate max-w-full sm:max-w-xs cursor-pointer">
                                Arquivo: {boleto.arquivo}
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{boleto.arquivo}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        <span className="text-sm text-gray-600">
                          {`Anexado em: ${
                            boleto.created
                              ? new Date(boleto.created).toLocaleString()
                              : "Data inválida"
                          }`}
                        </span>
                      </div>

                      {/* Botão ou status de download */}
                      <div className="flex items-center space-x-2">
                        {isDownloaded ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-6 h-6 mr-2" />
                            <span>Baixado</span>
                          </div>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleDownload(boleto.arquivo, boleto.id)
                            }
                            className="bg-green-600 hover:bg-green-700 hover:text-white text-white"
                          >
                            <Download className="mr-2 h-4 w-4" /> Baixar
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Botão de finalização - visível apenas quando todos os arquivos foram baixados */}
      {allDownloaded && (
        <div className="mt-4 max-w-3xl mx-5">
          <Button
            onClick={handleFinalize}
            className="w-full py-3 px-6 font-bold rounded-full text-white bg-green-600 hover:bg-green-700 scale-105 transition-all duration-300 transform"
          >
            Finalizar e Ver Histórico
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      )}

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
