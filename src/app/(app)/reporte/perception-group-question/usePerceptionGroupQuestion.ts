import backendClient from "@/services/backendClient";
import { ChartRequest, GroupedTrendChartResponse, PerceptionQuestionChartResponse } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>): Promise<PerceptionQuestionChartResponse[]>{
  return (await backendClient.post<PerceptionQuestionChartResponse[]>("/api/chart/perception-question", request)).data;
}

export default function usePerceptionGroupQuestion(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ['charts', 'perception-group-question', request],
    queryFn: ()=> getData(request),
  })
}