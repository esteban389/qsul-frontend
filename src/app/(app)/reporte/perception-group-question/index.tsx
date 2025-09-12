import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFiltersState } from "../context/storage";
import usePerceptionGroupTrend from "./usePerceptionGroupQuestion";
import { formatDate } from "@/lib/utils";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, XAxis, YAxis } from "recharts";
import QueryRenderer from "@/components/QueryRenderer";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";
import { useState } from "react";
import { GroupedTrendChartResponse, PerceptionQuestionChartResponse } from "@/types/chart";
import LoadingContent from "@/components/LoadingContent";
import usePerceptionGroupQuestion from "./usePerceptionGroupQuestion";
import { Button } from "@/components/ui/button";

const indexes = Array.from({ length: 5 }).map((_, i) => i + 1);

export default function PerceptionGroupQuestion() {
  const [tooltip, setTooltip] = useState(false);
  const [view, setView] = useState<'radar' | 'bar'>('radar');
  const { getRequest, getStateSlice } = useFiltersState();
  const query = usePerceptionGroupQuestion(getRequest());
  return (
    <Card className="col-span-full">
      <CardHeader className="relative">
        <CardTitle>Comparativa de Resultados por Pregunta y Categoría</CardTitle>
        <CardDescription>{formatDate(getStateSlice("start_date"), { year: "numeric", month: "long" })} - {formatDate(getStateSlice("end_date"), { year: "numeric", month: "long" })}</CardDescription>
        <Tooltip open={tooltip} onOpenChange={setTooltip}>
          <TooltipTrigger asChild onClick={() => setTooltip(!tooltip)}>
            <div className="flex items-center justify-between absolute top-2 right-2 cursor-help">
              <Info className="h-4 w-4 text-blue-500" />
            </div>
          </TooltipTrigger>
          <TooltipContent className="bg-blue-600 text-white font-bold max-w-[300px]">
            <div className="flex flex-col gap-2">
              <p>Este gráfico muestra la comparación de resultados por pregunta y categoría.</p>
              <p>Los resultados se agrupan por pregunta y se muestran en un gráfico de radar o de barras.</p>
              <p>Elige el tipo de gráfico que prefieras para visualizar los datos.</p>
            </div>
          </TooltipContent>
        </Tooltip>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4 gap-4">
          <Button variant={view === 'radar' ? 'default' : 'outline'} onClick={() => setView('radar')}>
            Radar
          </Button>
          <Button variant={view === 'bar' ? 'default' : 'outline'} onClick={() => setView('bar')}>
            Barras
          </Button>
        </div>
        <QueryRenderer query={query}
          successProps={{ view }}
	  resolveEmpty={(data)=> !data || data?.data.length === 0}
          config={{
            pending: () => <div className="size-full flex items-center justify-center"><LoadingContent /></div>,
            error: () => <div className="text-red-500">Error al cargar los datos</div>,
            success: Chart,
            empty: () => <div className="text-gray-500">No hay datos disponibles</div>
          }} />
      </CardContent>
    </Card>
  );
}

function Chart({ data, view }: { data: PerceptionQuestionChartResponse, view: 'radar' | 'bar' }) {
  const chartConfig = data?.labels.reduce((acc: Record<string, any>, label: string, index: number) => {
    acc[label] = {
      label: label,
      color: `hsl(var(--chart-${indexes[index % indexes.length]}))`,
    };
    return acc;
  }, {});
  const chartData = data.data
  return (
    <ChartContainer config={chartConfig}>
      {view === 'bar'
        ? (<BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="question"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(_, index) => `Pregunta ${index + 1}`}
            style={{ fontSize: 12 }}
          />
          <ChartTooltip
            content={<ChartTooltipContent />}
            cursor={false}
          />
          {Object.keys(chartConfig).map((key) => (
            <Bar key={key} dataKey={key} fill={chartConfig[key].color} radius={4} />
          ))}
        </BarChart>)
        : (<RadarChart accessibilityLayer data={chartData}>
          <ChartTooltip
            content={<ChartTooltipContent indicator="line" />}
            cursor={false}
          />
          <PolarAngleAxis dataKey="question" />
          <PolarGrid radialLines={false} />

          {Object.keys(chartConfig).map((key) => (
            <Radar
              key={key}
              dataKey={key}
              fill={chartConfig[key]['color']}
              fillOpacity={0}
              stroke={chartConfig[key]['color']}
              strokeWidth={2} />
          ))}
        </RadarChart>)}
    </ChartContainer>
  )
}
