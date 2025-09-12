import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Process } from '@/types/process';

export type ProcessFilters = {
  name?: string;
  parent_id?: number;
  deleted_at?: string;
};

async function getProcesses(filters?: ProcessFilters) {
  const params = {
    'filter[name]': filters?.name,
    'filter[parent_id]': filters?.parent_id,
    'filter[deleted_at]': filters?.deleted_at,
  };
  const result = await backendClient.get<Process[]>('/api/processes', {
    params,
  });
  return result.data;
}

export default function useProcesses(filters?: ProcessFilters) {
  return useQuery({
    queryKey: ['processes', filters],
    queryFn: () => getProcesses(filters),
  });
}
