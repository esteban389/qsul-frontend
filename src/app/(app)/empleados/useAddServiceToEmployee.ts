import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import revalidateEmployees from '@/app/(app)/empleados/revalidateEmployees';

function sendRequest(employeeId: number, serviceId: number) {
  return backendClient.post(`api/employees/${employeeId}/services`, {
    service_id: serviceId,
  });
}

export default function useAddServiceToEmployee({
  employeeId,
  serviceId,
}: {
  employeeId: number;
  serviceId: number;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(employeeId, serviceId),
    onSettled: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
    onSuccess: () => revalidateEmployees(),
  });
}
