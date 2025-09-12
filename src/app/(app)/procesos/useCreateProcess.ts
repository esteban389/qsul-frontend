import backendClient from '@/services/backendClient';
import { CreateProcessRequest } from '@/types/process';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import revalidateProcesses from '@/app/(app)/procesos/revalidateProcesses';

function sendRequest(request: CreateProcessRequest) {
  return backendClient.post('/api/processes', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useCreateProcess(request: CreateProcessRequest) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendRequest(request),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
    onSuccess: () => revalidateProcesses(),
  });
}
