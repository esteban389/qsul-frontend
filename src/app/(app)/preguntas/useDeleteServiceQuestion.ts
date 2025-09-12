import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

async function DeleteQuestion(id: number) {
  return backendClient.delete(`/api/survey/questions/${id}`);
}

export default function useDeleteServiceQuestion() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ['questions', 'delete'],
    mutationFn: ({ id }: { id: number }) => DeleteQuestion(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['surveys', 'current'] }),
  });
}
