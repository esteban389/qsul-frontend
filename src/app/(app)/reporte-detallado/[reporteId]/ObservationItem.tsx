import { Observation } from '@/types/obserations';
import { formatDate } from '@/lib/utils';
import { Button, buttonVariants } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { motion } from 'framer-motion';
import useAuth from '@/hooks/useAuth';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import useDeleteObservation from './useDeleteObservation';

const ObservationTypeColors = {
  positive: 'bg-green-100 text-green-800',
  neutral: 'bg-blue-100 text-blue-800',
  negative: 'bg-red-100 text-red-800',
};

const ObservationTypeLabels = {
  positive: 'Positiva',
  neutral: 'Neutral',
  negative: 'Negativa',
};

export default function ObservationItem({
  observation,
}: {
  observation: Observation;
}) {
  const { user } = useAuth({ middleware: 'auth' });
  const deleteMutation = useDeleteObservation(Number(observation.id));
  const handleDelete = () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: 'Eliminando...',
      success: 'Observación eliminada',
      error: 'Error al eliminar',
    });
  };
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative rounded-lg border p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="grid gap-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-2 py-1 text-xs font-medium ${ObservationTypeColors[observation.type]}`}>
              {ObservationTypeLabels[observation.type]}
            </span>
            <span className="text-sm text-muted-foreground">
              por {observation.user.name}
            </span>
          </div>
          <p className="text-sm">{observation.description}</p>
          <p className="text-xs text-muted-foreground">
            {formatDate(observation.created_at, {
              dateStyle: 'medium',
              timeStyle: 'short',
            })}
          </p>
        </div>

        {observation.user_id === user?.id && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-red-600 hover:bg-red-100 hover:text-red-700">
                <Trash2 className="size-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Eliminar Observación</AlertDialogTitle>
                <AlertDialogDescription>
                  ¿Estás seguro de eliminar esta observación?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDelete}
                  className={buttonVariants({
                    variant: 'destructive',
                  })}>
                  Confirmar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </motion.div>
  );
}
