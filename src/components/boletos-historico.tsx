import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  Download,
  FileText,
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import pb from "@/utils/backend/pb-imob"

interface BoletoHistoricoItem {
  id: string
  arquivo: string
  created?: string
}

export default function BoletosHistorico() {
  const [boletos, setBoletos] = useState<BoletoHistoricoItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const currentDate = new Date()
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth())
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
  const [downloadedSet, setDownloadedSet] = useState<Set<string>>(new Set())

  // Gerar lista de anos (últimos 5 anos)
  const years = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - i
  )

  // Lista de meses
  const months = [
    { value: 0, label: "Janeiro" },
    { value: 1, label: "Fevereiro" },
    { value: 2, label: "Março" },
    { value: 3, label: "Abril" },
    { value: 4, label: "Maio" },
    { value: 5, label: "Junho" },
    { value: 6, label: "Julho" },
    { value: 7, label: "Agosto" },
    { value: 8, label: "Setembro" },
    { value: 9, label: "Outubro" },
    { value: 10, label: "Novembro" },
    { value: 11, label: "Dezembro" },
  ]

  useEffect(() => {
    fetchBoletos()
  }, [selectedMonth, selectedYear])

  const fetchBoletos = async () => {
    const currentUser = pb.authStore.model
    if (!currentUser) return

    const currentUserId = currentUser.id

    const firstDay = new Date(selectedYear, selectedMonth, 1)
    const lastDay = new Date(selectedYear, selectedMonth + 1, 0)

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

  const handlePreviousMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11)
      setSelectedYear(selectedYear - 1)
    } else {
      setSelectedMonth(selectedMonth - 1)
    }
  }

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0)
      setSelectedYear(selectedYear + 1)
    } else {
      setSelectedMonth(selectedMonth + 1)
    }
  }

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h2 className="text-xl font-bold">Histórico de Boletos Finalizados</h2>

        {/* Filtro por Mês/Ano */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePreviousMonth}
            className="h-9 w-9"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[200px] justify-between">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(new Date(selectedYear, selectedMonth), "MMMM/yyyy", {
                  locale: ptBR,
                })}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[280px] p-4" align="end">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Mês</label>
                  <Select
                    value={selectedMonth.toString()}
                    onValueChange={(value) => setSelectedMonth(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem
                          key={month.value}
                          value={month.value.toString()}
                        >
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Ano</label>
                  <Select
                    value={selectedYear.toString()}
                    onValueChange={(value) => setSelectedYear(Number(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          <Button
            variant="outline"
            size="icon"
            onClick={handleNextMonth}
            className="h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
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
