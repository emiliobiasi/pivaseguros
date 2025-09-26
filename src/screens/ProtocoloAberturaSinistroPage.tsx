import { useEffect, useMemo, useState } from "react"
import pb from "@/utils/backend/pb-imob"
import { AberturaSinistro } from "@/types/AberturaSinistro"
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
  Paperclip,
  Upload as UploadIcon,
  Trash2,
  Lock,
} from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function ProtocoloAberturaSinistroPage() {
  const [items, setItems] = useState<AberturaSinistro[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filesDialog, setFilesDialog] = useState<{
    rec: AberturaSinistro
    files: string[]
  } | null>(null)
  const [addDialog, setAddDialog] = useState<AberturaSinistro | null>(null)
  const [addFiles, setAddFiles] = useState<File[]>([])
  const [adding, setAdding] = useState(false)
  const [fileFilter, setFileFilter] = useState("")
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
          .collection("abertura_sinistro")
          .getList<AberturaSinistro>(page, limit, {
            sort: "-created",
            filter,
          })
        if (!ignore) {
          setItems(res.items)
          setTotalPages(res.totalPages || 1)
        }
      } catch (e) {
        console.error("Erro ao carregar protocolos de abertura:", e)
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
      { id: recordId, collectionId: "abertura_sinistro" } as any,
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

  // Dropzone para adicionar novos PDFs no modal de "Adicionar arquivos"
  const onDropAdd = (accepted: File[]) => {
    // mantém apenas PDFs e evita duplicatas por nome
    const pdfs = accepted.filter((f) => f.type === "application/pdf")
    if (pdfs.length !== accepted.length) {
      toast.warning("Apenas arquivos PDF são aceitos.")
    }
    setAddFiles((prev) => {
      const MAX_TOTAL = 20
      const existingCount = Array.isArray(addDialog?.pdf_field)
        ? addDialog!.pdf_field.length
        : 0
      const byName = new Map(prev.map((f) => [f.name, f]))

      // Lista apenas os arquivos novos que ainda não estão na seleção
      const candidates: File[] = []
      for (const f of pdfs) {
        if (!byName.has(f.name)) candidates.push(f)
      }

      const currentSelected = byName.size
      const availableSlots = Math.max(
        0,
        MAX_TOTAL - existingCount - currentSelected
      )

      if (availableSlots <= 0) {
        toast.error(
          `Limite de ${MAX_TOTAL} arquivos atingido para este protocolo. Remova algum arquivo da seleção ou do protocolo para continuar.`
        )
        return Array.from(byName.values())
      }

      const toAdd = candidates.slice(0, availableSlots)
      for (const f of toAdd) byName.set(f.name, f)

      if (candidates.length > toAdd.length) {
        toast.warning(
          `Só é possível adicionar mais ${availableSlots} arquivo${
            availableSlots !== 1 ? "s" : ""
          } agora (máximo total: ${MAX_TOTAL}; já há ${existingCount} no protocolo).`
        )
      }

      return Array.from(byName.values())
    })
  }

  // Calcula estado de limite (20): ao atingir 20, bloqueia novas seleções, mas permite confirmar envio
  const existingCountForModal =
    addDialog && Array.isArray(addDialog.pdf_field)
      ? addDialog.pdf_field.length
      : 0
  const totalAfterSelection = existingCountForModal + addFiles.length
  const atCap = totalAfterSelection >= 20 // chegou no máximo
  const overCap = totalAfterSelection > 20 // acima do máximo (não deve ocorrer devido à validação, mas por segurança)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: onDropAdd,
    accept: { "application/pdf": [".pdf"] },
    multiple: true,
    disabled: atCap, // ao atingir 20, apenas impede selecionar mais
  })

  const removeAddFile = (name: string) => {
    setAddFiles((prev) => prev.filter((f) => f.name !== name))
  }

  const submitAddFiles = async () => {
    if (!addDialog || addFiles.length === 0) return
    try {
      setAdding(true)
      const form = new FormData()
      // Preserva arquivos existentes
      const existing = Array.isArray(addDialog.pdf_field)
        ? addDialog.pdf_field
        : []
      const MAX_TOTAL = 20
      const availableSlots = Math.max(0, MAX_TOTAL - existing.length)
      const filesToSend = addFiles.slice(0, availableSlots)
      if (filesToSend.length === 0) {
        toast.error(
          `Limite de ${MAX_TOTAL} arquivos atingido para este protocolo.`
        )
        setAdding(false)
        return
      }
      for (const fname of existing) {
        form.append("pdf_field", fname)
      }
      // Adiciona novos PDFs
      for (const f of filesToSend) {
        form.append("pdf_field", f)
      }
      const updated = await pb
        .collection("abertura_sinistro")
        .update<AberturaSinistro>(addDialog.id, form)

      // Atualiza lista e diálogos locais
      setItems((prev) =>
        prev.map((it) => (it.id === updated.id ? updated : it))
      )
      if (filesDialog?.rec?.id === updated.id) {
        setFilesDialog({ rec: updated, files: updated.pdf_field || [] })
      }
      const sent = filesToSend.length
      if (sent < addFiles.length) {
        toast.warning(
          `${sent} de ${addFiles.length} arquivo${
            addFiles.length > 1 ? "s" : ""
          } foram enviados (limite total de ${MAX_TOTAL} atingido).`
        )
      } else {
        toast.success(
          `${sent} arquivo${sent > 1 ? "s" : ""} anexado${
            sent > 1 ? "s" : ""
          } com sucesso.`
        )
      }
      setAddFiles([])
      setAddDialog(null)
    } catch (e) {
      console.error(e)
      toast.error("Não foi possível anexar os arquivos. Tente novamente.")
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="mx-auto mb-16 w-full max-w-6xl p-4">
      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-semibold">Protocolos de Abertura</h1>
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

      <div
        className="mb-3 rounded-md border bg-muted/40 px-3 py-2 text-sm text-muted-foreground shadow-sm"
        role="note"
        aria-label="Dica sobre anexos"
      >
        <div className="flex items-start gap-2">
          <Paperclip className="mt-0.5 h-4 w-4 text-emerald-600" />
          <div className="leading-5">
            <p>
              Para anexar documentos adicionais ao protocolo, use o botão
              <span className="mx-1 font-medium">“Adicionar”</span>na coluna
              PDFs.
            </p>
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
                      (() => {
                        const files = rec.pdf_field
                        const maxInline = 3
                        const inline = files.slice(0, maxInline)
                        const extra = files.length - inline.length
                        return (
                          <div className="flex flex-wrap items-center gap-2">
                            {inline.map((fname) => (
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
                                <span className="max-w-[200px] truncate group-hover:underline">
                                  {friendlyFileName(fname)}
                                </span>
                                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-foreground" />
                              </a>
                            ))}
                            {extra > 0 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setFileFilter("")
                                  setFilesDialog({ rec, files })
                                }}
                                className="px-2 py-1 text-xs"
                              >
                                +{extra} mais
                              </Button>
                            )}
                            {files.length >= 20 ? (
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <span
                                      className="inline-flex cursor-not-allowed"
                                      tabIndex={0}
                                      aria-label={`Limite de arquivos atingido para protocolo #${rec.id_numero}`}
                                    >
                                      <Button
                                        variant="outline"
                                        size="sm"
                                        disabled
                                        className="px-2 py-1 text-xs bg-white text-muted-foreground border-muted-foreground/30 opacity-80 pointer-events-none"
                                      >
                                        <Lock className="mr-1 h-3.5 w-3.5" />
                                        Limite atingido
                                      </Button>
                                    </span>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="bottom"
                                    className="max-w-[320px] p-3 text-sm leading-5"
                                  >
                                    Você não pode adicionar mais arquivos: o
                                    limite de arquivos adicionais para este
                                    protocolo já foi atingido (máximo de 20
                                    arquivos).
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <Button
                                variant="piva"
                                size="sm"
                                onClick={() => {
                                  setAddFiles([])
                                  setAddDialog(rec)
                                }}
                                className="px-2 py-1 text-xs"
                                aria-label={`Adicionar arquivos ao protocolo #${rec.id_numero}`}
                              >
                                <Paperclip className="mr-1 h-3.5 w-3.5" />
                                Adicionar
                              </Button>
                            )}
                            <span className="text-xs text-muted-foreground ml-1">
                              • {files.length}{" "}
                              {files.length > 1 ? "arquivos" : "arquivo"}{" "}
                              enviados
                            </span>
                          </div>
                        )
                      })()
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
      {/* Dialog: ver todos os anexos */}
      <Dialog
        open={!!filesDialog}
        onOpenChange={(open) => !open && setFilesDialog(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              Arquivos do protocolo {filesDialog?.rec?.id_numero}
              {filesDialog?.files && (
                <span className="ml-2 text-sm font-normal text-muted-foreground">
                  ({filesDialog.files.length}{" "}
                  {filesDialog.files.length > 1 ? "arquivos" : "arquivo"})
                </span>
              )}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={fileFilter}
                onChange={(e) => setFileFilter(e.target.value)}
                placeholder="Filtrar por nome do arquivo"
                className="pl-8"
              />
            </div>
            <div className="max-h-[420px] overflow-auto rounded-md border">
              {(() => {
                const list = filesDialog?.files || []
                const filtered = fileFilter
                  ? list.filter((f) =>
                      friendlyFileName(f)
                        .toLowerCase()
                        .includes(fileFilter.toLowerCase())
                    )
                  : list
                if (filtered.length === 0) {
                  return (
                    <div className="p-6 text-sm text-muted-foreground">
                      Nenhum arquivo encontrado.
                    </div>
                  )
                }
                return (
                  <ul className="divide-y">
                    {filtered.map((fname) => (
                      <li
                        key={fname}
                        className="flex items-center justify-between gap-3 p-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="truncate">
                            {friendlyFileName(fname)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={
                                filesDialog
                                  ? getFileUrl(filesDialog.rec.id, fname)
                                  : "#"
                              }
                              target="_blank"
                              rel="noreferrer"
                              title="Abrir em nova aba"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                          <Button variant="outline" size="sm" asChild>
                            <a
                              href={
                                filesDialog
                                  ? getFileUrl(filesDialog.rec.id, fname)
                                  : "#"
                              }
                              download={friendlyFileName(fname)}
                              target="_blank"
                              rel="noreferrer"
                              title="Baixar arquivo"
                            >
                              Download
                            </a>
                          </Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )
              })()}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog: adicionar novos PDFs */}
      <Dialog
        open={!!addDialog}
        onOpenChange={(open) => !open && !adding && setAddDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Adicionar arquivos ao protocolo #{addDialog?.id_numero}
            </DialogTitle>
          </DialogHeader>

          {/* UPLOAD AREA */}
          <div
            {...getRootProps()}
            className={
              "mt-2 rounded-lg border-2 border-dashed p-6 text-center transition select-none " +
              (atCap
                ? "border-red-300 bg-red-50/60 cursor-not-allowed opacity-75"
                : isDragActive
                ? "border-emerald-500 bg-emerald-50/50 cursor-copy"
                : "border-muted-foreground/30 hover:bg-muted/30 cursor-pointer")
            }
          >
            <input {...getInputProps()} />
            <UploadIcon className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            {atCap ? (
              <>
                <p className="text-sm font-medium text-red-700">
                  Limite de arquivos atingido
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Você atingiu o limite de 20 arquivos para este protocolo. Não
                  é possível selecionar mais arquivos.
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">
                  Arraste e solte PDFs aqui, ou clique para selecionar
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">
                  Aceita apenas PDF • Seleção múltipla • Tamanho conforme limite
                  do servidor
                </p>
              </>
            )}
          </div>

          {/* ADDITIONAL FILES LIST */}
          {addFiles.length > 0 && (
            <div className="mt-3 max-h-48 overflow-auto rounded-md border">
              <ul className="divide-y">
                {addFiles.map((f) => (
                  <li
                    key={f.name}
                    className="flex items-center justify-between gap-3 p-2 text-sm"
                  >
                    <div className="min-w-0 truncate">{f.name}</div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeAddFile(f.name)}
                      className="group gap-1.5 bg-white border-red-500 text-red-600 hover:bg-red-50 hover:border-red-600 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-500/70 ring-offset-1 ring-offset-background hover:shadow-sm transition-transform duration-150 ease-out hover:-translate-y-[1px]"
                      aria-label={`Remover ${f.name} da seleção`}
                    >
                      <Trash2 className="h-4 w-4 transition-transform duration-150 ease-out group-hover:-rotate-6" />
                      Remover
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-4 flex items-center justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => !adding && setAddDialog(null)}
              disabled={adding}
            >
              Cancelar
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={adding || addFiles.length === 0 || overCap}
                  className="group bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 hover:shadow-md transition-transform duration-150 ease-out hover:-translate-y-[1px] focus-visible:ring-2 focus-visible:ring-emerald-500/70 ring-offset-1 ring-offset-background"
                  aria-label={`Anexar ${addFiles.length} arquivo${
                    addFiles.length > 1 ? "s" : ""
                  }`}
                  title={overCap ? "Limite de 20 arquivos atingido" : undefined}
                >
                  {adding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                      Anexando...
                    </>
                  ) : (
                    <>
                      <UploadIcon className="h-4 w-4 transition-transform duration-150 ease-out group-hover:-rotate-6" />
                      Anexar {addFiles.length} arquivo
                      {addFiles.length > 1 ? "s" : ""}
                    </>
                  )}
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirmar anexos?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Serão enviados {addFiles.length} arquivo
                    {addFiles.length !== 1 ? "s" : ""} para o protocolo #
                    {addDialog?.id_numero}.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={submitAddFiles}
                  >
                    Confirmar envio
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
