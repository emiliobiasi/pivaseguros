import { IncendioTable } from "@/components/IncendioTable/incendio-table";
import { TopBar } from "@/components/TopBar/top-bar";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { useEffect, useState } from "react";
import { fetchSeguroIncendioList } from "@/utils/api/SeguroIncendioService";
import { Slider } from "@/components/ui/slider"; // Import the Slider component from shadcn ui

export function DashboardIncendio() {
  const [data, setData] = useState<SeguroIncendio[]>([]);
  const [page, setPage] = useState(1); // Controls the current page
  const [totalPages, setTotalPages] = useState(0); // Stores the total number of pages
  const [limit, setLimit] = useState(10); // Items per page limit, starts at 10
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
  }, [page, limit]); // Reload data when page or limit changes

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

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

  return (
    <div>
      <TopBar
        toggleSidebar={toggleSidebar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Items per Page Slider Selection */}
      <div className="flex justify-center p-4">
        <div className="flex items-center space-x-4">
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
              className="w-80" // Adjust the width of the slider
            />
            <span className="text-gray-800 font-medium">{limit}</span>
          </div>
        </div>
      </div>

      {/* Table Component */}
      <IncendioTable data={data} />

      {/* Pagination Controls */}
      <div className="flex justify-center mt-6 space-x-4">
        <button
          onClick={handlePreviousPage}
          disabled={page === 1}
          className={`px-4 py-2 border rounded-md ${
            page === 1
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
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
              : "bg-green-500 text-white hover:bg-green-600"
          } transition ease-in-out duration-150`}
        >
          Próxima Página
        </button>
      </div>
    </div>
  );
}
