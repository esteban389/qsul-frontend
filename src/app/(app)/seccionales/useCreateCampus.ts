import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { CreateCampusRequest } from '@/types/campus';

function sendRequest(request: CreateCampusRequest) {
  return backendClient.post('/api/campuses', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useCreateCampus(request: CreateCampusRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequest(request),
    onSettled: async () => {
      return queryClient.invalidateQueries({ queryKey: ['campuses'] });
    },
  });
}
