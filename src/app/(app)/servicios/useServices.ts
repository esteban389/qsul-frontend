import backendClient from '@/services/backendClient';
import { Service } from '@/types/service';
import { useQuery } from '@tanstack/react-query';

export type ServiceFilters = {
  name?: string;
  deleted_at?: string;
  includeProcess?: boolean;
};

async function getServices(filters: ServiceFilters = {}) {
  const params = {
    'filter[name]': filters.name,
    'filter[deleted_at]': filters.deleted_at,
    include: filters.includeProcess ? 'process' : undefined,
  };

  const response = await backendClient.get<Service[]>('api/services', {
    params,
  });
  return response.data;
}

export default function useServices(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ['services', filters],
    queryFn: () => getServices(filters),
  });
}
