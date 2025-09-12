import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthorize } from '@/lib/authorizations';
import LoadingContent from '@/components/LoadingContent';
import { RespondentType } from '@/types/respondentType';
import useRespondentType from '@/app/encuesta/useRespondentType';
import QueryRenderer from '@/components/QueryRenderer';
import useCreateRespondentType from './useCreateRespondentType';
import useDeleteRespondentType from './useDeleteRespondentType';

// Animation variants
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: { duration: 0.2 },
  },
};

const RespondentTypesManager = () => {
  const can = useAuthorize();
  const query = useRespondentType();
  const [newType, setNewType] = useState('');
  const [isAddingType, setIsAddingType] = useState(false);
  const addTypeMutation = useCreateRespondentType(newType);

  const handleAddType = () => {
    if (!newType.trim()) return;

    toast.promise(addTypeMutation.mutateAsync(), {
      loading: 'Agregando tipo de encuestado...',
      success: 'Tipo de encuestado agregado exitosamente',
      error: 'Error al agregar tipo de encuestado',
    });

    setIsAddingType(false);
  };

  if (!can('create', 'respondent-type') && !can('delete', 'respondent-type')) {
    return null;
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mt-8 rounded-lg border border-slate-200 bg-white p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-800">
          Tipos de Encuestados
        </h2>
        <Dialog open={isAddingType} onOpenChange={setIsAddingType}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              Agregar Tipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agregar Tipo de Encuestado </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="type-name"> Nombre </Label>
                <Input
                  id="type-name"
                  value={newType}
                  onChange={e => setNewType(e.target.value)}
                  placeholder="Ingrese el nombre del tipo"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button variant="outline"> Cancelar </Button>
              </DialogClose>
              <Button onClick={handleAddType} disabled={!newType.trim()}>
                <Save size={16} className="mr-2" />
                Guardar
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          <QueryRenderer
            query={query}
            config={{
              pending: LoadingList,
              error: () => <div>Error</div>,
              success: RespondentTypesList,
              empty: EmptyList,
            }}
          />
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

function LoadingList() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}

function RespondentTypesList({ data: types }: { data: RespondentType[] }) {
  return (
    <>
      {types.map(type => (
        <RespondentTypeItem key={type.id} type={type} />
      ))}
    </>
  );
}

function RespondentTypeItem({ type }: { type: RespondentType }) {
  const deleteMutation = useDeleteRespondentType(type.id);
  const handleDeleteQuestion = () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: 'Eliminando tipo de encuestado...',
      success: 'Tipo de encuestado eliminado exitosamente',
      error: 'Error al eliminar tipo de encuestado',
    });
  };
  return (
    <motion.div
      key={type.id}
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-4">
      <span className="font-medium text-slate-700"> {type.name} </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleDeleteQuestion}
        className="text-red-600 hover:bg-red-50 hover:text-red-700">
        <Trash2 size={16} />
      </Button>
    </motion.div>
  );
}

function EmptyList() {
  return (
    <div className="py-8 text-center text-slate-500">
      No hay tipos de encuestados definidos
    </div>
  );
}
export default RespondentTypesManager;
