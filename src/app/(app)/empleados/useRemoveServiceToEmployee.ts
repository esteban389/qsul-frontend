import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function sendRequest(employeeId: number, serviceId: number) {
  return backendClient.delete(
    `api/employees/${employeeId}/services/${serviceId}`,
  );
}

export default function useRemoveServiceToEmployee({
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
  });
}
