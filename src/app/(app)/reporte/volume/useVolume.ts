import backendClient from "@/services/backendClient";
import { ChartRequest } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>) {
  return (await backendClient.post("/api/chart/volume", request)).data;
}

export default function useVolume(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["charts","volume", request],
    queryFn: () => getData(request),
  });
}