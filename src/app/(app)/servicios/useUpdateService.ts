import { UpdateServiceRequest } from '@/types/service';
import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import revalidateServices from '@/app/(app)/servicios/revalidateServices';

function sendRequest(id: number, data: UpdateServiceRequest) {
  return backendClient.post(`/api/services/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useUpdateService(
  id: number,
  data: UpdateServiceRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['services'] }),
    onSuccess: () => revalidateServices(),
  });
}
