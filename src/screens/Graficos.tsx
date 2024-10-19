import { useEffect, useState } from "react";
import { GraficoBarraHorizontal } from "@/components/GraficoBarraHorizontal/grafico-barra-horizontal";
import { fetchSeguroIncendioLastMonth } from "@/utils/api/SeguroIncendioService";
import { fetchSeguroIncendioComercialLastMonth } from "@/utils/api/SeguroIncendioComercialService";

// Definir o tipo combinado
type CombinedSeguroData = {
  nome_imobiliaria: string;
  nome_imobiliaria_original: string; // Mantém o nome original
  count: number;
};

// Função para normalizar os nomes das imobiliárias
function normalizeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove acentos
    .toLowerCase() // Converte para minúsculas para normalizar
    .trim()
    .replace(/\./g, "") // Remove pontos
    .replace(/\s+/g, " "); // Substitui múltiplos espaços por um único
}

const Graficos = () => {
  const [combinedData, setCombinedData] = useState<CombinedSeguroData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Função para buscar e combinar os seguros de incêndio e comerciais
  const fetchDataAndCombine = async () => {
    try {
      console.log("Buscando dados de seguros...");

      const [incendioData, incendioComercialData] = await Promise.all([
        fetchSeguroIncendioLastMonth(),
        fetchSeguroIncendioComercialLastMonth(),
      ]);

      // Mapeia e normaliza os dados, mantendo o nome original
      const incendioMapped = incendioData.map((item) => ({
        nome_imobiliaria_original: item.nome_imobiliaria,
        nome_imobiliaria: normalizeName(item.nome_imobiliaria),
        count: 1,
      }));

      const incendioComercialMapped = incendioComercialData.map((item) => ({
        nome_imobiliaria_original: item.nome_imobiliaria,
        nome_imobiliaria: normalizeName(item.nome_imobiliaria),
        count: 1,
      }));

      // Combina os dados das duas fontes
      const combined = [...incendioMapped, ...incendioComercialMapped];

      // Agrupa os dados por nome normalizado, mantendo o nome original
      const groupedData = combined.reduce<CombinedSeguroData[]>((acc, curr) => {
        const found = acc.find(
          (item) => item.nome_imobiliaria === curr.nome_imobiliaria
        );
        if (found) {
          found.count += curr.count;
        } else {
          acc.push({
            nome_imobiliaria: curr.nome_imobiliaria,
            nome_imobiliaria_original: curr.nome_imobiliaria_original, // Mantém o original
            count: curr.count,
          });
        }
        return acc;
      }, []);

      setCombinedData(groupedData);
    } catch (error) {
      console.error("Erro ao buscar e combinar os dados de seguros:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDataAndCombine();
  }, []);

  if (isLoading) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center p-4 overflow-y-auto max-h-screen">
      {/* Gráfico com dados combinados */}
      <GraficoBarraHorizontal
        data={combinedData}
        dataKey="count"
        xAxisKey="nome_imobiliaria_original" // Exibe o nome original
        title="Seguros por Imobiliária"
        description="Total de Seguros de Incêndio (Comercial e Residencial) criados no último mês"
      />
    </div>
  );
};

export default Graficos;
