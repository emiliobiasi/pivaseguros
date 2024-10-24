import { Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type GraficoPizzaProps = {
  totalForms: number;
  approvedForms: number;
  rejectedForms: number;
};

export function GraficoPizza({
  totalForms,
  approvedForms,
  rejectedForms,
}: GraficoPizzaProps) {
  // Preparamos os dados para o gráfico de pizza
  const chartData = [
    { label: "Aprovados", value: approvedForms, fill: "#28a745" }, // Cor verde para aprovados
    { label: "Reprovados", value: rejectedForms, fill: "#dc3545" }, // Cor vermelha para reprovados
  ];

  // Configuração do gráfico, as cores podem ser customizadas no CSS com variáveis
  const chartConfig = {
    visitors: {
      label: "Formulários",
    },
    approved: {
      label: "Aprovados",
      color: "#28a745", // Cor verde para aprovados
    },
    rejected: {
      label: "Reprovados",
      color: "#dc3545", // Cor vermelha para reprovados
    },
  } satisfies ChartConfig;

  return (
    <Card className="flex flex-col" style={{ width: "70%" }}>
      {" "}
      {/* Mantém o tamanho similar ao exemplo */}
      <CardHeader className="items-center pb-0">
        <CardTitle>Aprovados e Reprovados: Seguros Fiança</CardTitle>
        <CardDescription>Total de IDs: {totalForms}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px] pb-0 [&_.recharts-pie-label-text]:fill-foreground"
        >
          <PieChart>
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="value"
              label={({ name }) => name} // Mostra o rótulo
              nameKey="label"
              outerRadius={80}
              fill="var(--color-foreground)"
            />
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="leading-none text-muted-foreground">
          Mostrando janela dos últimos 30 dias
        </div>
      </CardFooter>
    </Card>
  );
}
