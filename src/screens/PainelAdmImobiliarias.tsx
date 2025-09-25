import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Building2,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useNavigate } from "react-router-dom"
// import pb from "@/utils/backend/pb"
import { ProfileEditDialog } from "@/components/profile-edit-dialog"
// Importar o tipo Imobiliaria
import { Imobiliaria } from "@/types/Imobiliarias"

// Importar as funções do service
import {
  fetchImobiliariaList,
  updateImobiliaria,
  subscribeToImobiliariaUpdates,
} from "@/utils/api/ImobiliariasService"

// Importar tipos do PocketBase para RecordSubscription
import { RecordSubscription } from "pocketbase"
import { formatTelefone } from "../utils/regex/regexTelefone"
import { Users, Inbox, XCircle } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function PainelAdmImobiliarias() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const navigate = useNavigate()

  // Usuário autenticado (caso precise no futuro)
  // const currentUser = pb.authStore.model

  // Verificar se o usuário está autorizado (não utilizado diretamente nesta tela)
  // const isAuthorized = authorizedUsers.some(
  //   (user) => user.id === currentUserId && user.email === currentUserEmail
  // )

  // Estados principais da lista
  const [imobiliarias, setImobiliarias] = useState<Imobiliaria[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Busca e ordenação
  const [searchInput, setSearchInput] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState<"nome" | "created">("nome")

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)

  // Seleção e edição
  const [selectedImobiliaria, setSelectedImobiliaria] =
    useState<Imobiliaria | null>(null)
  const [editedValues, setEditedValues] = useState({
    porto_boleto_fianca_essencial: 0,
    porto_boleto_fianca_tradicional: 0,
    porto_boleto_incendio_residencial: 0,
    porto_boleto_incendio_comercial: 0,
    potencial_boleto_fianca: 0,
    potencial_relatorio_fianca: 0,
    tokio_boleto_fianca: 0,
    tokio_relatorio_fianca: 0,
    too_boleto_fianca: 0,
    too_relatorio_fianca: 0,
  })

  // Confirmação de salvamento
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [savedImobiliaria, setSavedImobiliaria] = useState<string | null>(null)

  // Debounce da busca
  useEffect(() => {
    const id = setTimeout(() => {
      setSearchTerm(searchInput.trim())
      setCurrentPage(1)
    }, 300)
    return () => clearTimeout(id)
  }, [searchInput])

  // Carregar lista
  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError(null)
      try {
        const resp = await fetchImobiliariaList(
          currentPage,
          itemsPerPage,
          searchTerm,
          {}
        )
        setImobiliarias(resp.items)
        setTotalItems(resp.totalItems)
        setTotalPages(resp.totalPages)
      } catch (e) {
        console.error(e)
        setError("Erro ao carregar as imobiliárias.")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [currentPage, itemsPerPage, searchTerm, sortBy])

  // Subscription em tempo real
  useEffect(() => {
    let unsub: undefined | (() => void)
    ;(async () => {
      try {
        unsub = await subscribeToImobiliariaUpdates(handleRecordChange)
      } catch (e) {
        console.error("Erro ao assinar atualizações de Imobiliárias:", e)
      }
    })()
    return () => {
      if (unsub) unsub()
    }
  }, [])

  const handleRecordChange = (data: RecordSubscription<Imobiliaria>) => {
    if (data.action === "create") {
      setImobiliarias((prev) => [data.record, ...prev])
      setTotalItems((prev) => prev + 1)
    } else if (data.action === "update") {
      setImobiliarias((prev) =>
        prev.map((imo) => (imo.id === data.record.id ? data.record : imo))
      )
    } else if (data.action === "delete") {
      setImobiliarias((prev) => prev.filter((imo) => imo.id !== data.record.id))
      setTotalItems((prev) => Math.max(prev - 1, 0))
    }
  }

  // Handlers da UI
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value)
  }
  const clearSearch = () => {
    setSearchInput("")
    setSearchTerm("")
    setCurrentPage(1)
  }
  const handleSortChange = (val: "nome" | "created") => setSortBy(val)

  const handleEdit = (imobiliaria: Imobiliaria) => {
    setSelectedImobiliaria(imobiliaria)
    setEditedValues({
      porto_boleto_fianca_essencial:
        imobiliaria.porto_boleto_fianca_essencial || 0,
      porto_boleto_fianca_tradicional:
        imobiliaria.porto_boleto_fianca_tradicional || 0,
      porto_boleto_incendio_residencial:
        imobiliaria.porto_boleto_incendio_residencial || 0,
      porto_boleto_incendio_comercial:
        imobiliaria.porto_boleto_incendio_comercial || 0,
      potencial_boleto_fianca: imobiliaria.potencial_boleto_fianca || 0,
      potencial_relatorio_fianca: imobiliaria.potencial_relatorio_fianca || 0,
      tokio_boleto_fianca: imobiliaria.tokio_boleto_fianca || 0,
      tokio_relatorio_fianca: imobiliaria.tokio_relatorio_fianca || 0,
      too_boleto_fianca: imobiliaria.too_boleto_fianca || 0,
      too_relatorio_fianca: imobiliaria.too_relatorio_fianca || 0,
    })
  }

  const handleSave = async () => {
    if (!selectedImobiliaria) return
    try {
      const updated = await updateImobiliaria(
        selectedImobiliaria.id,
        editedValues
      )
      setSavedImobiliaria(updated.nome)
      setShowConfirmation(true)
      setImobiliarias((prev) =>
        prev.map((imo) => (imo.id === updated.id ? updated : imo))
      )
      setSelectedImobiliaria(updated)
    } catch (e) {
      console.error(e)
      setError("Erro ao salvar alterações da imobiliária.")
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
    setSavedImobiliaria(null)
  }
  //   {
  //     field: "porto_boleto_fianca_essencial",
  //     label: "Porto: Fiança Essencial",
  //   },
  //   {
  //     field: "porto_boleto_fianca_tradicional",
  //     label: "Porto: Fiança Tradicional",
  //   },
  //   {
  //     field: "porto_boleto_incendio_residencial",
  //     label: "Porto: Incêndio Residencial",
  //   },
  //   {
  //     field: "porto_boleto_incendio_comercial",
  //     label: "Porto: Incêndio Comercial",
  //   },
  //   { field: "potencial_boleto_fianca", label: "Potencial: Fiança" },
  //   { field: "tokio_boleto_fianca", label: "Tokio: Fiança" },
  //   { field: "tokio_relatorio_fianca", label: "Tokio: Relatório de Fiança" },
  //   { field: "too_boleto_fianca", label: "Too: Fiança" },
  //   { field: "too_relatorio_fianca", label: "Too: Relatório de Fiança" },
  // ]

  const groupedBoletoFields = [
    {
      title: "Porto Seguro",
      fields: [
        { field: "porto_boleto_fianca_essencial", label: "Fiança Essencial" },
        {
          field: "porto_boleto_fianca_tradicional",
          label: "Fiança Tradicional",
        },
        {
          field: "porto_boleto_incendio_residencial",
          label: "Incêndio Residencial",
        },
        {
          field: "porto_boleto_incendio_comercial",
          label: "Incêndio Comercial",
        },
      ],
    },
    {
      title: "Potencial",
      fields: [
        { field: "potencial_boleto_fianca", label: "Fiança" },
        { field: "potencial_relatorio_fianca", label: "Relatório de Fiança" },
      ],
    },
    {
      title: "Tokio Marine",
      fields: [
        { field: "tokio_boleto_fianca", label: "Fiança" },
        { field: "tokio_relatorio_fianca", label: "Relatório de Fiança" },
      ],
    },
    {
      title: "Too Seguros",
      fields: [
        { field: "too_boleto_fianca", label: "Fiança" },
        { field: "too_relatorio_fianca", label: "Relatório de Fiança" },
      ],
    },
  ]

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-2">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <Users className="h-7 w-7 text-green-700" /> Lista de Imobiliárias
        </h1>
        <Button
          onClick={() => {
            navigate("/imobiliaria/cadastrar")
          }}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Cadastrar Nova Imobiliária
        </Button>
      </div>

      <Card className="border shadow-sm h-[80vh] flex flex-col">
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="relative w-full md:max-w-md">
              <Input
                type="text"
                placeholder="Pesquisar imobiliária..."
                value={searchInput}
                onChange={handleSearchChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
              {searchInput && (
                <button
                  aria-label="Limpar busca"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={clearSearch}
                >
                  <XCircle className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="nome">Nome</SelectItem>
                  <SelectItem value="created">Data de Cadastro</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={String(itemsPerPage)}
                onValueChange={(val) => {
                  const n = Number(val)
                  if (!Number.isNaN(n)) {
                    setItemsPerPage(n)
                    setCurrentPage(1)
                  }
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Itens por página" />
                </SelectTrigger>
                <SelectContent>
                  {[8, 12, 16, 24].map((n) => (
                    <SelectItem key={n} value={String(n)}>
                      {n} por página
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col min-h-0">
          {/* Status bar */}
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
            <span>Total de imobiliárias: {totalItems}</span>
            <span>
              Mostrando {imobiliarias.length} de {totalItems}
            </span>
          </div>
          {/* Feedback de Carregamento e Erro */}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}

          {/* Lista de Imobiliárias com scroll interno */}
          <ScrollArea className="flex-1 min-h-0 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {loading ? (
                Array.from({ length: itemsPerPage }).map((_, i) => (
                  <Card key={`skeleton-${i}`} className="p-4 animate-pulse">
                    <div className="flex items-center justify-between mb-4">
                      <div className="h-6 w-40 bg-gray-200 dark:bg-gray-700 rounded" />
                      <div className="h-6 w-6 bg-gray-200 dark:bg-gray-700 rounded-full" />
                    </div>
                    <div className="h-4 w-52 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
                    <div className="h-4 w-44 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
                    <div className="h-9 w-full bg-gray-200 dark:bg-gray-700 rounded" />
                  </Card>
                ))
              ) : imobiliarias.length === 0 ? (
                <div className="col-span-full flex flex-col items-center justify-center py-10 text-muted-foreground">
                  <Inbox className="h-10 w-10 mb-2" />
                  <p>Nenhuma imobiliária encontrada.</p>
                </div>
              ) : (
                imobiliarias.map((imobiliaria) => (
                  <Card
                    key={imobiliaria.id}
                    className="bg-white/95 border shadow-sm hover:shadow-md transition-shadow duration-200"
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg font-semibold truncate">
                          {imobiliaria.nome}
                        </CardTitle>
                        <div className="h-9 w-9 rounded-full bg-green-50 flex items-center justify-center border border-green-100">
                          <Building2 className="h-5 w-5 text-green-700" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 truncate">
                        {imobiliaria.email}
                      </p>
                      <p className="text-xs text-gray-500 mb-4">
                        Cadastro:{" "}
                        {imobiliaria.created
                          ? `${new Date(
                              imobiliaria.created
                            ).toLocaleDateString()} - ${new Date(
                              imobiliaria.created
                            ).toLocaleTimeString()}`
                          : "N/A"}
                      </p>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            onClick={() => handleEdit(imobiliaria)}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            <Edit3 className="mr-2 h-4 w-4" /> Ver Detalhes e
                            Editar
                          </Button>
                        </DialogTrigger>

                        {/* MODAL DA IMOBILIÁRIA */}
                        <DialogContent className="sm:max-w-[61rem] max-h-[85vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-[2rem]">
                              {imobiliaria.nome}
                            </DialogTitle>
                            <DialogClose className="absolute top-3 right-3">
                              <Button
                                variant="ghost"
                                className="text-gray-700 hover:text-black"
                              >
                                X
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          <div>
                            <p>
                              <strong>Email:</strong> {imobiliaria.email}
                            </p>
                            <p>
                              <strong>Nome de usuário:</strong>{" "}
                              {imobiliaria.username}
                            </p>
                            <p>
                              <strong>Data do Cadastro:</strong>{" "}
                              {imobiliaria.created
                                ? new Date(
                                    imobiliaria.created
                                  ).toLocaleDateString()
                                : "N/A"}
                            </p>
                            <p>
                              <strong>Contato:</strong>{" "}
                              {formatTelefone(imobiliaria.contato)}
                            </p>

                            <div className="my-4 flex flex-col items-start">
                              <Button
                                onClick={() => setIsEditingProfile(true)}
                                variant="outline"
                                className="text-[1.02rem] text-white bg-green-800 hover:bg-green-600 hover:text-white"
                              >
                                <Pencil className="mr-2 h-5 w-5" /> EDITAR
                                INFORMAÇÕES DE{" "}
                                {imobiliaria.nome.toLocaleUpperCase()}
                              </Button>
                              <ProfileEditDialog
                                open={isEditingProfile}
                                onOpenChange={setIsEditingProfile}
                                imobiliariaId={imobiliaria.id} // Exemplo
                              />
                            </div>
                          </div>

                          <p className="text-lg mb-4">
                            Atualize aqui a quantidade de boletos/relações de
                            cada seguradora que serão enviados para{" "}
                            {selectedImobiliaria?.nome}:
                          </p>

                          {/* Renderização dinâmica dos novos campos */}
                          <div className="grid gap-6">
                            {groupedBoletoFields.map(({ title, fields }) => {
                              let bgColorStyle = {}
                              switch (title) {
                                case "Porto Seguro":
                                  bgColorStyle = { backgroundColor: "#f7fcff" }
                                  break
                                case "Potencial":
                                  bgColorStyle = { backgroundColor: "#fffdf7" }
                                  break
                                case "Tokio Marine":
                                  bgColorStyle = { backgroundColor: "#fcfcf7" }
                                  break
                                case "Too Seguros":
                                  bgColorStyle = { backgroundColor: "#f7fdfd" }
                                  break
                                default:
                                  bgColorStyle = { backgroundColor: "#fdfdfd" }
                              }

                              return (
                                <div
                                  key={title}
                                  className="border rounded-lg p-4 shadow-sm"
                                  style={bgColorStyle}
                                >
                                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                    {title === "Potencial"
                                      ? "Pottencial"
                                      : title}
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {fields.map(({ field, label }) => (
                                      <div
                                        key={field}
                                        className="flex flex-col gap-2"
                                      >
                                        <label
                                          htmlFor={field}
                                          className="text-gray-700 font-medium"
                                        >
                                          {label}
                                        </label>
                                        <Input
                                          id={field}
                                          type="number"
                                          value={
                                            editedValues[
                                              field as keyof typeof editedValues
                                            ]
                                          }
                                          onChange={(e) =>
                                            setEditedValues({
                                              ...editedValues,
                                              [field]: Number(e.target.value),
                                            })
                                          }
                                          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )
                            })}
                          </div>

                          <Button
                            onClick={handleSave}
                            className="w-full bg-green-600 hover:bg-green-700 text-white"
                          >
                            Salvar Alterações
                          </Button>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </ScrollArea>

          {/* Paginação */}
          <div className="mt-4 flex justify-between items-center shrink-0">
            <Button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              Próxima <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Diálogo de Confirmação */}
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmação</AlertDialogTitle>
          <AlertDialogDescription>
            Propriedades do envio de boletos alteradas com sucesso para a
            IMOBILIÁRIA {savedImobiliaria}.
          </AlertDialogDescription>
          <AlertDialogCancel onClick={handleConfirmationClose}>
            Fechar
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
