import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { UpdateCampusRequest } from '@/types/campus';

function sendRequestUpdateCampus(id: number, data: UpdateCampusRequest) {
  return backendClient.post(`/api/campuses/${id}`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useUpdateCampus(id: number, data: UpdateCampusRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => sendRequestUpdateCampus(id, data),
    onSettled: () => {
      return queryClient.invalidateQueries({ queryKey: ['campuses'] });
    },
  });
}
