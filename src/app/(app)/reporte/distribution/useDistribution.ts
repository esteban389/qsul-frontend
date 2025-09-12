import backendClient from "@/services/backendClient";
import { ChartRequest } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>) {
  return (await backendClient.post("/api/chart/distribution", request)).data;
}

export default function useDistribution(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["charts", "distribution", request],
    queryFn: () => getData(request),
  });
}