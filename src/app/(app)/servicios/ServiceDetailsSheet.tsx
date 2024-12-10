import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChangeEvent, ReactNode, useState } from 'react';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  OptionalServiceIconSchema,
  ServiceNameSchema,
} from '@/Schemas/UniversitySchema';
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import ErrorText from '@/components/ui/ErrorText';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AxiosError } from 'axios';
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useProcesses from '@/app/(app)/procesos/useProcesses';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Service } from '@/types/service';
import useUpdateService from './useUpdateService';
import useDeleteService from './useDeleteService';
import useRestoreService from './useRestoreService';

export default function ServiceDetailsSheet({
  service,
  children,
}: Readonly<{
  service: Service;
  children: ReactNode;
}>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <ServiceSheetContent service={service} />
      </SheetContent>
    </Sheet>
  );
}

function ServiceSheetContent({ service }: Readonly<{ service: Service }>) {
  const imgSrc = service.icon ? env('API_URL') + service.icon : '/';
  const [icon, setIcon] = useState<File | null>();
  const [name, setName] = useState(service.name);
  const [process, setProcess] = useState<number>(service.process_id);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const can = useAuthorize();
  const {
    data: processes,
    isSuccess: isProcessesSuccess,
    isPending: isProcessesPending,
  } = useProcesses({
    deleted_at: 'null',
  });
  const updateMutation = useUpdateService(service.id, {
    icon,
    name,
    process_id: process,
  });

  const deleteMutation = useDeleteService(service.id);
  const restoreMutation = useRestoreService(service.id);

  const onUpdate = () => {
    const iconResult = safeParse(OptionalServiceIconSchema, icon);
    const nameResult = safeParse(ServiceNameSchema, name);
    if (!iconResult.success || !nameResult.success) {
      setErrors({
        icon: iconResult.success ? undefined : iconResult.issues[0].message,
        name: nameResult.success ? undefined : nameResult.issues[0].message,
      });
      return;
    }
    toast.promise(updateMutation.mutateAsync(), {
      loading: `Actualizando a ${service.name}`,
      success: `${service.name} ha sido actualizado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al actualizar a ${service.name}`;
      },
    });
  };

  const onDelete = () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: `Eliminando a ${service.name}`,
      success: `${service.name} ha sido eliminado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al eliminar a ${service.name}`;
      },
    });
  };

  const onRestore = () => {
    toast.promise(restoreMutation.mutateAsync(), {
      loading: `Restaurando a ${service.name}`,
      success: `${service.name} ha sido restaurado`,
      error: `Error al restaurar a ${service.name}`,
    });
  };

  const onIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];
    setIcon(file);
    const result = safeParse(OptionalServiceIconSchema, file);
    if (result.success) {
      setErrors({
        ...errors,
        icon: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      icon: result.issues[0].message,
    });
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    const result = safeParse(ServiceNameSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        name: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      name: result.issues[0].message,
    });
  };

  const onProcessChange = (value: string) => {
    setProcess(Number(value));
    setErrors({
      ...errors,
      parent: undefined,
    });
  };
  return (
    <>
      <SheetTitle>Detalles: {service.name}</SheetTitle>
      <ScrollArea className="h-full">
        <div className="grow space-y-4 p-4">
          <div className="flex items-center justify-center space-x-4">
            <Avatar>
              <AvatarImage
                src={icon ? URL.createObjectURL(icon) : imgSrc}
                alt={service.name}
              />
              <AvatarFallback>{getInitials(service.name)}</AvatarFallback>
            </Avatar>
            {can('update', 'service') && (
              <div>
                <Input name="icon" onChange={onIconChange} type="file" />
                {errors?.icon && <ErrorText>{errors.icon}</ErrorText>}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              value={name}
              name="name"
              onChange={onNameChange}
              disabled={!can('update', 'service')}
            />
            {errors?.name && <ErrorText>{errors.name}</ErrorText>}
          </div>
          {isProcessesPending && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}
          {isProcessesSuccess && (
            <div>
              <Label htmlFor="parent">Proceso padre</Label>
              <Select
                name="parent"
                onValueChange={onProcessChange}
                disabled={!can('update', 'service')}
                value={process ? String(process) : undefined}>
                <SelectTrigger className="h-fit">
                  <SelectValue placeholder="Asociar con un proceso" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectGroup>
                    {processes.map(process => (
                      <SelectItem value={String(process.id)} key={process.id}>
                        <div className="flex flex-row items-center gap-4">
                          <Avatar>
                            <AvatarImage
                              src={
                                process.icon
                                  ? env('API_URL') + process.icon
                                  : undefined
                              }
                            />
                            <AvatarFallback>
                              {getInitials(process.name)}
                            </AvatarFallback>
                          </Avatar>
                          {process.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              {errors?.parent && <ErrorText>{errors.parent}</ErrorText>}
            </div>
          )}
        </div>
      </ScrollArea>
      <SheetFooter>
        {can('delete', 'service') && (
          <SheetClose asChild>
            {service.deleted_at ? (
              <Button variant="ghost" onClick={onRestore}>
                Restaurar
              </Button>
            ) : (
              <DeleteProcessAlert name={service.name} action={onDelete}>
                <Button variant="destructive">Eliminar</Button>
              </DeleteProcessAlert>
            )}
          </SheetClose>
        )}
        {can('update', 'service') && (
          <SheetClose asChild>
            <Button onClick={onUpdate}>Actualizar</Button>
          </SheetClose>
        )}
      </SheetFooter>
    </>
  );
}

function DeleteProcessAlert({
  children,
  name,
  action,
}: Readonly<{
  children: ReactNode;
  name: string;
  action: () => void;
}>) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Eliminar proceso {name}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar el proceso {name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Eliminar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
