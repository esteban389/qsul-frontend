import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateEmployeeRequest } from '@/types/employee';

function sendRequest(id: number, data: UpdateEmployeeRequest) {
  return backendClient.post(`/api/employees/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useUpdateService(
  id: number,
  data: UpdateEmployeeRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(id, data),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });
}
