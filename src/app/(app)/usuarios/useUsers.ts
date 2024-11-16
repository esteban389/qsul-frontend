import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import { Role, User } from '@/types/user';

export type UserQueryFilters = {
  name?: string;
  email?: string;
  date_created?: string;
  role?: Role;
};

async function getData(filters: UserQueryFilters) {
  const response = await backendClient.get<User[]>('/api/users', {
    params: filters,
  });
  return response.data;
}

export default function useUsers({
  name,
  email,
  date_created,
  role,
}: UserQueryFilters) {
  return useQuery({
    queryKey: ['users', { name, email, date_created, role }],
    queryFn: () => getData({ name, email, date_created, role }),
  });
}
