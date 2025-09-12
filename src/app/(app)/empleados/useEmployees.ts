import backendClient from '@/services/backendClient';
import { Employee } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';

export type EmployeesFilters = {
  name?: string;
  deleted_at?: string;
  campus_id?: number;
  include?: string[];
};

async function getEmployees(filters: EmployeesFilters = {}) {
  const params = {
    'filter[name]': filters.name,
    'filter[deleted_at]': filters.deleted_at,
    'filter[campus_id]': filters.campus_id,
    include: filters.include && filters.include.join(','),
  };

  const response = await backendClient.get<Employee[]>('api/employees', {
    params,
  });
  return response.data;
}

export default function useEmployees(filters: EmployeesFilters = {}) {
  return useQuery({
    queryKey: ['employees', filters],
    queryFn: () => getEmployees(filters),
  });
}
