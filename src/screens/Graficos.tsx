import { RefAttributes, useEffect, useState } from "react";
import { GraficoBarraHorizontal } from "@/components/GraficoBarraHorizontal/grafico-barra-horizontal";
import { fetchSeguroIncendioLastMonth } from "@/utils/api/SeguroIncendioService";
import { fetchSeguroIncendioComercialLastMonth } from "@/utils/api/SeguroIncendioComercialService";
import { fetchSeguroFiancaEmpresarialMais2AnosLastMonth } from "@/utils/api/SeguroFiancaEmpresarialMais2AnosService";
import { fetchSeguroFiancaEmpresarialMenos2AnosLastMonth } from "@/utils/api/SeguroFiancaEmpresarialMenos2AnosService";
import { fetchSeguroFiancaResidencialLastMonth } from "@/utils/api/SeguroFiancaResidencialService";
import { fetchEfetivacaoSeguroFiancaLastMonth } from "@/utils/api/EfetivacaoSeguroFiancaService"; // Nova função importada
import { SkeletonHorizontalBarChart } from "@/components/SkeletonHorizontalBarChart/skeleton-horizontal-bar-chart";
import { Flame, LucideProps, House, CheckCircle } from "lucide-react";
import { JSX } from "react/jsx-runtime";
import { GraficoPizza } from "@/components/GraficoPizza/grafico-pizza";

const FireIcon = (
  props: JSX.IntrinsicAttributes &
    Omit<LucideProps, "ref"> &
    RefAttributes<SVGSVGElement>
) => <Flame {...props} />;

const HouseIcon = (
  props: JSX.IntrinsicAttributes &
    Omit<LucideProps, "ref"> &
    RefAttributes<SVGSVGElement>
) => <House {...props} />;

const CheckIcon = (
  props: JSX.IntrinsicAttributes &
    Omit<LucideProps, "ref"> &
    RefAttributes<SVGSVGElement>
) => <CheckCircle {...props} />;

// Definir o tipo combinado
type CombinedSeguroData = {
  nome_imobiliaria: string;
  nome_imobiliaria_original: string; // Mantém o nome original
  count: number;
};

