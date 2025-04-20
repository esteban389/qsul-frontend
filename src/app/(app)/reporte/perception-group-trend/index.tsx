import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiltersState } from "../context/storage";
import usePerceptionGroupTrend from "./usePerceptionGroupTrend";
import { formatDate } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import QueryRenderer from "@/components/QueryRenderer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { GroupedTrendChartResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);

export default function PerceptionGroupTrend() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = usePerceptionGroupTrend(getRequest());
  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Evolución de la Percepción General Agrupado por Categoría a lo Largo del Tiempo</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            Este gráfico desglosa el promedio de percepción cuantitativa por categorías.
            Si no se ha seleccionado ninguna seccional, los resultados se muestran por seccional.
            Al seleccionar una seccional, el gráfico se actualiza para mostrar los promedios por
            proceso dentro de esa seccional.
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <QueryRenderer resolveEmpty={data => !data || data?.data?.length === 0} query={query} config={{
          pending: () => <div className="size-full flex items-center justify-center"><LoadingContent /></div>,
          error: () => <div className="text-red-500">Error al cargar los datos</div>,
          success: Chart,
          empty: () => <div className="text-gray-500">No hay datos disponibles</div>
        }} />
      </CardContent>
    </Card>
  );
}

function Chart({ data }: { data: GroupedTrendChartResponse }) {
  const chartConfig = data.labels?.reduce((acc: Record<string, any>, label: string, index: number) => {
    acc[label] = {
      label,
      color: `hsl(var(--chart-${indexes[index % indexes.length]}))`,
    };
    return acc;
  }, {});
  const chartData = data.data
  return (
    <ChartContainer config={chartConfig}>
      <LineChart
        accessibilityLayer
        data={chartData}
        margin={{ left: 12, right: 12 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        {Object.keys(chartConfig).map(key => (
          <Line
            key={key}
            dataKey={key}
            type="linear"
            stroke={chartConfig[key].color}
            strokeWidth={2}
            dot={false}
          />
        ))}
      </LineChart>
    </ChartContainer>
  )
}