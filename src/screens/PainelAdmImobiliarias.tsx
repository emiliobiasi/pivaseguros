import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Building2,
  Edit3,
  Search,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import pb from "@/utils/backend/pb";

// Importar o tipo Imobiliaria
import { Imobiliaria } from "@/types/Imobiliarias";

// Importar as funções do service
import {
  fetchImobiliariaList,
  updateImobiliaria,
  subscribeToImobiliariaUpdates,
} from "@/utils/api/ImobiliariasService";

// Importar tipos do PocketBase para RecordSubscription
import { RecordSubscription } from "pocketbase";

export default function PainelAdmImobiliarias() {
  const navigate = useNavigate();

  // Definição dos usuários autorizados
  const authorizedUsers = [
    { id: "g6f27sjx3kjqktf", email: "comercial@pivaseguros.com.br" },
    { id: "bdq7guk6qiwyggd", email: "teste@email.com" },
  ];

  // Obter o usuário atual do authStore
  const currentUser = pb.authStore.model;
  const currentUserId = currentUser?.id;
  const currentUserEmail = currentUser?.email;

  // Verificar se o usuário está autorizado
  const isAuthorized = authorizedUsers.some(
    (user) => user.id === currentUserId && user.email === currentUserEmail
  );

  // useEffect para verificar autorização ao montar o componente
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/inicio");
    }
  }, [isAuthorized, navigate]);

  // Estados para gerenciamento de imobiliárias
  const [imobiliarias, setImobiliarias] = useState<Imobiliaria[]>([]);
  const [, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [selectedImobiliaria, setSelectedImobiliaria] =
    useState<Imobiliaria | null>(null);
  const [editedValues, setEditedValues] = useState({
    qtd_boleto_porto: 0,
    qtd_boleto_tokio: 0,
    qtd_boleto_too: 0,
    qtd_boleto_potencial: 0,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedImobiliaria, setSavedImobiliaria] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<"nome" | "created">("nome");

  // useEffect para buscar imobiliárias do backend
  useEffect(() => {
    const loadImobiliarias = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetchImobiliariaList(
          currentPage,
          itemsPerPage,
          searchTerm,
          {} // Adicione filtros conforme necessário
        );
        setImobiliarias(response.items);
        setTotalItems(response.totalItems);
        setTotalPages(response.totalPages);
      } catch (err) {
        setError("Erro ao carregar as imobiliárias.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadImobiliarias();
  }, [currentPage, itemsPerPage, searchTerm, sortBy]);

  // useEffect para gerenciar assinaturas em tempo real
  useEffect(() => {
    let unsubscribe: () => void;

    const setupSubscription = async () => {
      try {
        unsubscribe = await subscribeToImobiliariaUpdates(handleRecordChange);
      } catch (error) {
        console.error("Erro ao assinar atualizações de Imobiliárias:", error);
      }
    };

    setupSubscription();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const handleRecordChange = (data: RecordSubscription<Imobiliaria>) => {
    console.log("Mudança detectada:", data);
    if (data.action === "create") {
      setImobiliarias((prev) => [data.record, ...prev]);
      setTotalItems((prev) => prev + 1);
    } else if (data.action === "update") {
      setImobiliarias((prev) =>
        prev.map((imo) => (imo.id === data.record.id ? data.record : imo))
      );
    } else if (data.action === "delete") {
      setImobiliarias((prev) =>
        prev.filter((imo) => imo.id !== data.record.id)
      );
      setTotalItems((prev) => prev - 1);
    }
  };

  const handleEdit = (imobiliaria: Imobiliaria) => {
    setSelectedImobiliaria(imobiliaria);
    setEditedValues({
      qtd_boleto_porto: imobiliaria.qtd_boleto_porto || 0,
      qtd_boleto_tokio: imobiliaria.qtd_boleto_tokio || 0,
      qtd_boleto_too: imobiliaria.qtd_boleto_too || 0,
      qtd_boleto_potencial: imobiliaria.qtd_boleto_potencial || 0,
    });
  };

  const handleSave = async () => {
    if (selectedImobiliaria) {
      try {
        const updatedData = {
          qtd_boleto_porto: editedValues.qtd_boleto_porto,
          qtd_boleto_tokio: editedValues.qtd_boleto_tokio,
          qtd_boleto_too: editedValues.qtd_boleto_too,
          qtd_boleto_potencial: editedValues.qtd_boleto_potencial,
        };
        const updatedImobiliaria = await updateImobiliaria(
          selectedImobiliaria.id,
          updatedData
        );
        console.log("Imobiliária atualizada com sucesso:", updatedImobiliaria);
        setSavedImobiliaria(updatedImobiliaria.nome);
        setShowConfirmation(true);
        setSelectedImobiliaria(null);
        // Atualizar a lista localmente sem recarregar a página
        setImobiliarias((prev) =>
          prev.map((imo) =>
            imo.id === updatedImobiliaria.id ? updatedImobiliaria : imo
          )
        );
      } catch (err) {
        console.error("Erro ao atualizar a imobiliária:", err);
        setError("Erro ao atualizar a imobiliária.");
      }
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    // Opcional: Remover a recarga da página
    // window.location.reload();
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reinicia a página ao pesquisar
  };

  const handleSortChange = (value: "nome" | "created") => {
    setSortBy(value);
    setCurrentPage(1); // Reinicia a página ao ordenar
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 mt-2">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          Lista de Imobiliárias
        </h1>
        <Button
          onClick={() => {
            navigate("/imobiliaria/cadastrar");
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
                  ? new Date(imobiliaria.created).toLocaleDateString()
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
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{imobiliaria.nome}</DialogTitle>
                  </DialogHeader>
                  <div>
                    <p>
                      <strong>Email:</strong> {imobiliaria.email}
                    </p>
                    <p>
                      <strong>Data de Cadastro:</strong>{" "}
                      {imobiliaria.created
                        ? new Date(imobiliaria.created).toLocaleDateString()
                        : "N/A"}
                    </p>
                    <p>
                      <strong>Contato:</strong> {imobiliaria.contato}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Atualize aqui o número de boletos (referente a cada
                    seguradora) que serão enviados para a{" "}
                    {selectedImobiliaria?.nome}
                  </p>
                  <div className="grid gap-4 py-4">
                    {[
                      { field: "qtd_boleto_porto", label: "Porto" },
                      { field: "qtd_boleto_tokio", label: "Tokio" },
                      { field: "qtd_boleto_too", label: "Too" },
                      { field: "qtd_boleto_potencial", label: "Potencial" },
                    ].map(({ field, label }) => (
                      <div
                        key={field}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <label
                          htmlFor={field}
                          className="text-right capitalize"
                        >
                          {label}
                        </label>
                        <Input
                          id={field}
                          type="number"
                          value={
                            editedValues[field as keyof typeof editedValues]
                          }
                          onChange={(e) =>
                            setEditedValues({
                              ...editedValues,
                              [field]: Number(e.target.value),
                            })
                          }
                          className="col-span-3"
                        />
                      </div>
                    ))}
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
  );
}
