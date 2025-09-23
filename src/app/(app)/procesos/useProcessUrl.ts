import backendClient from "@/services/backendClient";
import { useQuery } from "@tanstack/react-query";
import { url } from "../empleados/useEmployeeUrl";

async function getProcessUrl(id: number) {
  const response = await backendClient.get<url>(`/api/processes/${id}/url`);
  return response.data;
}


export default function useProcessUrl(id: number) {
  return useQuery({
    queryKey: ['process', id, 'url'],
    queryFn: () => getProcessUrl(id),
  });
}