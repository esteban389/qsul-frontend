import backendClient from "@/services/backendClient";
import { ChartRequest } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>) {
  return (await backendClient.post("/api/chart/volume-trend", request)).data;
}

export default function useVolumeTrend(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["charts","volume-trend", request],
    queryFn: () => getData(request),
  });
}