import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function DeleteObservation(id: number) {
  return backendClient.delete(`/api/observations/${id}`);
}

export default function useDeleteObservation(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['deleteObservation', id],
    mutationFn: () => DeleteObservation(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['answers'] }),
  });
}
