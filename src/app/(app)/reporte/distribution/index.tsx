import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFiltersState } from "../context/storage";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { StackedResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";
import useDistribution from "./useDistribution";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);
const colors = [
  "hsl(0, 83%, 73%)",
  "hsl(45, 100%, 75%)",
  "hsl(120, 70%, 65%)",
]

export default function Distribution() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useDistribution(getRequest());

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Distribución de Resultados por Categoría y Nivel de Satisfacción</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            <p>
              Este gráfico de barras apiladas muestra la distribución de los niveles de satisfacción por cada categoría.
              Cada barra representa una categoría y está segmentada según la cantidad de respuestas clasificadas en los siguientes niveles de satisfacción:
            </p>
            <br />
            <div className="space-y-2">
              <p>
                Insatisfecho (promedio entre 1.0 y 2.9)
              </p>
              <p>
                Satisfecho (promedio entre 3.0 y 3.9)
              </p>
              <p>
                Muy satisfecho (promedio entre 4.0 y 5.0)
              </p>
            </div>
            <br />
            <p>
              El gráfico permite comparar visualmente cómo varía la satisfacción entre los diferentes grupos.
            </p>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <QueryRenderer query={query} config={{
          pending: () => <div className="size-full flex justify-center items-center"><LoadingContent /></div>,
          error: () => <div className="text-red-500">Error al cargar los datos</div>,
          success: Chart,
          empty: () => <div className="text-gray-500">No hay datos disponibles</div>
        }} />
      </CardContent>
    </Card>
  );
}

function Chart({ data }: { data: StackedResponse }) {
  const chartConfig = data.labels?.reduce((acc: Record<string, any>, label: string, index: number) => {
    acc[label] = {
      label,
      color: colors[index % colors.length],
    };
    return acc;
  }, {});
  const chartData = data.data

  return (
    <ChartContainer config={chartConfig}>
      <BarChart
        accessibilityLayer
        layout="vertical"
        data={chartData}>
        <CartesianGrid horizontal={false} />
        <XAxis type="number" />
        <YAxis
          dataKey="group_name"
          type="category"
          tickLine={false}
          axisLine={false}
        />
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        {Object.keys(chartConfig).map((key, index) => (
          <Bar
            key={key}
            dataKey={key}
            fill={chartConfig[key].color}
            stackId="a"
          />
        ))}
      </BarChart>
    </ChartContainer>
  )
}