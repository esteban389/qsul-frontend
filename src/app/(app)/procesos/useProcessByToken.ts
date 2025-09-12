import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Process } from '@/types/process';

async function getProcess(token: string) {
  const response = await backendClient.get<Process>(`/api/processes/${token}`);
  return response.data;
}

export default function useProcessByToken(token: string) {
  return useQuery({
    queryKey: ['process', token],
    queryFn: () => getProcess(token),
  });
}
