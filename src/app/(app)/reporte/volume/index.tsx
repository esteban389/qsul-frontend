import QueryRenderer from "@/components/QueryRenderer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { useFiltersState } from "../context/storage";
import { formatDate } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { VolumeResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";
import useVolume from "./useVolume";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);

export default function Volume() {
  const [tooltip, setTooltip] = useState(false);
  const { getRequest, getStateSlice } = useFiltersState();
  const query = useVolume(getRequest());

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Participación en la Encuesta por Categoría</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            Este gráfico muestra el acumulado de usuarios que han respondido la encuesta agrupados por
            categoría.
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
  const chartData = data.map((item, index) => ({
    name: item.name,
    feedback_count: item.feedback_count,
    fill: `hsl(var(--chart-${indexes[index % indexes.length]}))`,
  }));
  return (
    <ChartContainer config={chartConfig}>
      <BarChart accessibilityLayer data={chartData}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
        />
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="rounded-lg border bg-background p-2 shadow-sm">
                  <div className="flex flex-row justify-between gap-2 w-full">
                    <div className="flex items-center gap-2">
                      <div className="size-3 rounded-sm" style={{ backgroundColor: data.fill }} />
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {data.name}
                      </span>
                    </div>
                    <span className="font-bold text-muted-foreground">
                      {data.feedback_count}
                    </span>
                  </div>
                </div>
              );
            }
            return null;
          }}
        />
        <Bar dataKey="feedback_count"
          strokeWidth={2}
          radius={8} />
      </BarChart>
    </ChartContainer>
  )
}