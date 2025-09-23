import backendClient from "@/services/backendClient";
import { useQuery } from "@tanstack/react-query";
import { url } from "../empleados/useEmployeeUrl";

async function getOfficeUrl() {
  return (await backendClient.get<url>('api/profile/office-url')).data;
}

export default function useOfficeUrl() {
  return useQuery({
    queryKey: ['office', 'url'],
    queryFn: getOfficeUrl,
  });
}