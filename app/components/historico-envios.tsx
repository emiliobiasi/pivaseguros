import { useState, useEffect } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Filter } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MagnifyingGlassIcon, ChevronDownIcon } from "@radix-ui/react-icons"

interface Envio {
  id: string
  imobiliaria: string
  arquivos: string[]
  finalizado: boolean
  created: Date
}

const ITEMS_PER_PAGE = 5 // Definindo o número de itens por página

export default function HistoricoEnvios() {
  const [date, setDate] = useState<Date>(new Date())
  const [envios, setEnvios] = useState<Envio[]>([])
  const [filteredEnvios, setFilteredEnvios] = useState<Envio[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<"todos" | "finalizados" | "pendentes">("todos")

  useEffect(() => {
    fetchEnvios()
  }, [])

  useEffect(() => {
    filterEnvios()
  }, [envios, searchTerm, statusFilter]) //Fixed unnecessary dependencies

  const fetchEnvios = async () => {
    // Simular chamada à API
    const simulatedData: Envio[] = Array.from({ length: 50 }, (_, index) => ({
      id: `${index + 1}`,
      imobiliaria: `Imobiliária ${String.fromCharCode(65 + (index % 26))}`,
      arquivos: [`contrato_${(index + 1).toString().padStart(3, "0")}.pdf`],
      finalizado: index % 2 === 0,
      created: new Date(2023, date.getMonth(), index + 1),
    }))

    setEnvios(simulatedData)
  }

  const filterEnvios = () => {
    let filtered = envios.filter((envio) => envio.imobiliaria.toLowerCase().includes(searchTerm.toLowerCase()))

    if (statusFilter !== "todos") {
      filtered = filtered.filter((envio) => (statusFilter === "finalizados" ? envio.finalizado : !envio.finalizado))
    }

    setFilteredEnvios(filtered)
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE))
    setCurrentPage(1)
  }

  const paginatedEnvios = filteredEnvios.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Histórico de Envios</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full sm:w-[240px] justify-start text-left font-normal",
                    !date && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "MMMM yyyy", { locale: ptBR }) : <span>Selecione o mês</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(newDate) => newDate && setDate(newDate)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Input
              placeholder="Buscar imobiliária..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-[300px]"
              icon={<MagnifyingGlassIcon className="h-4 w-4 text-gray-500" />}
            />
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrar
                  <ChevronDownIcon className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setStatusFilter("todos")}>Todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("finalizados")}>Finalizados</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setStatusFilter("pendentes")}>Pendentes</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="rounded-md border overflow-x-auto">
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
              {paginatedEnvios.map((envio) => (
                <TableRow key={envio.id}>
                  <TableCell className="font-medium">{envio.imobiliaria}</TableCell>
                  <TableCell>{envio.arquivos.join(", ")}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        envio.finalizado ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {envio.finalizado ? "Finalizado" : "Pendente"}
                    </span>
                  </TableCell>
                  <TableCell>{format(envio.created, "dd/MM/yyyy")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Pagination className="mt-4">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink onClick={() => setCurrentPage(page)} isActive={currentPage === page}>
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </CardContent>
    </Card>
  )
}

