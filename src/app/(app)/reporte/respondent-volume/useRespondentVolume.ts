import backendClient from "@/services/backendClient";
import { ChartRequest } from "@/types/chart";
import { useQuery } from "@tanstack/react-query";

async function getData(request: Partial<ChartRequest>) {
  return (await backendClient.post("/api/chart/respondent", request)).data;
}

export default function useVolume(request: Partial<ChartRequest>) {
  return useQuery({
    queryKey: ["charts","respondent-volume", request],
    queryFn: () => getData(request),
  });
}