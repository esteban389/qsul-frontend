import backendClient from '@/services/backendClient';
import { NewSurveyVersionRequest } from '@/types/survey';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateNewVersion(request: NewSurveyVersionRequest) {
  return backendClient.post('/api/survey', request);
}

export default function useCreateNewSurvey() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ request }: { request: NewSurveyVersionRequest }) =>
      CreateNewVersion(request),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['surveys'] }),
  });
}
