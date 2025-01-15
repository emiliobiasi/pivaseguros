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
import pb from "@/utils/backend/pb";
import { useNavigate } from "react-router-dom";

// Tipo para representar uma imobiliária
type Imobiliaria = {
  id: number;
  nome: string;
  email: string;
  dataCadastro: string;
  porto: number;
  tokio: number;
  too: number;
  potencial: number;
};

// Dados mockados de imobiliárias (aumentado para simular um grande número)
const imobiliarias: Imobiliaria[] = Array(100)
  .fill(null)
  .map((_, index) => ({
    id: index + 1,
    nome: `Imobiliária ${String.fromCharCode(65 + (index % 26))}${
      Math.floor(index / 26) + 1
    }`,
    email: `imo${String.fromCharCode(65 + (index % 26))}${
      Math.floor(index / 26) + 1
    }@example.com`,
    dataCadastro: new Date(2023, 0, 1 + index).toISOString().split("T")[0],
    porto: Math.floor(Math.random() * 500),
    tokio: Math.floor(Math.random() * 500),
    too: Math.floor(Math.random() * 500),
    potencial: Math.floor(Math.random() * 500),
  }));

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
  const [selectedImobiliaria, setSelectedImobiliaria] =
    useState<Imobiliaria | null>(null);
  const [editedValues, setEditedValues] = useState({
    porto: 0,
    tokio: 0,
    too: 0,
    potencial: 0,
  });
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [savedImobiliaria, setSavedImobiliaria] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredImobiliarias, setFilteredImobiliarias] =
    useState(imobiliarias);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);
  const [sortBy, setSortBy] = useState<"nome" | "dataCadastro">("nome");

  useEffect(() => {
    let filtered = imobiliarias.filter((imobiliaria) =>
      imobiliaria.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
    filtered.sort((a, b) => {
      if (sortBy === "nome") {
        return a.nome.localeCompare(b.nome);
      } else {
        return (
          new Date(b.dataCadastro).getTime() -
          new Date(a.dataCadastro).getTime()
        );
      }
    });
    setFilteredImobiliarias(filtered);
    setCurrentPage(1);
  }, [searchTerm, sortBy]);

  const handleEdit = (imobiliaria: Imobiliaria) => {
    setSelectedImobiliaria(imobiliaria);
    setEditedValues({
      porto: imobiliaria.porto,
      tokio: imobiliaria.tokio,
      too: imobiliaria.too,
      potencial: imobiliaria.potencial,
    });
  };

  const handleSave = () => {
    if (selectedImobiliaria) {
      // Aqui você implementaria a lógica para salvar os dados no backend
      console.log(
        "Salvando dados para",
        selectedImobiliaria.nome,
        editedValues
      );
      setSavedImobiliaria(selectedImobiliaria.nome);
      setShowConfirmation(true);
      setSelectedImobiliaria(null);
    }
  };

  const handleConfirmationClose = () => {
    setShowConfirmation(false);
    window.location.reload();
  };

  const pageCount = Math.ceil(filteredImobiliarias.length / itemsPerPage);
  const currentImobiliarias = filteredImobiliarias.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Lista de Imobiliárias
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="relative flex-grow">
          <Input
            type="text"
            placeholder="Pesquisar imobiliária..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        <Select
          value={sortBy}
          onValueChange={(value) => setSortBy(value as "nome" | "dataCadastro")}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Ordenar por" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="nome">Nome</SelectItem>
            <SelectItem value="dataCadastro">Data de Cadastro</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {currentImobiliarias.map((imobiliaria) => (
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
                Cadastro: {imobiliaria.dataCadastro}
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
                      {imobiliaria.dataCadastro}
                    </p>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Atualize aqui o número de arquivos (referente a cada
                    seguradora) que serão enviados para a{" "}
                    {selectedImobiliaria?.nome}
                  </p>
                  <div className="grid gap-4 py-4">
                    {["porto", "tokio", "too", "potencial"].map((field) => (
                      <div
                        key={field}
                        className="grid grid-cols-4 items-center gap-4"
                      >
                        <label
                          htmlFor={field}
                          className="text-right capitalize"
                        >
                          {field}
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
      <div className="mt-8 flex justify-between items-center">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Anterior
        </Button>
        <span>
          Página {currentPage} de {pageCount}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, pageCount))
          }
          disabled={currentPage === pageCount}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          Próxima <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <AlertDialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <AlertDialogContent>
          <AlertDialogTitle>Confirmação</AlertDialogTitle>
          <AlertDialogDescription>
            Propriedades do envio de boletos alteradas com sucesso para a IMOBILIÁRIA {savedImobiliaria}.
          </AlertDialogDescription>
          <AlertDialogCancel onClick={handleConfirmationClose}>
            Fechar
          </AlertDialogCancel>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
