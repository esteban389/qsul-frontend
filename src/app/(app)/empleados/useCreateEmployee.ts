import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateEmployeeRequest } from '@/types/employee';
import revalidateEmployees from '@/app/(app)/empleados/revalidateEmployees';

function sendRequest(request: CreateEmployeeRequest) {
  return backendClient.post('api/employees', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useCreateEmployee(request: CreateEmployeeRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(request),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
    onSuccess: () => revalidateEmployees(),
  });
}
