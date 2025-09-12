import backendClient from "@/services/backendClient";
import { ChartRequest, PerceptionResponse } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>) {
  return (await backendClient.post<PerceptionResponse[]>("/api/chart/perception", request)).data;
}

export default function usePerception(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["chart", "perception", request],
    queryFn: () => getData(request),
  })
}