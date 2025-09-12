import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import revalidateServices from '@/app/(app)/servicios/revalidateServices';

function sendRequest(id: number) {
  return backendClient.patch(`/api/services/${id}`);
}

export default function useRestoreService(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onSuccess: () => revalidateServices(),
  });
}
