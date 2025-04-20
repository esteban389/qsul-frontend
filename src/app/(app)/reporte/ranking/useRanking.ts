import backendClient from "@/services/backendClient";
import { ChartRequest, RankingResponse } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>){
  return (await backendClient.post<RankingResponse[]>("/api/chart/ranking", request)).data;
}

export default function useRanking(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["charts","ranking", request],
    queryFn: () => getData(request),
  })
}