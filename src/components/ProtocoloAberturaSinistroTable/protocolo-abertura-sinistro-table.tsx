import { AberturaSinistro } from "@/types/AberturaSinistro"
import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Clock,
  CheckCircle,
  Loader2,
  ChevronUp,
  ChevronDown,
} from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

import {
  updateAberturaSinistroToPending,
  updateAberturaSinistroToFinalized,
} from "@/utils/api/AberturaSinistroService"
import { Toaster } from "@/components/ui/sonner"
import { toast } from "sonner"
import { AberturaSinistroModal } from "../AberturaSinistroModal/protocolo-abertura-sinistro-modal"

// Props para o componente TableContent
type TableContentProps = {
  data: AberturaSinistro[]
}

export function ProtocoloAberturaSinistroTable({ data }: TableContentProps) {
  const [seguros, setSeguros] = useState<AberturaSinistro[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedSeguro, setSelectedSeguro] = useState<AberturaSinistro | null>(
    null
  )
  const [isLoading, setIsLoading] = useState(true)
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"acao" | "hora" | null>(null)

  // Função para ordenar automaticamente os pendentes acima dos finalizados
  const ordenarPendentesPrimeiro = (seguros: AberturaSinistro[]) => {
    return seguros.sort((a, b) => {
      if (a.acao === "PENDENTE" && b.acao === "FINALIZADO") return -1
      if (a.acao === "FINALIZADO" && b.acao === "PENDENTE") return 1
      return 0
    })
  }

  // Ordenação por ação
  const sortByAcao = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
    const sortedSeguros = [...seguros].sort((a, b) => {
      if (newSortOrder === "asc") {
        return a.acao.localeCompare(b.acao)
      } else {
        return b.acao.localeCompare(a.acao)
      }
    })
    setSeguros(sortedSeguros)
    setSortBy("acao")
    setSortOrder(newSortOrder)
  }

  // Ordenação por hora
  const sortByHora = () => {
    const newSortOrder = sortOrder === "asc" ? "desc" : "asc"
    const sortedSeguros = [...seguros].sort((a, b) => {
      const dateA = new Date(a.created).getTime()
      const dateB = new Date(b.created).getTime()
      return newSortOrder === "asc" ? dateA - dateB : dateB - dateA
    })
    setSeguros(sortedSeguros)
    setSortBy("hora")
    setSortOrder(newSortOrder)
  }

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => {
      setSeguros(ordenarPendentesPrimeiro(data))
      setIsLoading(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [data])

  const handleAcaoChange = async (
    id: string,
    novaAcao: "PENDENTE" | "FINALIZADO"
  ) => {
    try {
      setLoadingAction(id)
      let updatedRecord: AberturaSinistro
      if (novaAcao === "PENDENTE") {
        updatedRecord = await updateAberturaSinistroToPending(id)
      } else {
        updatedRecord = await updateAberturaSinistroToFinalized(id)
      }

      setSeguros((prevSeguros) => {
        const updatedSeguros = prevSeguros.map((seguro) =>
          seguro.id === id ? { ...seguro, acao: updatedRecord.acao } : seguro
        )
        return ordenarPendentesPrimeiro(updatedSeguros)
      })

      toast.success(`O status da ação foi atualizado para ${novaAcao}`, {
        duration: 3000,
      })
    } catch (error) {
      console.error("Erro ao atualizar o seguro:", error)
      toast.error("Erro ao atualizar o status da ação.")
    } finally {
      setLoadingAction(null)
    }
  }

  const openUserModal = (seguro: AberturaSinistro) => {
    setSelectedSeguro(seguro)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setSelectedSeguro(null)
    setIsModalOpen(false)
  }

  return (
    <div
      className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 h-screen flex flex-col "
      style={{ height: "calc(100vh - 15.625rem)" }}
    >
      <Toaster />
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg flex-grow overflow-y-auto">
        <div className="overflow-x-auto">
          {isLoading ? (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    ID
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Ação
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Nome da Imobiliária
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Tipo do Seguro
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Hora
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {[...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <Skeleton className="h-6 w-16" />
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <Skeleton className="h-6 w-24" />
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <Skeleton className="h-6 w-32" />
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <Skeleton className="h-6 w-20" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <Table>
              <TableHeader className="bg-gray-50 dark:bg-gray-700">
                <TableRow>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    ID
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 lg:px-6 lg:py-3 cursor-pointer"
                    onClick={sortByAcao}
                  >
                    Ação
                    {sortBy === "acao" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="inline ml-1" />
                      ) : (
                        <ChevronDown className="inline ml-1" />
                      ))}
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Nome da Imobiliária
                  </TableHead>
                  <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                    Tipo do Seguro
                  </TableHead>
                  <TableHead
                    className="px-3 py-2 lg:px-6 lg:py-3 cursor-pointer"
                    onClick={sortByHora}
                  >
                    Hora
                    {sortBy === "hora" &&
                      (sortOrder === "asc" ? (
                        <ChevronUp className="inline ml-1" />
                      ) : (
                        <ChevronDown className="inline ml-1" />
                      ))}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {seguros.map((seguro) => (
                  <TableRow
                    key={seguro.id}
                    className={
                      seguro.acao === "FINALIZADO"
                        ? "bg-gray-100 dark:bg-gray-700"
                        : ""
                    }
                  >
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      {seguro.id_numero}
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      {loadingAction === seguro.id ? (
                        <div className="flex items-center">
                          <Loader2 className="animate-spin w-4 h-4 mr-2" />
                          {seguro.acao === "PENDENTE"
                            ? "Finalizando..."
                            : "Voltando para Pendente..."}
                        </div>
                      ) : (
                        <Select
                          value={seguro.acao}
                          onValueChange={(value) =>
                            handleAcaoChange(
                              seguro.id,
                              value as "PENDENTE" | "FINALIZADO"
                            )
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDENTE">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                <span>Pendente</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="FINALIZADO">
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Finalizado</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      <button
                        onClick={() => openUserModal(seguro)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {seguro.nome_imobiliaria}
                      </button>
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      {seguro.tipo_seguro}
                    </TableCell>
                    <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                      {new Date(seguro.created).toLocaleDateString()} -{" "}
                      {new Date(seguro.created).toLocaleTimeString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
      {selectedSeguro && (
        <AberturaSinistroModal
          titulo={selectedSeguro}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  )
}
