import backendClient from '@/services/backendClient';
import { UpdateServiceQuestionRequest } from '@/types/question';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function UpdateQuestion(params: UpdateServiceQuestionRequest) {
  return backendClient.post(
    `api/survey/questions/${params.question_id}`,
    params,
  );
}

export default function useUpdateServiceQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (params: UpdateServiceQuestionRequest) =>
      UpdateQuestion(params),
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: ['surveys', 'current'] }),
  });
}
