import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import revalidateProcesses from '@/app/(app)/procesos/revalidateProcesses';

function sendRequest(id: number) {
  return backendClient.patch(`/api/processes/${id}`);
}

export default function useRestoreProcess(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['processes'] });
    },
    onSuccess: () => revalidateProcesses(),
  });
}
