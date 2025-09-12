import backendClient from '@/services/backendClient';
import { CreateObservationRequest } from '@/types/obserations';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateObservation(request: CreateObservationRequest) {
  return backendClient.post(
    `/api/answers/${request.answer_id}/observations`,
    request,
  );
}

export default function useCreateObservation(
  request: CreateObservationRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['observation', request],
    mutationFn: () => CreateObservation(request),
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ['answers', request.answer_id],
      });
    },
  });
}
