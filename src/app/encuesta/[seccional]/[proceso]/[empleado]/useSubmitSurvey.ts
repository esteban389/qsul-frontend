import backendClient from '@/services/backendClient';
import { AnswerSurveyRequest } from '@/types/survey';
import { useMutation } from '@tanstack/react-query';

async function submitSurvey(request: AnswerSurveyRequest) {
  return backendClient.post('/api/answers', request);
}

export default function useSubmitSurvey(request: AnswerSurveyRequest) {
  return useMutation({
    mutationFn: () => submitSurvey(request),
  });
}
