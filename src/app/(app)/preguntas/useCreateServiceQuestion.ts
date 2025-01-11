import backendClient from '@/services/backendClient';
import { CreateServiceQuestionRequest, Question } from '@/types/question';
import { Survey } from '@/types/survey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export async function createQuestion(params: CreateServiceQuestionRequest) {
  return backendClient.post(
    `/api/survey/questions/services/${params.service_id}`,
    params,
  );
}

export default function useCreateServiceQuestion(
  params: CreateServiceQuestionRequest,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['questions', 'create', params],
    mutationFn: () => createQuestion(params),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surveys', 'current'] }),
  });
}
