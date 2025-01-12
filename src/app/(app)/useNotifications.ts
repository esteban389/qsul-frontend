import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';
import type { Notification } from '@/types/notification';

async function GetNotifications(unreadOnly: boolean) {
  if (unreadOnly) {
    return (await backendClient.get<Notification[]>('api/notifications/unread'))
      .data;
  }
  return (await backendClient.get<Notification[]>('api/notifications')).data;
}

export default function useNotifications(unreadOnly: boolean) {
  return useQuery({
    queryKey: ['notifications', 'unreadOnly', unreadOnly],
    queryFn: () => GetNotifications(unreadOnly),
    refetchInterval: 1000 * 60 * 2,
  });
}
