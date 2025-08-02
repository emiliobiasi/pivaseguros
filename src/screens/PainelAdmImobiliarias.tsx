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
import pb from "@/utils/backend/pb"
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
import { formatTelefone } from '../utils/regex/regexTelefone';

export default function PainelAdmImobiliarias() {
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const navigate = useNavigate()

  // Definição dos usuários autorizados
  const authorizedUsers = [
    { id: "g6f27sjx3kjqktf", email: "comercial@pivaseguros.com.br" },
    { id: "bdq7guk6qiwyggd", email: "teste@email.com" },
  ]

  // Obter o usuário atual do authStore
  const currentUser = pb.authStore.model
  const currentUserId = currentUser?.id
  const currentUserEmail = currentUser?.email

  // Verificar se o usuário está autorizado
  const isAuthorized = authorizedUsers.some(
    (user) => user.id === currentUserId && user.email === currentUserEmail
  )

  // useEffect para verificar autorização ao montar o componente
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/inicio")
    }
  }, [isAuthorized, navigate])

  // Estados para gerenciamento de imobiliárias
  const [imobiliarias, setImobiliarias] = useState<Imobiliaria[]>([])
  const [, setTotalItems] = useState(0)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [selectedImobiliaria, setSelectedImobiliaria] =
    useState<Imobiliaria | null>(null)

  // Substitua os campos antigos pelos novos campos aqui:
  const [editedValues, setEditedValues] = useState({
    porto_boleto_fianca_essencial: 0,
    porto_boleto_fianca_tradicional: 0,
    porto_boleto_incendio_residencial: 0,
    porto_boleto_incendio_comercial: 0,
    potencial_boleto_fianca: 0,
    tokio_boleto_fianca: 0,
    tokio_relatorio_fianca: 0,
    too_boleto_fianca: 0,
    too_relatorio_fianca: 0,
  })

  const [showConfirmation, setShowConfirmation] = useState(false)
  const [savedImobiliaria, setSavedImobiliaria] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(12)
  const [sortBy, setSortBy] = useState<"nome" | "created">("nome")

  // useEffect para buscar imobiliárias do backend
  useEffect(() => {
    const loadImobiliarias = async () => {
      setLoading(true)
      setError(null)
      try {
        const response = await fetchImobiliariaList(
          currentPage,
          itemsPerPage,
          searchTerm,
          {} // Adicione filtros conforme necessário
        )
        setImobiliarias(response.items)
        setTotalItems(response.totalItems)
        setTotalPages(response.totalPages)
      } catch (err) {
        setError("Erro ao carregar as imobiliárias.")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    loadImobiliarias()
  }, [currentPage, itemsPerPage, searchTerm, sortBy])

  // useEffect para gerenciar assinaturas em tempo real
  useEffect(() => {
    let unsubscribe: () => void

    const setupSubscription = async () => {
      try {
        unsubscribe = await subscribeToImobiliariaUpdates(handleRecordChange)
      } catch (error) {
        console.error("Erro ao assinar atualizações de Imobiliárias:", error)
      }
    }

    setupSubscription()
    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const handleRecordChange = (data: RecordSubscription<Imobiliaria>) => {
    // console.log("Mudança detectada:", data)
    if (data.action === "create") {
      setImobiliarias((prev) => [data.record, ...prev])
      setTotalItems((prev) => prev + 1)
    } else if (data.action === "update") {
      setImobiliarias((prev) =>
        prev.map((imo) => (imo.id === data.record.id ? data.record : imo))
      )
    } else if (data.action === "delete") {
      setImobiliarias((prev) => prev.filter((imo) => imo.id !== data.record.id))
      setTotalItems((prev) => prev - 1)
    }
  }

  const handleEdit = (imobiliaria: Imobiliaria) => {
    setSelectedImobiliaria(imobiliaria)

    // Ao editar, copiamos os valores para o estado editedValues:
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
      tokio_boleto_fianca: imobiliaria.tokio_boleto_fianca || 0,
      tokio_relatorio_fianca: imobiliaria.tokio_relatorio_fianca || 0,
      too_boleto_fianca: imobiliaria.too_boleto_fianca || 0,
      too_relatorio_fianca: imobiliaria.too_relatorio_fianca || 0,
    })
  }

  const handleSave = async () => {
    if (selectedImobiliaria) {
      try {
        // Basta enviar o objeto editedValues diretamente
        const updatedImobiliaria = await updateImobiliaria(
          selectedImobiliaria.id,
          editedValues
        )
        // console.log("Imobiliária atualizada com sucesso:", updatedImobiliaria)

        setSavedImobiliaria(updatedImobiliaria.nome)
        setShowConfirmation(true)
        setSelectedImobiliaria(null)

        // Atualizar a lista localmente sem recarregar a página
        setImobiliarias((prev) =>
          prev.map((imo) =>
            imo.id === updatedImobiliaria.id ? updatedImobiliaria : imo
          )
        )
      } catch (err) {
        console.error("Erro ao atualizar a imobiliária:", err)
        setError("Erro ao atualizar a imobiliária.")
      }
    }
  }

  const handleConfirmationClose = () => {
    setShowConfirmation(false)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1) // Reinicia a página ao pesquisar
  }

  const handleSortChange = (value: "nome" | "created") => {
    setSortBy(value)
    setCurrentPage(1) // Reinicia a página ao ordenar
  }

  // Array de campos que vamos renderizar dinamicamente
  // const boletoFields = [
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
      fields: [{ field: "potencial_boleto_fianca", label: "Fiança" }],
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
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Lista de Imobiliárias
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

      {/* Barra de Pesquisa e Ordenação */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Pesquisar imobiliária..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="created">Data de Cadastro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Feedback de Carregamento e Erro */}
      {loading && <p className="text-center">Carregando imobiliárias...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Lista de Imobiliárias */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {!loading && imobiliarias.length === 0 && (
          <p className="text-center col-span-full">
            Nenhuma imobiliária encontrada.
          </p>
        )}
        {imobiliarias.map((imobiliaria) => (
          <Card
            key={imobiliaria.id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-bold truncate">
                {imobiliaria.nome}
              </CardTitle>
              <Building2 className="h-6 w-6 text-green-600" />
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 truncate">
                {imobiliaria.email}
              </p>
              <p className="text-sm text-gray-600 mb-4">
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
                    <Edit3 className="mr-2 h-4 w-4" /> Ver Detalhes e Editar
                  </Button>
                </DialogTrigger>

                {/* MODAL DA IMOBILIÁRIA */}
                <DialogContent className="sm:max-w-[61rem] max-h-[85vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle className="text-[2rem]">{imobiliaria.nome}</DialogTitle>
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
                      <strong>Nome de usuário:</strong> {imobiliaria.username}
                    </p>
                    <p>
                      <strong>Data do Cadastro:</strong>{" "}
                      {imobiliaria.created
                        ? new Date(imobiliaria.created).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Contato:</strong> {formatTelefone(imobiliaria.contato)}
                    </p>

                    <div className="my-4 flex flex-col items-start">
                      <Button
                        onClick={() => setIsEditingProfile(true)}
                        variant="outline"
                        className="text-[1.02rem] text-white bg-green-800 hover:bg-green-600 hover:text-white"
                      >
                        <Pencil className="mr-2 h-5 w-5" /> EDITAR INFORMAÇÕES
                        DE {imobiliaria.nome.toLocaleUpperCase()}
                      </Button>
                      <ProfileEditDialog
                        open={isEditingProfile}
                        onOpenChange={setIsEditingProfile}
                        imobiliariaId={imobiliaria.id} // Exemplo
                      />
                    </div>
                  </div>

                  <p className="text-lg mb-4">
                    Atualize aqui a quantidade de boletos/relações de cada
                    seguradora que serão enviados para{" "}
                    {selectedImobiliaria?.nome}:
                  </p>

                  {/* Renderização dinâmica dos novos campos */}
                  <div className="grid gap-6">
                    {groupedBoletoFields.map(({ title, fields }) => {
                      let bgColorStyle = {}
                      switch (title) {
                        case "Porto Seguro":
                          bgColorStyle = { backgroundColor: "#f7fcff" } // Azul ultra claro
                          break
                        case "Potencial":
                          bgColorStyle = { backgroundColor: "#fffdf7" } // Laranja ultra claro
                          break
                        case "Tokio Marine":
                          bgColorStyle = { backgroundColor: "#fcfcf7" } // Verde musgo ultra claro
                          break
                        case "Too Seguros":
                          bgColorStyle = { backgroundColor: "#f7fdfd" } // Verde água ultra claro
                          break
                        default:
                          bgColorStyle = { backgroundColor: "#fdfdfd" } // Cor padrão
                      }

                      return (
                        <div
                          key={title}
                          className="border rounded-lg p-4 shadow-md"
                          style={bgColorStyle}
                        >
                          <h3 className="text-lg font-semibold text-gray-800 mb-2">
                            {title}
                          </h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map(({ field, label }) => (
                              <div key={field} className="flex flex-col gap-2">
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
        ))}
      </div>

      {/* Paginação */}
      <div className="mt-8 flex justify-between items-center">
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
