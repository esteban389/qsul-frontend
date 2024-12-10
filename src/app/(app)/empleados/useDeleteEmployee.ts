import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function sendRequest(id: number) {
  return backendClient.delete(`/api/employees/${id}`);
}

export default function useDeleteEmployee(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['employees'] });
    },
  });
}
