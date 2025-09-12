import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function RestoreAnswer(id: number) {
  return backendClient.post(`/api/answers/${id}/restore`);
}

export default function useRestoreAnswer(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['restoreAnswer', id],
    mutationFn: () => RestoreAnswer(id),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['answers', id],
      }),
  });
}
