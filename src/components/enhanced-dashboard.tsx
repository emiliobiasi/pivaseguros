import { useState, useEffect, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Flame,
  Building,
  Home,
  Search,
  Menu,
  X,
  CheckCircle,
  Clock,
  UserPlus,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const mockData = [
  {
    id: 1,
    acao: "pendente",
    nomeImobiliaria: "Imobiliária A",
    nomeProponente: "Maria Souza",
    horaRecebimento: "2023-05-10 09:30",
    emailImobiliaria: "contato@imobiliariaa.com",
    cpfLocatario: "123.456.789-00",
    dataNascimento: "1985-03-15",
    estadoCivil: "Casado(a)",
    sexo: "Feminino",
    cep: "12345-678",
    endereco: "Rua das Flores",
    bairro: "Centro",
    numero: "123",
    complemento: "Apto 45",
    cidade: "São Paulo",
    estado: "SP",
    tipoImovel: "Apartamento",
    incendio: "R$ 100.000,00",
    vendaval: "R$ 50.000,00",
    danosEletricos: "R$ 10.000,00",
    impactoVeiculos: "R$ 20.000,00",
    perdaAluguel: "R$ 5.000,00",
    responsabilidadeCivil: "R$ 30.000,00",
    planoEscolhido: "Premium",
    valorSeguro: "R$ 1.500,00",
    formaPagamento: "Cartão de Crédito",
    incluirClausulaBeneficiaria: "Sim",
    cpfLocador: "987.654.321-00",
    nomeLocador: "Carlos Oliveira",
  },
];

export function SideBarLayout() {
  const [data, setData] = useState(mockData);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleAcaoChange = (id: number, novaAcao: string) => {
    setData((prevData) => {
      const updatedData = prevData.map((item) =>
        item.id === id ? { ...item, acao: novaAcao } : item
      );
      return updatedData.sort((a, b) => {
        if (a.acao === "finalizado" && b.acao !== "finalizado") return 1;
        if (a.acao !== "finalizado" && b.acao === "finalizado") return -1;
        return 0;
      });
    });
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const addNewUser = () => {
    const newUser = {
      id: data.length + 1,
      acao: "pendente",
      nomeImobiliaria: `Imobiliária ${data.length + 1}`,
      nomeProponente: `Proponente ${data.length + 1}`,
      horaRecebimento: new Date().toLocaleString(),
      emailImobiliaria: `contato@imobiliaria${data.length + 1}.com`,
      cpfLocatario: "000.000.000-00",
      dataNascimento: "1990-01-01",
      estadoCivil: "Solteiro(a)",
      sexo: "Não informado",
      cep: "00000-000",
      endereco: "Endereço não informado",
      bairro: "Bairro não informado",
      numero: "S/N",
      complemento: "",
      cidade: "Cidade não informada",
      estado: "UF",
      tipoImovel: "Não informado",
      incendio: "R$ 0,00",
      vendaval: "R$ 0,00",
      danosEletricos: "R$ 0,00",
      impactoVeiculos: "R$ 0,00",
      perdaAluguel: "R$ 0,00",
      responsabilidadeCivil: "R$ 0,00",
      planoEscolhido: "Básico",
      valorSeguro: "R$ 0,00",
      formaPagamento: "Não informado",
      incluirClausulaBeneficiaria: "Não",
      cpfLocador: "000.000.000-00",
      nomeLocador: "Não informado",
    };
    setData((prevData) => [newUser, ...prevData]);
    setNotification(`Nova Proponente Adicionado`);
  };

  const openUserModal = (user) => {
    setSelectedUser(user);
    setModalOpen(true);
  };

  const closeUserModal = () => {
    setSelectedUser(null);
    setModalOpen(false);
  };

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const filteredData = useMemo(() => {
    return data.filter(
      (user) =>
        user.id.toString().includes(searchTerm) ||
        user.nomeImobiliaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.nomeProponente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.horaRecebimento.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [data, searchTerm]);

  return (
    <div className="flex h-screen bg-[#f1efef] dark:bg-gray-900">
      {/* Sidebar for larger screens */}
      <aside className="hidden md:flex flex-col w-56 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <span className="text-xl font-bold text-gray-800 dark:text-white">
            Piva Seguros
          </span>
        </div>
        <SidebarContent />
      </aside>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={toggleSidebar}
          ></div>
          <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xl font-bold text-gray-800 dark:text-white">
                Piva Seguros
              </span>
              <button
                onClick={toggleSidebar}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[#f1efef] dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="mr-4 text-gray-500 hover:text-gray-600 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
                >
                  <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Incêndio
                </h1>
              </div>
              <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4">
                <div className="relative flex-grow max-w-3xl">
                  <Input
                    type="search"
                    placeholder="Buscar por ID, imobiliária, proponente ou hora..."
                    className="pl-10 pr-4 w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <Button
                  onClick={addNewUser}
                  className="flex items-center justify-center w-full sm:w-auto whitespace-nowrap"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Usuário
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
            <div className="overflow-x-auto">
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
                      Nome do Proponente
                    </TableHead>
                    <TableHead className="px-3 py-2 lg:px-6 lg:py-3">
                      Hora de Recebimento
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((user) => (
                    <TableRow
                      key={user.id}
                      className={
                        user.acao === "finalizado"
                          ? "bg-gray-100 dark:bg-gray-700"
                          : ""
                      }
                    >
                      <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                        {user.id}
                      </TableCell>
                      <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                        <Select
                          value={user.acao}
                          onValueChange={(value) =>
                            handleAcaoChange(user.id, value)
                          }
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pendente">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-2 text-yellow-500" />
                                <span>Pendente</span>
                              </div>
                            </SelectItem>
                            <SelectItem value="finalizado">
                              <div className="flex items-center">
                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                <span>Finalizado</span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                        <button
                          onClick={() => openUserModal(user)}
                          className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                        >
                          {user.nomeImobiliaria}
                        </button>
                      </TableCell>
                      <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                        {user.nomeProponente}
                      </TableCell>
                      <TableCell className="px-3 py-2 lg:px-6 lg:py-3">
                        {user.horaRecebimento}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </main>

      {/* User Modal */}
      <AnimatePresence>
        {modalOpen && selectedUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeUserModal}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Detalhes de {selectedUser.nomeProponente}
                </h2>
                <button
                  onClick={closeUserModal}
                  className="text-[#027B49] hover:text-[#025d37]"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">
                    Informações da Imobiliária
                  </h3>
                  <p>
                    <strong>Nome da Imobiliária:</strong>{" "}
                    {selectedUser.nomeImobiliaria}
                  </p>
                  <p>
                    <strong>E-mail da Imobiliária:</strong>{" "}
                    {selectedUser.emailImobiliaria}
                  </p>

                  <h3 className="text-lg font-semibold mt-6">
                    Informações do Proponente
                  </h3>
                  <p>
                    <strong>Nome do Proponente:</strong>{" "}
                    {selectedUser.nomeProponente}
                  </p>
                  <p>
                    <strong>CPF do Proponente:</strong>{" "}
                    {selectedUser.cpfLocatario}
                  </p>
                  <p>
                    <strong>Data de Nascimento:</strong>{" "}
                    {selectedUser.dataNascimento}
                  </p>
                  <p>
                    <strong>Estado Civil:</strong> {selectedUser.estadoCivil}
                  </p>
                  <p>
                    <strong>Sexo:</strong> {selectedUser.sexo}
                  </p>

                  <h3 className="text-lg font-semibold mt-6">
                    Informações do Locador
                  </h3>
                  <p>
                    <strong>Nome do Locador:</strong> {selectedUser.nomeLocador}
                  </p>
                  <p>
                    <strong>CPF do Locador:</strong> {selectedUser.cpfLocador}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Endereço</h3>
                  <p>
                    <strong>CEP:</strong> {selectedUser.cep}
                  </p>
                  <p>
                    <strong>Endereço:</strong> {selectedUser.endereco}
                  </p>
                  <p>
                    <strong>Bairro:</strong> {selectedUser.bairro}
                  </p>
                  <p>
                    <strong>Número:</strong> {selectedUser.numero}
                  </p>
                  <p>
                    <strong>Complemento:</strong> {selectedUser.complemento}
                  </p>
                  <p>
                    <strong>Cidade:</strong> {selectedUser.cidade}
                  </p>
                  <p>
                    <strong>Estado:</strong> {selectedUser.estado}
                  </p>

                  <h3 className="text-lg font-semibold mt-6">
                    Informações do Imóvel
                  </h3>
                  <p>
                    <strong>Tipo do Imóvel:</strong> {selectedUser.tipoImovel}
                  </p>
                </div>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Coberturas</h3>
                  <p>
                    <strong>Incêndio:</strong> {selectedUser.incendio}
                  </p>
                  <p>
                    <strong>Vendaval:</strong> {selectedUser.vendaval}
                  </p>
                  <p>
                    <strong>Danos Elétricos:</strong>{" "}
                    {selectedUser.danosEletricos}
                  </p>
                  <p>
                    <strong>Impacto de Veículos:</strong>{" "}
                    {selectedUser.impactoVeiculos}
                  </p>
                  <p>
                    <strong>Perda de Aluguel:</strong>{" "}
                    {selectedUser.perdaAluguel}
                  </p>
                  <p>
                    <strong>Responsabilidade Civil:</strong>{" "}
                    {selectedUser.responsabilidadeCivil}
                  </p>

                  <h3 className="text-lg font-semibold mt-6">
                    Informações do Seguro
                  </h3>
                  <p>
                    <strong>Plano Escolhido:</strong>{" "}
                    {selectedUser.planoEscolhido}
                  </p>
                  <p>
                    <strong>Valor do Seguro:</strong> {selectedUser.valorSeguro}
                  </p>
                  <p>
                    <strong>Forma de Pagamento:</strong>{" "}
                    {selectedUser.formaPagamento}
                  </p>
                  <p>
                    <strong>Incluir Cláusula Beneficiária:</strong>{" "}
                    {selectedUser.incluirClausulaBeneficiaria}
                  </p>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={closeUserModal}
                  className="w-full bg-[#027B49] hover:bg-[#025d37]"
                >
                  Fechar
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-4 bg-[#027B49] text-white px-4 py-2 rounded-md shadow-lg"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent() {
  return (
    <nav className="flex-grow">
      <ul className="space-y-2 py-4">
        <li>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Flame className="h-5 w-5 mr-3" />
            <span>Incêndio</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Building className="h-5 w-5 mr-3" />
            <span>Fiança Empresarial</span>
          </a>
        </li>
        <li>
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Home className="h-5 w-5 mr-3" />
            <span>Fiança Residencial</span>
          </a>
        </li>
        <li>
          <a
            href="https://piva-orcamentos-01.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <ExternalLink className="h-5 w-5 mr-3" />
            <span>Fazer orçamento</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}
