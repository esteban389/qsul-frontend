import backendClient from "@/services/backendClient";
import { RequestProfileChangeRequest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function mutate(request: RequestProfileChangeRequest) {
  return backendClient.post('/api/profile/request-change', request);
}

export default function useRequestProfileChange(employee_id: number | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: RequestProfileChangeRequest) => mutate(request),
    mutationKey: ['requestProfileChange'],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employees', employee_id] })
      return queryClient.invalidateQueries({ queryKey: ['user'] });
    },
  })
}