import backendClient from "@/services/backendClient";
import { ChartRequest, GroupedTrendChartResponse } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>): Promise<GroupedTrendChartResponse>{
  return (await backendClient.post<GroupedTrendChartResponse>("/api/chart/perception-group", request)).data;
}

export default function usePerceptionGroupTrend(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ['charts', 'perception-group-trend', request],
    queryFn: ()=> getData(request),
  })
}