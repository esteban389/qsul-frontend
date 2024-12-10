import backendClient from '@/services/backendClient';
import { Employee } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';

export type ServiceFilters = {
  name?: string;
  deleted_at?: string;
  include?: string[];
};

async function getEmployees(filters: ServiceFilters = {}) {
  const params = {
    'filter[name]': filters.name,
    'filter[deleted_at]': filters.deleted_at,
    include: filters.include && filters.include.join(','),
  };

  const response = await backendClient.get<Employee[]>('api/employees', {
    params,
  });
  return response.data;
}

export default function useEmployees(filters: ServiceFilters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => getEmployees(filters),
  });
}
