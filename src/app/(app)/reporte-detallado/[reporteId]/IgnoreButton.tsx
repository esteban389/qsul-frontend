import { Answer } from '@/types/answer';
import React from 'react';
import { Button } from '@/components/ui/button';
import CreateObsrvationDialog from './CreateObsrvationDialog';
import useRestoreAnswer from './useRestoreAnswer';
import { toast } from 'sonner';

export default function IgnoreButton({ answer }: { answer: Answer }) {
  const restoreMutation = useRestoreAnswer(answer.id);
  const handleRestore = () => toast.promise(restoreMutation.mutateAsync(), {
    loading: 'Restaurando...',
    success: 'Restaurado',
    error: 'Error al restaurar',
  });
  if (answer.deleted_at) return <Button onClick={handleRestore} disabled={restoreMutation.isPending}>Restaurar</Button>;
  return <CreateObsrvationDialog willIgnore />;
}
