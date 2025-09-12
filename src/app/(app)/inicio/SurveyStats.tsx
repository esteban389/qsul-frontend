import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import QueryRenderer from "@/components/QueryRenderer";
import LoadingContent from "@/components/LoadingContent";
import useSurveyStats from "./useSurveyStats";

type TimeFilter = 'latest' | 'month' | '30days' | '7days';

export default function SurveyStats() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('latest');
  
  const query = useSurveyStats(timeFilter)

  return (
      <Card className="w-full flex-1">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Estadísticas de la Encuesta</CardTitle>
            <Select value={timeFilter} onValueChange={(value: TimeFilter) => setTimeFilter(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Seleccionar período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="latest">Última versión</SelectItem>
                <SelectItem value="month">Mes actual</SelectItem>
                <SelectItem value="30days">Últimos 30 días</SelectItem>
                <SelectItem value="7days">Últimos 7 días</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <CardDescription>
            {timeFilter === 'latest' && 'Datos de la última versión de la encuesta'}
            {timeFilter === 'month' && 'Datos del mes actual'}
            {timeFilter === '30days' && 'Datos de los últimos 30 días'}
            {timeFilter === '7days' && 'Datos de los últimos 7 días'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QueryRenderer query={query} config={{
            pending: () => <div className="size-full flex justify-center items-center"><LoadingContent /></div>,
            error: () => <div className="text-red-500">Error al cargar los datos</div>,
            success: ({ data }) => (
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">{data.total_submissions}</span>
                  <span className="text-sm text-muted-foreground">Total de respuestas</span>
                </div>
                <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
                  <span className="text-3xl font-bold">{data.ignored_submissions}</span>
                  <span className="text-sm text-muted-foreground">Respuestas ignoradas</span>
                </div>
              </div>
            ),
            empty: () => <div className="text-gray-500">No hay datos disponibles</div>
          }} />
        </CardContent>
      </Card>
  );
} 