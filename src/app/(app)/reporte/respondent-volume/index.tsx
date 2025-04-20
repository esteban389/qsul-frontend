import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { useFiltersState } from "../context/storage";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Label, Pie, PieChart } from "recharts";
import { VolumeResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";
import useRespondentVolume from "./useRespondentVolume";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);

export default function RespondentTypeVolume() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useRespondentVolume(getRequest());

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Participación en la Encuesta por Tipo de Encuestado</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            Este gráfico muestra el acumulado de usuarios que han respondido la encuesta agrupados por
            tipo de encuestado.
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

function Chart({ data }: { data: VolumeResponse[] }) {
  const chartCategories = data.map(item => item.name);
  const chartConfig = chartCategories.reduce((acc: Record<string, any>, label: string, index: number) => {
    acc[label] = {
      label,
      color: `hsl(var(--chart-${indexes[index % indexes.length]}))`,
    };
    return acc;
  }, {});

  const chartData = data.map(item => ({
    ...item,
    fill: chartConfig[item.name].color,
  }));

  const totalEncuestados = useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.feedback_count, 0)
  }, [])
  return (
    <ChartContainer config={chartConfig}>
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={chartData}
          dataKey="feedback_count"
          nameKey="name"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {totalEncuestados.toLocaleString()}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
                    >
                      Encuestados
                    </tspan>
                  </text>
                )
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  )
}