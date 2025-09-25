import { useEffect, useMemo, useState } from "react"
import pb from "@/utils/backend/pb-imob"
import { CancelamentoSeguros } from "@/types/CancelamentoSeguros"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  FileText,
  ExternalLink,
  Loader2,
  Search,
  RefreshCw,
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ProtocoloCancelamentoSegurosPage() {
  const [items, setItems] = useState<CancelamentoSeguros[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  // searchInput: valor que o usuário digita; searchTerm: valor efetivamente aplicado no filtro
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [refreshKey, setRefreshKey] = useState(0)
  const limit = 8

  const { imobiliariaId, imobiliariaNome } = useMemo(() => {
    const model: any = pb.authStore.model
    if (model?.collectionName === "imobiliarias") {
      return {
        imobiliariaId: model.id as string,
        imobiliariaNome: model.nome as string,
      }
    }
    return { imobiliariaId: "", imobiliariaNome: "" }
  }, [])

  useEffect(() => {
    let ignore = false
    const fetchData = async () => {
      setLoading(true)
      try {
        const filters: string[] = []
        if (imobiliariaId) {
          filters.push(
            `(imobiliaria = "${imobiliariaId}" || nome_imobiliaria = "${imobiliariaNome}")`
          )
        }
        const term = searchTerm.trim()
        if (term) {
          const n = parseInt(term, 10)
          if (!Number.isNaN(n)) {
            // Busca exata por número do protocolo (somente ID numérico)
            filters.push(`(id_numero = ${n})`)
          }
        }
        const filter = filters.join(" && ")
        const res = await pb
          .collection("cancelamento_seguros")
          .getList<CancelamentoSeguros>(page, limit, {
            sort: "-created",
            filter,
          })
        if (!ignore) {
          setItems(res.items)
          setTotalPages(res.totalPages || 1)
        }
      } catch (e) {
        console.error("Erro ao carregar protocolos de cancelamento:", e)
        if (!ignore) {
          setItems([])
          setTotalPages(1)
        }
      } finally {
        if (!ignore) setLoading(false)
      }
    }
    fetchData()
    return () => {
      ignore = true
    }
  }, [page, imobiliariaId, imobiliariaNome, searchTerm, refreshKey])

  // Debounce da busca para reduzir requisições enquanto digita
  useEffect(() => {
    const handle = setTimeout(() => {
      setPage(1)
      setSearchTerm(searchInput)
    }, 350)
    return () => clearTimeout(handle)
  }, [searchInput])

  const getFileUrl = (recordId: string, filename: string) => {
    // Usa helper do PocketBase para montar a URL do arquivo
    return pb.files.getUrl(
      { id: recordId, collectionId: "cancelamento_seguros" } as any,
      filename
    )
  }

  const formatDate = (value: string | Date) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "—"
    const dd = String(d.getDate()).padStart(2, "0")
    const mm = String(d.getMonth() + 1).padStart(2, "0")
    const yyyy = d.getFullYear()
    return `${dd}/${mm}/${yyyy}`
  }

  const formatTime = (value: string | Date) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return "—"
    const HH = String(d.getHours()).padStart(2, "0")
    const MM = String(d.getMinutes()).padStart(2, "0")
    const SS = String(d.getSeconds()).padStart(2, "0")
    return `${HH}:${MM}:${SS}`
  }

  // Remove o sufixo aleatório do PocketBase antes da extensão
  // Ex.: "piva_2_xLqFjVdpsF.pdf" -> "piva_2.pdf"
  const friendlyFileName = (fname: string) => {
    const lastDot = fname.lastIndexOf(".")
    if (lastDot <= 0) return fname
    const base = fname.slice(0, lastDot)
    const ext = fname.slice(lastDot) // inclui o ponto
    // remove _<10 chars alfanuméricos> no fim do base
    const cleanedBase = base.replace(/_[A-Za-z0-9]{10}$/u, "")
    return `${cleanedBase}${ext}`
  }

  return (
    <div className="mx-auto mb-16 w-full max-w-6xl p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Protocolos de Cancelamentos</h1>
          {imobiliariaNome && (
            <p className="text-sm text-muted-foreground">
              Imobiliária:{" "}
              <span className="font-medium">{imobiliariaNome}</span>
            </p>
          )}
        </div>
        <div className="flex w-full flex-col items-stretch gap-3 sm:w-auto sm:flex-row sm:items-center">
          <div className="relative w-full sm:w-64">
            <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={searchInput}
              inputMode="numeric"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setPage(1)
                  setSearchTerm(searchInput)
                }
              }}
              onChange={(e) => {
                // Mantém apenas dígitos para busca exclusiva por ID
                const digits = e.target.value.replace(/\D/g, "")
                setSearchInput(digits)
              }}
              placeholder="Buscar por ID (somente números)"
              className="pl-8"
            />
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="piva"
                  size="lg"
                  onClick={() => setRefreshKey((k) => k + 1)}
                  disabled={loading}
                  aria-label="Atualizar lista de protocolos"
                  className="shadow-sm"
                >
                  <RefreshCw
                    className={
                      "mr-2 h-4 w-4 " + (loading ? "animate-spin" : "")
                    }
                  />
                  Atualizar
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                Recarrega a lista de protocolos agora
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              disabled={page === 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Página anterior
            </Button>
            <div className="text-sm text-muted-foreground">
              Página <span className="font-medium text-foreground">{page}</span>{" "}
              de {totalPages}
            </div>
            <Button
              variant="outline"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima página
            </Button>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <Table className="border-separate border-spacing-0">
          <TableHeader>
            <TableRow className="[&>th]:pl-4 md:[&>th]:pl-5 [&>th+th]:pl-6 md:[&>th+th]:pl-8 [&>th]:border-b [&>th]:border-border/30">
              <TableHead className="w-[11rem]">Protocolo (ID)</TableHead>
              <TableHead className="min-w-[110px] text-center">Ação</TableHead>
              <TableHead className="min-w-[160px]">Tipo do Seguro</TableHead>
              <TableHead className="min-w-[160px]">Criado em</TableHead>
              <TableHead>PDFs</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="flex items-center gap-2 py-6 text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                  </div>
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <div className="py-6 text-sm text-muted-foreground">
                    Nenhum protocolo encontrado.
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              items.map((rec) => (
                <TableRow
                  key={rec.id}
                  className="[&>td]:pl-4 md:[&>td]:pl-5 [&>td+td]:pl-6 md:[&>td+td]:pl-8 [&>td]:border-t [&>td]:border-border/30 first:[&>td]:border-t-0 hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="font-medium">
                    #{rec.id_numero}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className={
                        "inline-flex items-center justify-center rounded-full px-2.5 py-0.5 text-xs font-medium " +
                        (rec.acao === "FINALIZADO"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200")
                      }
                    >
                      {rec.acao ?? "—"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{rec.tipo_seguro ?? "—"}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {formatDate(rec.created as any)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(rec.created as any)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {Array.isArray(rec.pdf_field) &&
                    rec.pdf_field.length > 0 ? (
                      <div className="flex flex-wrap items-center gap-2">
                        {rec.pdf_field.map((fname) => (
                          <a
                            key={fname}
                            href={getFileUrl(rec.id, fname)}
                            target="_blank"
                            rel="noreferrer"
                            className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm shadow-sm transition-colors hover:bg-accent hover:border-emerald-300/60 hover:shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                            title={friendlyFileName(fname)}
                            download={friendlyFileName(fname)}
                          >
                            <FileText className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                            <span className="max-w-[240px] truncate group-hover:underline">
                              {friendlyFileName(fname)}
                            </span>
                            <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                          </a>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
