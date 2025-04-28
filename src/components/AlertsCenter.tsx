import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, AlertTriangle, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import useNotifications from '@/app/(app)/useNotifications';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

export default function AlertsCenter() {
  const { data: notifications = [] } = useNotifications(true); // Get all notifications

  // Filter for only danger and success notifications that are unread
  const importantAlerts = notifications.filter(
    notification =>
      notification.data.type === 'danger' ||
      notification.data.type === 'success',
  );

  if (importantAlerts.length === 0) {
    return (
      <div>
        <h2 className="text-center text-xl font-semibold">
          No hay notificaciones importantes.
        </h2>
        <p className="text-center text-gray-500">
          Vuelve más tarde para ver si hay novedades.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4 flex-1">
      <AnimatePresence>
        {importantAlerts.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.1 }}>
            <Alert
              variant={
                notification.data.type === 'danger' ? 'destructive' : 'default'
              }
              className="relative overflow-hidden">
              <div className="flex items-start gap-4">
                {notification.data.type === 'danger' ? (
                  <AlertTriangle className="mt-1 size-5" />
                ) : (
                  <AlertCircle className="mt-1 size-5" />
                )}
                <div className="flex-1">
                  <AlertTitle>{notification.data.title}</AlertTitle>
                  <AlertDescription className="mt-2">
                    {notification.data.message}
                  </AlertDescription>
                  <div className="mt-4 flex flex-row justify-between">
                    <Link
                      href={`/reporte-detallado/${notification.data.answer_id}`}
                      className="group inline-flex items-center text-sm font-medium hover:underline">
                      Ver más
                      <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.data.date, {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              {/* Add a colored border on the left side based on type */}
              <div
                className={`absolute inset-y-0 left-0 w-1 ${
                  notification.data.type === 'danger'
                    ? 'bg-red-600'
                    : 'bg-green-600'
                }`}
              />
            </Alert>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
