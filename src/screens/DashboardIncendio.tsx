import { IncendioTable } from "@/components/IncendioTable/incendio-table";
import { TopBar } from "@/components/TopBar/top-bar";
import { SeguroIncendio } from "@/types/SeguroIncendio";
import { useEffect, useState } from "react";
// import pb from "@/utils/backend/pb";
import { fetchSeguroIncendioList } from "@/utils/api/SeguroIncendioService";

export function DashboardIncendio() {
  const [data, setData] = useState<SeguroIncendio[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seguros = await fetchSeguroIncendioList();
        setData(seguros);
      } catch (error) {
        console.error("Erro ao buscar os seguros de incêndio:", error);
      }
    };
    fetchData();
    // return () => {
    //   pb.collection("seguro_incendio").unsubscribe("*");
    // };
  }, []);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div>
      <TopBar
        toggleSidebar={toggleSidebar}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      <IncendioTable data={data} />
    </div>
  );
}
