import backendClient from "@/services/backendClient";
import { ChartRequest, GroupedTrendChartResponse } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>): Promise<GroupedTrendChartResponse>{
  return (await backendClient.post<GroupedTrendChartResponse>("/api/chart/perception-trend", request)).data;
}

export default function usePerceptionTrend(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ['charts', 'perception-trend', request],
    queryFn: ()=> getData(request),
  })
}