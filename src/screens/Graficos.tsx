import { useEffect, useState } from "react";
import { GraficoBarraHorizontal } from "@/components/GraficoBarraHorizontal/grafico-barra-horizontal";
import { fetchSeguroIncendioLastMonth } from "@/utils/api/SeguroIncendioService";
import { fetchSeguroIncendioComercialLastMonth } from "@/utils/api/SeguroIncendioComercialService";
import { fetchSeguroFiancaEmpresarialMais2AnosLastMonth } from "@/utils/api/SeguroFiancaEmpresarialMais2AnosService";
import { fetchSeguroFiancaEmpresarialMenos2AnosLastMonth } from "@/utils/api/SeguroFiancaEmpresarialMenos2AnosService";
import { fetchSeguroFiancaResidencialLastMonth } from "@/utils/api/SeguroFiancaResidencialService";
import { SkeletonHorizontalBarChart } from "@/components/SkeletonHorizontalBarChart/skeleton-horizontal-bar-chart";

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

  // Novo estado para o segundo gráfico
  const [fiancaData, setFiancaData] = useState<CombinedSeguroData[]>([]);
  const [isLoadingFianca, setIsLoadingFianca] = useState(true);

  // Função para buscar e combinar os seguros de incêndio
  const fetchIncendioDataAndCombine = async () => {
    try {
      console.log("Buscando dados de seguros de incêndio...");

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
      console.error(
        "Erro ao buscar e combinar os dados de seguros de incêndio:",
        error
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar e combinar os seguros de fiança
  const fetchFiancaDataAndCombine = async () => {
    try {
      console.log("Buscando dados de seguros de fiança...");

      const [
        fiancaEmpresarialMais2AnosData,
        fiancaEmpresarialMenos2AnosData,
        fiancaResidencialData,
      ] = await Promise.all([
        fetchSeguroFiancaEmpresarialMais2AnosLastMonth(),
        fetchSeguroFiancaEmpresarialMenos2AnosLastMonth(),
        fetchSeguroFiancaResidencialLastMonth(),
      ]);

      // Mapeia e normaliza os dados, mantendo o nome original
      const fiancaEmpresarialMais2AnosMapped =
        fiancaEmpresarialMais2AnosData.map((item) => ({
          nome_imobiliaria_original: item.nome_imobiliaria,
          nome_imobiliaria: normalizeName(item.nome_imobiliaria),
          count: 1,
        }));

      const fiancaEmpresarialMenos2AnosMapped =
        fiancaEmpresarialMenos2AnosData.map((item) => ({
          nome_imobiliaria_original: item.nome_imobiliaria,
          nome_imobiliaria: normalizeName(item.nome_imobiliaria),
          count: 1,
        }));

      // Aqui alteramos o campo para usar `nome_imobiliaria_corretor` no caso do residencial
      const fiancaResidencialMapped = fiancaResidencialData.map((item) => ({
        nome_imobiliaria_original: item.nome_imobiliaria_corretor, // Ajuste feito aqui
        nome_imobiliaria: normalizeName(item.nome_imobiliaria_corretor), // Ajuste feito aqui
        count: 1,
      }));

      // Combina os dados das três fontes
      const combined = [
        ...fiancaEmpresarialMais2AnosMapped,
        ...fiancaEmpresarialMenos2AnosMapped,
        ...fiancaResidencialMapped,
      ];

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

      setFiancaData(groupedData);
    } catch (error) {
      console.error(
        "Erro ao buscar e combinar os dados de seguros de fiança:",
        error
      );
    } finally {
      setIsLoadingFianca(false);
    }
  };

  useEffect(() => {
    fetchIncendioDataAndCombine();
    fetchFiancaDataAndCombine();
  }, []);

  if (isLoading || isLoadingFianca) {
    return (
      <div className="flex flex-col items-center p-4 overflow-y-auto max-h-screen">
        <SkeletonHorizontalBarChart />
        <SkeletonHorizontalBarChart />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 overflow-y-auto max-h-screen">
      {/* Gráfico com dados combinados de seguros de incêndio */}
      <GraficoBarraHorizontal
        data={combinedData}
        dataKey="count"
        xAxisKey="nome_imobiliaria_original" // Exibe o nome original
        title="INCÊNDIO: Seguros por Imobiliária"
        description="Total de Seguros de Incêndio (Comercial e Residencial) criados no último mês"
      />

      {/* Novo Gráfico com dados combinados de seguros de fiança */}
      <GraficoBarraHorizontal
        data={fiancaData}
        dataKey="count"
        xAxisKey="nome_imobiliaria_original" // Exibe o nome original
        title="FIANÇA: Seguros por Imobiliária"
        description="Total de Seguros de Fiança (Empresarial e Residencial) criados no último mês"
      />
    </div>
  );
};

export default Graficos;
