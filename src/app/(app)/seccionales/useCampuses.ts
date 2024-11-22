import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Campus } from '@/types/campus';

export type CampusesFilters = {
  name?: string;
  deleted_at?: string;
};

async function getData(filters?: CampusesFilters) {
  const queryParams = {
    'filter[name]': filters?.name,
    'filter[deleted_at]': filters?.deleted_at,
  };
  const response = await backendClient.get<Campus[]>('/api/campuses', {
    params: queryParams,
  });
  return response.data;
}

export default function useUsers(filters?: CampusesFilters) {
  return useQuery({
    queryKey: ['campuses', filters],
    queryFn: () => getData(filters),
  });
}
