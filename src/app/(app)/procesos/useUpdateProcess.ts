import { UpdateProcessRequest } from '@/types/process';
import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function sendRequest(id: number, request: UpdateProcessRequest) {
  return backendClient.post(`/api/processes/${id}`, request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useUpdateProcess(
  id: number,
  request: UpdateProcessRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id, request),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
  });
}
