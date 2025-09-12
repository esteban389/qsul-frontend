import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import useNotifications from '@/app/(app)/useNotifications';
import useReadAllNotifications from '@/app/(app)/useReadAllNotifications';
import { NotificationType, Notification } from '@/types/notification';
import useReadNotification from '@/app/(app)/useReadNotification';
import { formatDate } from '@/lib/utils';
import { twMerge } from 'tailwind-merge';

const NotificationsDropdown = () => {
  const [open, setOpen] = useState(false);

  const { data: unreadNotifications = [] } = useNotifications(true);
  const { data: allNotifications = [] } = useNotifications(false);

  const unreadCount = unreadNotifications.filter(n => !n.read_at).length;
  const displayCount = unreadCount > 9 ? '9+' : unreadCount;

  const markAsReadMutation = useReadNotification();
  const markAllAsReadMutation = useReadAllNotifications();

  const getIcon = (type: NotificationType): React.ReactNode => {
    switch (type) {
      case 'danger':
        return <AlertCircle className="size-4 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="size-4 text-amber-500" />;
      case 'info':
        return <Info className="size-4 text-blue-500" />;
      case 'success':
        return <CheckCircle2 className="size-4 text-green-500" />;
      default:
        return null;
    }
  };

  const getTypeStyles = (type: NotificationType) => {
    switch (type) {
      case 'danger':
        return 'bg-red-50 border-l-4 border-red-500';
      case 'warning':
        return 'bg-amber-50 border-l-4 border-amber-500';
      case 'info':
        return 'bg-blue-50 border-l-4 border-blue-500';
      case 'success':
        return 'bg-green-50 border-l-4 border-green-500';
      default:
        return 'bg-white';
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={twMerge(
            'relative rounded-full p-2 transition-transform',
            unreadCount > 0 && 'animateNotificationsBell',
          )}>
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -right-1 -top-1">
              <Badge
                variant="destructive"
                className="size-4 justify-center rounded-full p-0 text-xs">
                {displayCount}
              </Badge>
            </motion.div>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-96 max-w-[calc(100vw-2rem)] p-0"
        align="end">
        <Tabs defaultValue="unread" className="w-full">
          <div className="flex items-center justify-between border-b p-4">
            <TabsList className="grid w-[200px] grid-cols-2">
              <TabsTrigger value="unread">Sin leer</TabsTrigger>
              <TabsTrigger value="all">Todas</TabsTrigger>
            </TabsList>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
                onClick={() => markAllAsReadMutation.mutate()}>
                <Check className="mr-1 size-3" />
                Marcar todas como leídas
              </Button>
            )}
          </div>

          <TabsContent value="unread" className="mt-0">
            <NotificationsList
              notifications={unreadNotifications}
              getIcon={getIcon}
              getTypeStyles={getTypeStyles}
              onMarkAsRead={id => markAsReadMutation.mutate(id)}
            />
          </TabsContent>

          <TabsContent value="all" className="mt-0">
            <NotificationsList
              notifications={allNotifications}
              getIcon={getIcon}
              getTypeStyles={getTypeStyles}
              onMarkAsRead={id => markAsReadMutation.mutate(id)}
            />
          </TabsContent>
        </Tabs>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface NotificationsListProps {
  notifications: Notification[];
  getIcon: (type: NotificationType) => React.ReactNode;
  getTypeStyles: (type: NotificationType) => string;
  onMarkAsRead: (id: string) => void;
}

const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  getIcon,
  getTypeStyles,
  onMarkAsRead,
}) => (
  <ScrollArea className="h-[calc(100vh-20rem)] max-h-[450px]">
    <AnimatePresence>
      {notifications.map((notification, index) => (
        <motion.div
          key={notification.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ delay: index * 0.1 }}>
          <DropdownMenuItem
            className={`flex cursor-pointer gap-4 p-4 ${getTypeStyles(notification.data.type)}`}
            onClick={() => onMarkAsRead(notification.id)}>
            <div className="flex size-10 items-center justify-center rounded-full bg-white">
              {getIcon(notification.data.type)}
            </div>
            <div className="flex-1">
              <p className="font-medium">{notification.data.title}</p>
              <p className="text-sm text-slate-500">
                {notification.data.message}
              </p>
              <p className="mt-1 text-xs text-slate-400">
                {formatDate(notification.data.date, {
                  dateStyle: 'short',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            {!notification.read_at && (
              <div className="size-2 rounded-full bg-blue-500" />
            )}
          </DropdownMenuItem>
        </motion.div>
      ))}
    </AnimatePresence>

    {notifications.length === 0 && (
      <div className="p-8 text-center text-slate-500">Sin notificaciones</div>
    )}
  </ScrollArea>
);

export default NotificationsDropdown;
