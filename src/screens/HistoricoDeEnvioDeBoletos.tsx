import { useState, useEffect, useRef } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import {
  CalendarIcon,
  Filter,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  XCircle,
  Inbox,
  Paperclip,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  // PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EnvioDeBoletos } from "@/types/EnviosDeBoletos"
import { fetchEnvioDeBoletosList } from "@/utils/api/EnvioDeBoletosService"

const ITEMS_PER_PAGE = 7 // Definindo o número de itens por página

export default function HistoricoEnvios() {
  const [date, setDate] = useState<Date>(new Date())
  const [envios, setEnvios] = useState<EnvioDeBoletos[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchInput, setSearchInput] = useState("")
  const [debouncedSearch, setDebouncedSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<
    "todos" | "finalizados" | "pendentes"
  >("todos")
  const [loading, setLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const tableRef = useRef<HTMLDivElement | null>(null)

  // Debounce search input
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchInput.trim()), 300)
    return () => clearTimeout(t)
  }, [searchInput])

  useEffect(() => {
    fetchEnvios()
  }, [date, debouncedSearch, statusFilter, currentPage])

  const fetchEnvios = async () => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1)
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0)

    try {
      setLoading(true)
      const { items, totalPages } = await fetchEnvioDeBoletosList(
        currentPage,
        ITEMS_PER_PAGE,
        debouncedSearch,
        {
          created: `created >= "${firstDay.toISOString()}" && created <= "${lastDay.toISOString()}"`,
          finalizado:
            statusFilter !== "todos"
              ? statusFilter === "finalizados"
              : undefined,
        }
      )

      setEnvios(items)
      setTotalPages(totalPages)
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Erro ao buscar envios:", error)
    } finally {
      setLoading(false)
    }
  }

  // Month navigation helpers
  const goPrevMonth = () => {
    const prev = new Date(date)
    prev.setMonth(prev.getMonth() - 1)
    setDate(prev)
    setCurrentPage(1)
  }

  const goNextMonth = () => {
    const next = new Date(date)
    next.setMonth(next.getMonth() + 1)
    setDate(next)
    setCurrentPage(1)
  }

  const resetFilters = () => {
    setDate(new Date())
    setSearchInput("")
    setDebouncedSearch("")
    setStatusFilter("todos")
    setCurrentPage(1)
  }

  const refresh = () => {
    fetchEnvios()
  }

  const handleStatusChange = (value: "todos" | "finalizados" | "pendentes") => {
    setStatusFilter(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll table into view for better UX on long pages
    setTimeout(
      () =>
        tableRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        }),
      0
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          Histórico de Envios
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-3 mb-4">
          {/* Top row: Month navigation + Calendar + Search */}
          <div className="flex flex-col lg:flex-row justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={goPrevMonth}
                aria-label="Mês anterior"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[220px] justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? (
                      format(date, "MMMM/yyyy", { locale: ptBR })
                    ) : (
                      <span>Selecione o mês</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={(newDate) => {
                      if (newDate) {
                        setDate(newDate)
                        setCurrentPage(1)
                      }
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                size="icon"
                onClick={goNextMonth}
                aria-label="Próximo mês"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center gap-2 w-full lg:w-auto">
              <Input
                placeholder="Buscar imobiliária..."
                value={searchInput}
                onChange={(e) => {
                  setSearchInput(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full lg:w-[320px]"
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtrar
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => handleStatusChange("todos")}>
                    Todos
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("finalizados")}
                  >
                    Finalizados
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleStatusChange("pendentes")}
                  >
                    Pendentes
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="outline"
                onClick={resetFilters}
                aria-label="Limpar filtros"
              >
                <XCircle className="h-4 w-4 mr-2" /> Limpar
              </Button>
              <Button
                variant="outline"
                onClick={refresh}
                aria-label="Atualizar"
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Atualizar
              </Button>
            </div>
          </div>
          {lastUpdated && (
            <div className="text-xs text-muted-foreground">
              Última atualização: {format(lastUpdated, "dd/MM/yyyy HH:mm:ss")}
            </div>
          )}
        </div>

        <div ref={tableRef} className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Imobiliária</TableHead>
                <TableHead>Arquivos</TableHead>
                <TableHead className="w-[150px]">Status</TableHead>
                <TableHead className="w-[180px]">Data de Criação</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: ITEMS_PER_PAGE }).map((_, idx) => (
                  <TableRow key={`skeleton-${idx}`} className="animate-pulse">
                    <TableCell>
                      <div className="h-4 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-10 bg-gray-200 dark:bg-gray-700 rounded" />
                    </TableCell>
                    <TableCell>
                      <div className="h-5 w-20 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <div className="h-4 w-24 bg-gray-200 dark:bg-gray-700 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              ) : envios.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4}>
                    <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                      <Inbox className="h-10 w-10 mb-2" />
                      <p className="text-sm">
                        Nenhum envio encontrado para os filtros selecionados.
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                envios.map((envio) => (
                  <TableRow key={envio.id}>
                    <TableCell className="font-medium">
                      {envio.expand?.imobiliaria?.nome || envio.imobiliaria}
                    </TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-1">
                        <Paperclip className="h-3.5 w-3.5 opacity-70" />
                        <span>{envio.arquivos.length}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          envio.finalizado
                            ? "bg-green-100 text-green-900"
                            : "bg-yellow-100 text-yellow-900"
                        }`}
                      >
                        {envio.finalizado ? "Finalizado" : "Pendente"}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(envio.created), "dd/MM/yyyy")}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
                className="cursor-pointer"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page} className="cursor-pointer">
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  handlePageChange(Math.min(currentPage + 1, totalPages))
                }
                className="cursor-pointer"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}
