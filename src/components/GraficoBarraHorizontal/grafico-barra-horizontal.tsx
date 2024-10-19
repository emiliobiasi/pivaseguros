import { Flame, TrendingUp } from "lucide-react";
import { Bar, BarChart, XAxis, YAxis, Tooltip, LabelList } from "recharts";
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
          height={300}
          data={data}
          layout="vertical"
          margin={{
            left: 50,
          }}
          barSize={50} // Deixa as barras mais finas
        >
          <XAxis type="number" dataKey={dataKey} hide />
          <YAxis
            dataKey={xAxisKey}
            type="category"
            width={250}
            tickLine={false}
            tickMargin={10}
            axisLine={false}
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
            }} // Tooltip branco com texto preto
            cursor={{ fill: "rgba(0, 0, 0, 0.1)", radius: 5 }}
          />
          <Bar dataKey={dataKey} fill="#28a745" radius={5}>
            <LabelList
              dataKey={dataKey}
              position="insideRight"
              formatter={(value: number) => {
                const percentage = (value / totalCount) * 100;
                return `${value} (${percentage.toFixed(2)}%)`;
              }}
              style={{
                fill: "#FFFFFF",
                fontWeight: "bold",
                fontSize: 12,
                textShadow: "1px 1px 3px rgba(0, 0, 0, 0.5)",
              }} // Define a cor do texto como branco
            />
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
