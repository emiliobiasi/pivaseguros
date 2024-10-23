import { Flame, TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  LabelProps,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type GraficoBarraHorizontalProps = {
  data: { nome_imobiliaria: string; count: number }[];
  dataKey: string;
  xAxisKey: string;
  title: string;
  description: string;
  trendingMessage?: string;
};

// Definir a interface para os ticks personalizados
interface CustomizedAxisTickProps {
  x: number;
  y: number;
  payload: {
    value: string;
  };
}

export function GraficoBarraHorizontal({
  data,
  dataKey,
  xAxisKey,
  title,
  description,
  trendingMessage,
}: GraficoBarraHorizontalProps) {
  // Calcular o total de seguros para calcular as porcentagens
  const totalCount = data.reduce((total, item) => total + item.count, 0);

  // Definir altura dinâmica com base no número de itens
  const barSize = 40; // Tamanho de cada barra
  const chartHeight = data.length * barSize + 100; // Altura total do gráfico

  // Função para truncar nomes longos
  const truncateName = (name: string, maxLength: number) => {
    if (name.length <= maxLength) {
      return name;
    }
    return name.substring(0, maxNameLength) + "...";
  };

  // Definir o tamanho máximo do nome
  const maxNameLength = 15; // Ajuste conforme necessário

  // Função personalizada para renderizar os ticks do eixo Y com tooltip
  const renderCustomizedYAxisTick = (props: CustomizedAxisTickProps) => {
    const { x, y, payload } = props;
    const fullName = payload.value;
    const truncatedName = truncateName(fullName, maxNameLength);

    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={-10}
          y={0}
          dy={6}
          textAnchor="end"
          fill="#666"
          style={{ cursor: "default" }}
        >
          <title>{fullName}</title>
          {truncatedName}
        </text>
      </g>
    );
  };

  // Função personalizada para renderizar as labels das barras
  const renderCustomizedLabel = (props: LabelProps) => {
    const { x, y, width, height, value } = props;

    // Fornecer valores padrão para evitar 'undefined'
    const posX = (x as number) ?? 0;
    const posY = (y as number) ?? 0;
    const barWidth = (width as number) ?? 0;
    const barHeight = (height as number) ?? 0;

    const percentage = (Number(value) / totalCount) * 100;
    const labelText = `${value} (${percentage.toFixed(2)}%)`;

    // Define um limiar para decidir se a label ficará dentro ou fora da barra
    const threshold = 60; // Você pode ajustar este valor conforme necessário
    const isSmallBar = barWidth < threshold;

    return (
      <text
        x={isSmallBar ? posX + barWidth + 5 : posX + barWidth - 5}
        y={posY + barHeight / 2}
        fill={isSmallBar ? "#000000" : "#FFFFFF"}
        textAnchor={isSmallBar ? "start" : "end"}
        dominantBaseline="middle"
        style={{
          fontWeight: "bold",
          fontSize: 12,
          textShadow: isSmallBar ? "none" : "1px 1px 3px rgba(0, 0, 0, 0.5)",
        }}
      >
        {labelText}
      </text>
    );
  };

  return (
    <Card style={{ width: "70%" }}>
      <CardHeader>
        <CardTitle
          style={{ display: "flex", alignItems: "center", marginBottom: "5px" }}
        >
          <Flame style={{ marginRight: "8px", color: "orange" }} />
          {title}
        </CardTitle>
        <CardDescription style={{ fontSize: "1em", color: "black" }}>
          {description}:{" "}
          <span style={{ fontWeight: "bold", fontSize: "1.1em" }}>
            {totalCount}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <BarChart
          width={700}
          height={chartHeight}
          data={data}
          layout="vertical"
          margin={{
            left: 50,
          }}
          barSize={barSize}
        >
          <XAxis type="number" dataKey={dataKey} hide />
          <YAxis
            dataKey={xAxisKey}
            type="category"
            width={250}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={renderCustomizedYAxisTick}
          />
          <Tooltip
            formatter={(value: number | string) => {
              const percentage = (Number(value) / totalCount) * 100;
              return [`${value} (${percentage.toFixed(2)}%)`, "Seguros"];
            }}
            contentStyle={{
              backgroundColor: "#ffffff",
              color: "#000000",
              borderRadius: "7px",
            }}
            cursor={{ fill: "rgba(0, 0, 0, 0.1)", radius: 5 }}
          />
          <Bar dataKey={dataKey} fill="#28a745" radius={5}>
            <LabelList dataKey={dataKey} content={renderCustomizedLabel} />
          </Bar>
        </BarChart>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        {trendingMessage && (
          <div className="flex gap-2 font-medium leading-none">
            {trendingMessage} <TrendingUp className="h-4 w-4" />
          </div>
        )}
        <div className="leading-none text-muted-foreground">
          Mostrando janela dos últimos 30 dias
        </div>
      </CardFooter>
    </Card>
  );
}
