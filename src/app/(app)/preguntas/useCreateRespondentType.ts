import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function CreateRespondentType(name: string) {
  return backendClient.post('/api/respondent-types', { name });
}

export default function useCreateRespondentType(name: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => CreateRespondentType(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['respondent-types'] });
    },
  });
}
