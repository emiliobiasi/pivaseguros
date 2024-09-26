import { IncendioTable } from "@/components/IncendioTable/incendio-table";
import { TopBar } from "@/components/TopBar/top-bar";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { useEffect, useState } from "react";
import { fetchSeguroIncendioList } from "@/utils/api/SeguroIncendioService";

export function DashboardIncendio() {
  const [data, setData] = useState<SeguroIncendio[]>([]);
  const [page, setPage] = useState(1); // Controla a página atual
  const [totalPages, setTotalPages] = useState(0); // Armazena o número total de páginas
  const [limit, setLimit] = useState(10); // Limite de itens por página, começa com 10
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items, totalPages } = await fetchSeguroIncendioList(
          page,
          limit
        );
        setData(items);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Erro ao buscar os seguros de incêndio:", error);
      }
    };
    fetchData();
  }, [page, limit]); // Recarrega os dados ao alterar a página ou limite

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Funções para navegar entre páginas
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Função para alterar o limite de itens por página
  const handleLimitChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setLimit(Number(event.target.value)); // Atualiza o limite com a escolha do usuário
    setPage(1); // Reinicia para a primeira página
  };

  return (
    <div>
      <TopBar
        toggleSidebar={toggleSidebar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Seleção do Limite de Itens por Página */}
      <div className="flex justify-end p-4">
        <label htmlFor="limit" className="mr-2 text-gray-700">
          Itens por página:
        </label>
        <select
          id="limit"
          value={limit}
          onChange={handleLimitChange}
          className="border border-gray-300 rounded-md p-2 text-gray-700"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={15}>15</option>
          <option value={20}>20</option>
        </select>
      </div>

      {/* Componente de Tabela */}
      <IncendioTable data={data} />

      {/* Controles de Paginação */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 border rounded-md ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition ease-in-out duration-150`}
        >
          Página Anterior
        </button>

        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700">Página</span>
          <span className="text-lg font-bold text-gray-900">{page}</span>
          <span className="text-sm font-medium text-gray-700">de</span>
          <span className="text-lg font-bold text-gray-900">{totalPages}</span>
        </div>

        <button
          onClick={handleNextPage}
          disabled={page === totalPages}
          className={`px-4 py-2 border rounded-md ${
            page === totalPages
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 text-white hover:bg-blue-600"
          } transition ease-in-out duration-150`}
        >
          Próxima Página
        </button>
      </div>
    </div>
  );
}
