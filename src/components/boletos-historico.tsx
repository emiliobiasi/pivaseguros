import { useState, useEffect } from "react";
import { Download, FileText, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import pb from "@/utils/backend/pb";
import { EnvioDeBoletos } from "@/types/EnviosDeBoletos";
import {
  fetchEnvioDeBoletosList,
  downloadBoleto,
} from "@/utils/api/EnvioDeBoletosService";

interface BoletoHistoricoItem {
  id: string; 
  arquivo: string; 
  created?: string; 
}

export default function BoletosHistorico() {
  const [boletos, setBoletos] = useState<BoletoHistoricoItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [downloadedSet, setDownloadedSet] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Exemplo: pegar o usuário atual do PocketBase
    const currentUser = pb.authStore.model;
    if (!currentUser) return;

    const currentUserId = currentUser.id;

    // Buscar somente os boletos "finalizados" do usuário atual
    setIsLoading(true);
    fetchEnvioDeBoletosList(1, 50, "", {
      imobiliaria: currentUserId,
      finalizado: true,
    })
      .then((response) => {
        // 'response.items' retorna um array de EnvioDeBoletos
        // Precisamos "achatar" (flatten) a lista de 'arquivos'
        const expanded = response.items.flatMap((envio: EnvioDeBoletos) =>
          envio.arquivos.map((arquivo) => ({
            id: envio.id,
            arquivo,
            // Ajuste se quiser mostrar a data formatada
            created: envio.created
              ? new Date(envio.created).toLocaleString()
              : undefined,
          }))
        );
        setBoletos(expanded);
      })
      .catch((error) => {
        console.error("Erro ao buscar boletos finalizados:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // Opcional: recuperar e armazenar no localStorage se o usuário já tiver
  // re-baixado algum arquivo do histórico
  useEffect(() => {
    const stored = localStorage.getItem("historicoBoletosDownloadedSet");
    if (stored) {
      setDownloadedSet(new Set(JSON.parse(stored)));
    }
  }, []);

  // Função para realizar o download de um arquivo
  const handleDownload = async (recordId: string, arquivo: string) => {
    try {
      await downloadBoleto("envios_de_boletos", recordId, arquivo);

      // Marca como baixado (novamente) e salva no localStorage
      setDownloadedSet((prev) => {
        const newSet = new Set(prev);
        newSet.add(arquivo);

        // Se quiser registrar no localStorage
        localStorage.setItem(
          "historicoBoletosDownloadedSet",
          JSON.stringify(Array.from(newSet))
        );
        return newSet;
      });
    } catch (error) {
      console.error("Erro ao baixar o boleto:", error);
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando histórico...</div>;
  }

  if (boletos.length === 0) {
    return (
      <div className="text-center text-gray-500 p-8">
        <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <p className="text-xl font-semibold">Nenhum boleto finalizado ainda.</p>
        <p className="mt-2">
          Quando houver boletos finalizados, aparecerão aqui.
        </p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">
        Histórico de Boletos Finalizados
      </h2>
      <div className="space-y-4">
        {boletos.map((boleto, index) => {
          const alreadyDownloaded = downloadedSet.has(boleto.arquivo);

          return (
            <div
              key={`${boleto.id}-${boleto.arquivo}-${index}`}
              className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
            >
              <div className="flex flex-col mb-2 sm:mb-0">
                {/* Exemplo de informações que você queira exibir */}
                <span className="font-medium text-gray-700 text-lg">
                  Arquivo: {boleto.arquivo}
                </span>
                {boleto.created && (
                  <span className="text-sm text-gray-500">
                    Data do Envio: {boleto.created}
                  </span>
                )}
              </div>

              <Button
                size="sm"
                variant="outline"
                onClick={() => handleDownload(boleto.id, boleto.arquivo)}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white hover:from-green-700 hover:text-white hover:to-green-800 w-full sm:w-auto mt-2 sm:mt-0"
              >
                {alreadyDownloaded ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Baixar Novamente
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar Novamente
                  </>
                )}
              </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
