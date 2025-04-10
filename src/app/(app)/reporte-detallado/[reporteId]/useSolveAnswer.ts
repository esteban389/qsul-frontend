import backendClient from '@/services/backendClient';
import { CreateObservationRequest } from '@/types/obserations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function SolveAnswer(request: CreateObservationRequest) {
  return backendClient.post(`api/answers/${request.answer_id}/solve`, {
    observation: request.description,
    type: request.type,
  });
}

export default function useSolveAnswer(
  request: CreateObservationRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['solveAnswer', request.answer_id],
    mutationFn: () => SolveAnswer(request),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['answers', request.answer_id],
      }),
  });
}