type SeguroFianca = {
  status: "EM ANÁLISE" | "APROVADO" | "REPROVADO";
  // Adicione outros campos, se necessário...
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

  const [fiancaData, setFiancaData] = useState<CombinedSeguroData[]>([]);
  const [isLoadingFianca, setIsLoadingFianca] = useState(true);

  const [efetivacaoData, setEfetivacaoData] = useState<CombinedSeguroData[]>(
    []
  );

  const [formStatusCounts, setFormStatusCounts] = useState({
    total: 0,
    approved: 0,
    rejected: 0,
  });
  const [isLoadingEfetivacao, setIsLoadingEfetivacao] = useState(true);

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

      const combined = [...incendioMapped, ...incendioComercialMapped];

      const groupedData = combined.reduce<CombinedSeguroData[]>((acc, curr) => {
        const found = acc.find(
          (item) => item.nome_imobiliaria === curr.nome_imobiliaria
        );
        if (found) {
          found.count += curr.count;
        } else {
          acc.push({
            nome_imobiliaria: curr.nome_imobiliaria,
            nome_imobiliaria_original: curr.nome_imobiliaria_original,
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

  // Função para buscar e combinar os seguros de fiança, verificando o status de cada form
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

      let approvedCount = 0;
      let rejectedCount = 0;

      // Função para contar status de cada seguro
      const countStatus = (data: SeguroFianca[]) => {
        data.forEach((item) => {
          if (item.status === "APROVADO") {
            approvedCount++;
          } else if (item.status === "REPROVADO") {
            rejectedCount++;
          }
        });
      };

      // Aplica a contagem de status para cada tipo de seguro
      countStatus(fiancaEmpresarialMais2AnosData);
      countStatus(fiancaEmpresarialMenos2AnosData);
      countStatus(fiancaResidencialData);

      // Atualiza o estado com as contagens
      setFormStatusCounts({
        total: approvedCount + rejectedCount,
        approved: approvedCount,
        rejected: rejectedCount,
      });

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

      const fiancaResidencialMapped = fiancaResidencialData.map((item) => ({
        nome_imobiliaria_original: item.nome_imobiliaria_corretor,
        nome_imobiliaria: normalizeName(item.nome_imobiliaria_corretor),
        count: 1,
      }));

      const combined = [
        ...fiancaEmpresarialMais2AnosMapped,
        ...fiancaEmpresarialMenos2AnosMapped,
        ...fiancaResidencialMapped,
      ];

      const groupedData = combined.reduce<CombinedSeguroData[]>((acc, curr) => {
        const found = acc.find(
          (item) => item.nome_imobiliaria === curr.nome_imobiliaria
        );
        if (found) {
          found.count += curr.count;
        } else {
          acc.push({
            nome_imobiliaria: curr.nome_imobiliaria,
            nome_imobiliaria_original: curr.nome_imobiliaria_original,
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

  // Função para buscar e combinar os dados de efetivação de seguros de fiança
  const fetchEfetivacaoDataAndCombine = async () => {
    try {
      console.log("Buscando dados de efetivação de seguros de fiança...");

      const efetivacaoData = await fetchEfetivacaoSeguroFiancaLastMonth();

      const efetivacaoMapped = efetivacaoData.map((item) => ({
        nome_imobiliaria_original: item.nome_imobiliaria,
        nome_imobiliaria: normalizeName(item.nome_imobiliaria),
        count: 1,
      }));

      const groupedData = efetivacaoMapped.reduce<CombinedSeguroData[]>(
        (acc, curr) => {
          const found = acc.find(
            (item) => item.nome_imobiliaria === curr.nome_imobiliaria
          );
          if (found) {
            found.count += curr.count;
          } else {
            acc.push({
              nome_imobiliaria: curr.nome_imobiliaria,
              nome_imobiliaria_original: curr.nome_imobiliaria_original,
              count: curr.count,
            });
          }
          return acc;
        },
        []
      );

      setEfetivacaoData(groupedData);
    } catch (error) {
      console.error(
        "Erro ao buscar e combinar os dados de efetivação de seguros de fiança:",
        error
      );
    } finally {
      setIsLoadingEfetivacao(false);
    }
  };

  useEffect(() => {
    fetchIncendioDataAndCombine();
    fetchFiancaDataAndCombine();
    fetchEfetivacaoDataAndCombine();
  }, []);

  if (isLoading || isLoadingFianca || isLoadingEfetivacao) {
    return (
      <div className="flex flex-col items-center p-4 overflow-y-auto max-h-screen">
        <SkeletonHorizontalBarChart />
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
        xAxisKey="nome_imobiliaria_original"
        title="INCÊNDIO: Seguros por Imobiliária"
        description="Total de Seguros de Incêndio (Comercial e Residencial) criados no último mês"
        icon={<FireIcon style={{ marginRight: "8px", color: "orange" }} />}
      />

      {/* Gráfico com dados combinados de seguros de fiança */}
      <GraficoBarraHorizontal
        data={fiancaData}
        dataKey="count"
        xAxisKey="nome_imobiliaria_original"
        title="FIANÇA: Seguros por Imobiliária"
        description="Total de Seguros de Fiança (Empresarial e Residencial) criados no último mês"
        icon={<HouseIcon style={{ marginRight: "8px", color: "green" }} />}
      />

      {/* Gráfico de Pizza com dados de formulários aprovados e reprovados */}
      <GraficoPizza
        totalForms={formStatusCounts.total}
        approvedForms={formStatusCounts.approved}
        rejectedForms={formStatusCounts.rejected}
      />

      {/* Novo Gráfico com dados de efetivação de seguros de fiança */}
      <GraficoBarraHorizontal
        data={efetivacaoData}
        dataKey="count"
        xAxisKey="nome_imobiliaria_original"
        title="EFETIVAÇÃO: Seguros de Fiança por Imobiliária"
        description="Total de Efetivações de Seguros de Fiança criadas no último mês"
        icon={<CheckIcon style={{ marginRight: "8px", color: "blue" }} />}
      />
    </div>
  );
};

export default Graficos;
