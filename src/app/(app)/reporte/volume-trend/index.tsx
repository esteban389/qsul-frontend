import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useFiltersState } from "../context/storage";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { GroupedTrendChartResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";
import useVolumeTrend from "./useVolumeTrend";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);

export default function VolumeTrend() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useVolumeTrend(getRequest());

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Tendencia de Participación en la Encuesta por Categoría</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            Este gráfico muestra la evolución del acumulado de usuarios que han respondido la encuesta agrupados por
            categoría a lo largo del tiempo.
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
      <AreaChart
        accessibilityLayer
        data={chartData}
        margin={{ right: 12, left: 12 }}>
        <ChartTooltip
          content={<ChartTooltipContent hideLabel />}
          cursor={false}
        />
        <CartesianGrid vertical={false} />
        <XAxis dataKey="period" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis tickLine={false} axisLine={false} tickMargin={8} />
        {Object.keys(chartConfig).map((key, index) => (
          <Area
            key={key}
            type="natural"
            dataKey={key}
            strokeWidth={2}
            stroke={`hsl(var(--chart-${indexes[index % indexes.length]}))`}
            fill={`hsl(var(--chart-${indexes[index % indexes.length]}))`}
            fillOpacity={0.3}
          />
        ))}
      </AreaChart>
    </ChartContainer>
  )
}