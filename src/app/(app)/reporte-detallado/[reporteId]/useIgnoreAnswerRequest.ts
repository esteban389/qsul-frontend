import backendClient from '@/services/backendClient';
import { CreateObservationRequest } from '@/types/obserations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function IgnoreResult(request: CreateObservationRequest) {
  return backendClient.post(`api/answers/${request.answer_id}/ignore`, request);
}

export default function useIgnoreAnswerRequest(
  request: CreateObservationRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['ignoreAnswer', request.answer_id],
    mutationFn: () => IgnoreResult(request),
    onSettled: () =>
      queryClient.invalidateQueries({
        queryKey: ['answers', request.answer_id],
      }),
  });
}
