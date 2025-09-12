import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useReadAllNotifications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      await backendClient.post('api/notifications/read');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
