import backendClient from '@/services/backendClient';
import { Service } from '@/types/service';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

export type ServiceFilters = {
  name?: string;
  deleted_at?: string;
  process_id?: number;
  includeProcess?: boolean;
};

async function getServices(filters: ServiceFilters = {}) {
  const params = {
    'filter[name]': filters.name,
    'filter[deleted_at]': filters.deleted_at,
    'filter[process_id]': filters.process_id,
    include: filters.includeProcess ? 'process' : undefined,
  };

  const response = await backendClient.get<Service[]>('api/services', {
    params,
  });
  return response.data;
}

export default function useServices(
  filters: ServiceFilters = {},
  options: Omit<UseQueryOptions<Service[]>, 'queryKey' | 'queryFn'> = {},
) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
    ...options,
  });
}
