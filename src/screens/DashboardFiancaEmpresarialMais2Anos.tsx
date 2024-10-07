import { SeguroFiancaEmpresarialMais2Anos } from "@/types/SeguroFiancaEmpresarialMais2Anos";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchSeguroFiancaEmpresarialMais2AnosList,
  subscribeToSeguroFiancaEmpresarialMais2AnosUpdates,
  unsubscribeFromSeguroFiancaEmpresarialMais2AnosUpdates,
} from "@/utils/api/SeguroFiancaEmpresarialMais2AnosService";
import { Slider } from "@/components/ui/slider"; // Import Slider from shadcn ui
import { TopBar } from "@/components/TopBar/top-bar";
import { Button } from "@/components/ui/button";
import { RecordSubscription } from "pocketbase";
import { toast } from "sonner";
import { FiancaEmpresarialMais2AnosTable } from "@/components/FiancaEmpresarialMais2AnosTable/fianca-empresarial-mais-2-anos-table";

export function DashboardFiancaEmpresarialMais2Anos() {
  const [data, setData] = useState<SeguroFiancaEmpresarialMais2Anos[]>([]);
  const [page, setPage] = useState(1); // Controls the current page
  const [totalPages, setTotalPages] = useState(0); // Stores the total number of pages
  const [limit, setLimit] = useState(10); // Items per page limit, starts at 10
  const [searchTerm, setSearchTerm] = useState(""); // Control search term
  const [filter, setFilter] = useState<"PENDENTE" | "FINALIZADO" | "">(""); // Controla o filtro de ação

  const filterRef = useRef(filter);
  const searchTermRef = useRef(searchTerm);

  // Atualiza os refs quando filter ou searchTerm mudam
  useEffect(() => {
    filterRef.current = filter;
    searchTermRef.current = searchTerm;
  }, [filter, searchTerm]);

  // Fetch data when page, limit, searchTerm, or filter changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items, totalPages } = await fetchSeguroFiancaEmpresarialMais2AnosList(
          page,
          limit,
          searchTerm,
          filter // Passa o filtro de ação para o serviço
        );
        setData(items);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Erro ao buscar os seguros de fiança residencia:", error);
      }
    };
    fetchData();
  }, [page, limit, searchTerm, filter]); // Recarrega os dados ao alterar a página, limite, termo de busca ou filtro

  // Função para manipular eventos de mudança
  const handleSeguroFiancaEmpresarialMais2AnosChange = useCallback(
    (e: RecordSubscription<SeguroFiancaEmpresarialMais2Anos>) => {
      const { action, record } = e;

      const currentFilter = filterRef.current;
      const currentSearchTerm = searchTermRef.current;

      // Verifica se o registro corresponde aos filtros atuais
      const matchesFilter =
        (currentFilter === "" || record.acao === currentFilter) &&
        (currentSearchTerm === "" ||
          record.nome_empresa
            .toLowerCase()
            .includes(currentSearchTerm.toLowerCase()) ||
          record.email_empresa
            .toLowerCase()
            .includes(currentSearchTerm.toLowerCase()) ||
          record.id_numero.toString().includes(currentSearchTerm));

      setData((prevData) => {
        switch (action) {
          case "create":
            if (matchesFilter) {
              // Evita duplicatas
              if (!prevData.find((r) => r.id === record.id)) {
                // Exibe a notificação de Toast
                toast.success("Nova empresa adicionada!", {
                  duration: 3000,
                });

                return [record, ...prevData];
              }
            }
            return prevData;
          case "update":
            if (matchesFilter) {
              const index = prevData.findIndex((r) => r.id === record.id);
              if (index > -1) {
                const newData = [...prevData];
                newData[index] = record;
                return newData;
              } else {
                return [record, ...prevData];
              }
            } else {
              // Remove o registro se não corresponder ao filtro
              return prevData.filter((r) => r.id !== record.id);
            }
          case "delete":
            // Remove o registro da lista
            return prevData.filter((r) => r.id !== record.id);
          default:
            console.warn(`Ação desconhecida: ${action}`);
            return prevData;
        }
      });
    },
    []
  );

  // Inicia a subscription quando o componente monta
  useEffect(() => {
    subscribeToSeguroFiancaEmpresarialMais2AnosUpdates(
      handleSeguroFiancaEmpresarialMais2AnosChange
    );

    // Cancela a subscription quando o componente desmonta
    return () => {
      unsubscribeFromSeguroFiancaEmpresarialMais2AnosUpdates();
    };
  }, [handleSeguroFiancaEmpresarialMais2AnosChange]);

  // Functions to navigate between pages
  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  // Function to change the items per page limit using the slider
  const handleSliderChange = (value: number[]) => {
    setLimit(value[0]); // Update the limit with the user's choice
    setPage(1); // Reset to the first page
  };

  // Funções para aplicar filtros de ação
  const handleFilterChange = (newFilter: "PENDENTE" | "FINALIZADO" | "") => {
    setFilter(newFilter);
    setPage(1); // Reinicia para a primeira página ao aplicar o filtro
  };

  return (
    <div>
      <TopBar
        title="Seguros de Fiança Empresarial Acima de 2 Anos"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm} // Passa a função para atualizar o termo de busca
      />

      <div>
        {/* Botões de Filtro e Slider */}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
          {/* Filtro de Pendentes e Finalizados */}
          <div className="flex space-x-4">
            <Button
              className={`px-4 py-2 border rounded-md ${
                filter === ""
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } transition ease-in-out duration-150`}
              onClick={() => handleFilterChange("")}
            >
              Todos
            </Button>
            <Button
              className={`px-4 py-2 border rounded-md ${
                filter === "PENDENTE"
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } transition ease-in-out duration-150`}
              onClick={() => handleFilterChange("PENDENTE")}
            >
              Pendentes
            </Button>
            <Button
              className={`px-4 py-2 border rounded-md ${
                filter === "FINALIZADO"
                  ? "bg-green-700 text-white"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              } transition ease-in-out duration-150`}
              onClick={() => handleFilterChange("FINALIZADO")}
            >
              Finalizados
            </Button>
          </div>

          {/* Items per Page Slider Selection */}
          <div className="flex items-center space-x-4 cursor-pointer">
            <label htmlFor="limit" className="text-gray-700">
              Itens por página:
            </label>
            <div className="flex items-center space-x-2">
              <Slider
                id="limit"
                max={20}
                min={5}
                step={5}
                value={[limit]}
                onValueChange={handleSliderChange}
                className="w-32" // Adjust the width of the slider
              />
              <span className="text-gray-800 font-medium">{limit}</span>
            </div>
          </div>
        </div>

        <FiancaEmpresarialMais2AnosTable data={data} />

        {/* Pagination Controls */}
        <div className="flex justify-center mt-6 space-x-4">
          <Button
            onClick={handlePreviousPage}
            disabled={page === 1}
            className={`px-4 py-2 border rounded-md ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-600"
            } transition ease-in-out duration-150`}
          >
            Página Anterior
          </Button>

          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">Página</span>
            <span className="text-lg font-bold text-gray-900">{page}</span>
            <span className="text-sm font-medium text-gray-700">de</span>
            <span className="text-lg font-bold text-gray-900">
              {totalPages}
            </span>
          </div>

          <Button
            onClick={handleNextPage}
            disabled={page === totalPages}
            className={`px-4 py-2 border rounded-md ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-600"
            } transition ease-in-out duration-150`}
          >
            Próxima Página
          </Button>
        </div>
      </div>
    </div>
  );
}
