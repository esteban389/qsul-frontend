import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import { UserWithDetails } from '@/types/user';

async function getData(id: number) {
  const response = await backendClient.get<UserWithDetails>(`/api/users/${id}`);
  return response.data;
}

export default function useUserById({ id }: { id: number }) {
  return useQuery({
    queryKey: ['users', id],
    queryFn: () => getData(id),
  });
}
