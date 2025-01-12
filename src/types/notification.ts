export type NotificationType = 'info' | 'success' | 'warning' | 'danger';

export type NotificationData = {
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  answer_id: number;
};

export type Notification = {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: string;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
};
