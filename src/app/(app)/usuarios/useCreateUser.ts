import { CreateUserRequest } from '@/types/user';
import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

function sendRequest(request: CreateUserRequest) {
  return backendClient.post('/register', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useCreateUser(request: CreateUserRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(request),
    onSettled: async () => {
      return queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
}
