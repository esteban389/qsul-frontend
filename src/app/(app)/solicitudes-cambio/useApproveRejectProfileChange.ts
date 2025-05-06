import { useMutation, useQueryClient } from '@tanstack/react-query';
import backendClient from '@/services/backendClient';

export function useApproveProfileChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => backendClient.post(`/api/profile/approve-change/${id}`, { action: 'approve' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-profile-changes'] });
    },
  });
}

export function useRejectProfileChange() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => backendClient.post(`/api/profile/approve-change/${id}`, { action: 'reject' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pending-profile-changes'] });
    },
  });
}
