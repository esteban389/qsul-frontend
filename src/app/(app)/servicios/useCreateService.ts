import { CreateServiceRequest } from '@/types/service';
import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function sendRequest(request: CreateServiceRequest) {
  return backendClient.post('api/services', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useCreateService(request: CreateServiceRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(request),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
  });
}
