import { SeguroFiancaEmpresarialMenos2Anos } from "@/types/SeguroFiancaEmpresarialMenos2Anos";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  fetchSeguroFiancaEmpresarialMenos2AnosList,
  subscribeToSeguroFiancaEmpresarialMenos2AnosUpdates,
  unsubscribeFromSeguroFiancaEmpresarialMenos2AnosUpdates,
} from "@/utils/api/SeguroFiancaEmpresarialMenos2AnosService";
import { Slider } from "@/components/ui/slider";
import { TopBar } from "@/components/TopBar/top-bar";
import { Button } from "@/components/ui/button";
import { RecordSubscription } from "pocketbase";
import { toast } from "sonner";
import { FiancaEmpresarialMenos2AnosTable } from "@/components/FiancaEmpresarialMenos2AnosTable/fianca-empresarial-menos-2-anos-table";
import  notificacao_som  from '@/assets/notificacao_som.mp3';


export function DashboardFiancaEmpresarialMenos2Anos() {
  const [data, setData] = useState<SeguroFiancaEmpresarialMenos2Anos[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [limit, setLimit] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"PENDENTE" | "FINALIZADO" | "">("");

  const filterRef = useRef(filter);
  const searchTermRef = useRef(searchTerm);

  const sound = new Audio(notificacao_som);

  useEffect(() => {
    filterRef.current = filter;
    searchTermRef.current = searchTerm;
  }, [filter, searchTerm]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { items, totalPages } =
          await fetchSeguroFiancaEmpresarialMenos2AnosList(
            page,
            limit,
            searchTerm,
            filter
          );
        setData(items);
        setTotalPages(totalPages);
      } catch (error) {
        console.error("Erro ao buscar os seguros de fiança residencia:", error);
      }
    };
    fetchData();
  }, [page, limit, searchTerm, filter]);

  const handleSeguroFiancaEmpresarialMenos2AnosChange = useCallback(
    (e: RecordSubscription<SeguroFiancaEmpresarialMenos2Anos>) => {
      const { action, record } = e;

      const currentFilter = filterRef.current;
      const currentSearchTerm = searchTermRef.current;

      const matchesFilter =
        (currentFilter === "" || record.acao === currentFilter) &&
        (currentSearchTerm === "" ||
          record.nome_pretendente
            .toLowerCase()
            .includes(currentSearchTerm.toLowerCase()) ||
          record.nome_imobiliaria
            .toLowerCase()
            .includes(currentSearchTerm.toLowerCase()) ||
          record.id_numero.toString().includes(currentSearchTerm));

      setData((prevData) => {
        switch (action) {
          case "create":
            if (matchesFilter) {
              if (!prevData.find((r) => r.id === record.id)) {
                sound.play();
                toast.success("Nova imobiliária adicionada!", {
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
              return prevData.filter((r) => r.id !== record.id);
            }
          case "delete":
            return prevData.filter((r) => r.id !== record.id);
          default:
            console.warn(`Ação desconhecida: ${action}`);
            return prevData;
        }
      });
    },
    []
  );

  useEffect(() => {
    subscribeToSeguroFiancaEmpresarialMenos2AnosUpdates(
      handleSeguroFiancaEmpresarialMenos2AnosChange
    );

    return () => {
      unsubscribeFromSeguroFiancaEmpresarialMenos2AnosUpdates();
    };
  }, [handleSeguroFiancaEmpresarialMenos2AnosChange]);

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleSliderChange = (value: number[]) => {
    setLimit(value[0]);
    setPage(1);
  };

  const handleFilterChange = (newFilter: "PENDENTE" | "FINALIZADO" | "") => {
    setFilter(newFilter);
    setPage(1);
  };

  return (
    <div>
      <TopBar
        title="Seguros de Fiança Empresarial Menos de 2 Anos"
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <div>
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between">
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
                className="w-32"
              />
              <span className="text-gray-800 font-medium">{limit}</span>
            </div>
          </div>
        </div>

        <FiancaEmpresarialMenos2AnosTable data={data} />

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
