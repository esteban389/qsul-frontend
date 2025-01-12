import backendClient from "@/services/backendClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function DeleteRespondentType(id: number) {
  return backendClient.delete(`api/respondent-types/${id}`);
}

export default function useDeleteRespondentType(id: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => DeleteRespondentType(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respondent-types'] });
    }
  })
}