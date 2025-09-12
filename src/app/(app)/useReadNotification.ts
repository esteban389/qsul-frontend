import backendClient from '@/services/backendClient';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export default function useReadlNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (notificationId: string) => {
      await backendClient.post(`api/notifications/${notificationId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
  });
}
