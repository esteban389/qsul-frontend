import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFiltersState } from "../context/storage";
import usePerceptionTrend from "./usePerceptionTrend";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import LoadingContent from "@/components/LoadingContent";

export default function PerceptionTrend() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = usePerceptionTrend(getRequest());
  return (
    <Card className="col-span-full">
      <CardHeader className="relative">
        <CardTitle>Evolución de la Percepción General de la Categoría a lo Largo del Tiempo</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            <p>
              Este gráfico muestra la evolución del promedio general obtenido por la universidad en la
              evaluación de manera cuantitativa por parte de los encuestados a lo largo del tiempo.
            </p>
            <br />
            <p>
              Los datos reflejan los filtros seleccionados: si se elige una seccional, se muestra el
              promedio correspondiente a esa sede; si además se selecciona un proceso, el promedio se
              ajusta para mostrar únicamente la evaluación de ese proceso dentro de la seccional elegida,
              y así sucesivamente.
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

function Chart({ data }: { data: any }) {
  const chartConfig = {
    "average_perception": {
      label: "Percepción General",
    }
  }
  const chartData = data;
  return <ChartContainer config={chartConfig}>
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
      <Line
        dataKey="average_perception"
        type="linear"
        stroke="hsl(var(--chart-1))"
        strokeWidth={2}
        dot={false}
      />
    </LineChart>
  </ChartContainer>
}