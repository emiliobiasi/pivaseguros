import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { EnvioDeBoletos } from "@/types/EnviosDeBoletos"
import {
  fetchEnvioDeBoletosList,
  downloadBoleto,
} from "@/utils/api/EnvioDeBoletosService"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import pb from "@/utils/backend/pb-imob"

interface BoletoHistoricoItem {
  id: string
  arquivo: string
  created?: string
}

export default function BoletosHistorico() {
  const [boletos, setBoletos] = useState<BoletoHistoricoItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [downloadedSet, setDownloadedSet] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchBoletos()
  }, [selectedDate])

  const fetchBoletos = async () => {
    const currentUser = pb.authStore.model
    if (!currentUser) return

    const currentUserId = currentUser.id

    const firstDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth(),
      1
    )
    const lastDay = new Date(
      selectedDate.getFullYear(),
      selectedDate.getMonth() + 1,
      0
    )

    setIsLoading(true)
    try {
      const response = await fetchEnvioDeBoletosList(1, 50, "", {
        imobiliaria: currentUserId,
        finalizado: true,
        created: `created >= "${firstDay.toISOString()}" && created <= "${lastDay.toISOString()}"`,
      })

      const expanded = response.items.flatMap((envio: EnvioDeBoletos) =>
        envio.arquivos.map((arquivo) => ({
          id: envio.id,
          arquivo,
          created: envio.created
            ? new Date(envio.created).toLocaleString()
            : undefined,
        }))
      )

      setBoletos(expanded)
    } catch (error) {
      console.error("Erro ao buscar boletos finalizados:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async (recordId: string, arquivo: string) => {
    try {
      await downloadBoleto("envios_de_boletos", recordId, arquivo)
      setDownloadedSet((prev) => {
        const newSet = new Set(prev)
        newSet.add(arquivo)
        localStorage.setItem(
          "historicoBoletosDownloadedSet",
          JSON.stringify(Array.from(newSet))
        )
        return newSet
      })
    } catch (error) {
      console.error("Erro ao baixar o boleto:", error)
    }
  }

  return (
    <div className="p-4">
      <div className="flex space-x-4 items-center justify-between mb-6">
        <h2 className="text-xl font-bold mb-4">
          Histórico de Boletos Finalizados
        </h2>

        {/* Filtro por Mês */}
        <div className="mb-6 flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(selectedDate, "MMMM/yyyy", { locale: ptBR })}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Seção de Carregamento */}
      {isLoading ? (
        <div className="p-8 text-center">Carregando histórico...</div>
      ) : boletos.length === 0 ? (
        <div className="text-center text-gray-500 p-8">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-xl font-semibold">
            Nenhum boleto finalizado neste período.
          </p>
          <p className="mt-2">
            Selecione outro mês para visualizar boletos antigos.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {boletos.map((boleto, index) => {
            const alreadyDownloaded = downloadedSet.has(boleto.arquivo)
            return (
              <div
                key={`${boleto.id}-${boleto.arquivo}-${index}`}
                className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow-md"
              >
                <div className="flex flex-col mb-2 sm:mb-0">
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
                  <Download className="mr-2 h-4 w-4" />
                  {alreadyDownloaded ? "Baixar Novamente" : "Baixar"}
                </Button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
