import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ChangeEvent, ReactNode, useEffect, useState } from 'react';
import { downloadURI, getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  OptionalProcessIconSchema,
  ProcessIconSchema,
  ProcessNameSchema,
} from '@/Schemas/UniversitySchema';
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import ErrorText from '@/components/ui/ErrorText';
import { Button } from '@/components/ui/button';
import useDeleteProcess from '@/app/(app)/procesos/useDeleteProcess';
import { toast } from 'sonner';
import useRestoreProcess from '@/app/(app)/procesos/useRestoreProcess';
import { AxiosError } from 'axios';
import useUpdateProcess from '@/app/(app)/procesos/useUpdateProcess';
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
import { Process } from '@/types/process';
import useProcessByToken from '@/app/(app)/procesos/useProcessByToken';
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
import useAuth from '@/hooks/useAuth';
import QRCode from 'qrcode';
import { Role } from '@/types/user';
import { Dialog, DialogContent, DialogDescription, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import useProcessUrl from './useProcessUrl';
import { LoaderCircle } from 'lucide-react';

export default function ProcessDetailsSheet({
  process,
  children,
}: Readonly<{
  process: Process;
  children: ReactNode;
}>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <ProcessSheetContent process={process} />
      </SheetContent>
    </Sheet>
  );
}

function ProcessSheetContent({ process }: Readonly<{ process: Process }>) {
  const imgSrc = process.icon ? env('API_URL') + process.icon : '/';
  const [icon, setIcon] = useState<File | null>();
  const [name, setName] = useState(process.name);
  const [parent, setParent] = useState<number | null>(process.parent_id);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const can = useAuthorize();
  const {
    data: processes,
    isSuccess: isProcessesSuccess,
    isPending: isProcessesPending,
  } = useProcesses({
    deleted_at: 'null',
  });
  const updateMutation = useUpdateProcess(process.id, {
    icon,
    name,
    parent_id: parent === 0 ? null : parent,
  });
  const {
    data: processDetails,
    isPending,
    isSuccess,
  } = useProcessByToken(process.token);

  const deleteMutation = useDeleteProcess(process.id);
  const restoreMutation = useRestoreProcess(process.id);

  const onUpdate = () => {
    const iconResult = safeParse(OptionalProcessIconSchema, icon);
    const nameResult = safeParse(ProcessNameSchema, name);
    if (!iconResult.success || !nameResult.success) {
      setErrors({
        icon: iconResult.success ? undefined : iconResult.issues[0].message,
        name: nameResult.success ? undefined : nameResult.issues[0].message,
      });
      return;
    }
    toast.promise(updateMutation.mutateAsync(), {
      loading: `Actualizando a ${process.name}`,
      success: `${process.name} ha sido actualizado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al actualizar a ${process.name}`;
      },
    });
  };

  const onDelete = () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: `Desactivando a ${process.name}`,
      success: `${process.name} ha sido desactivado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al desactivar a ${process.name}`;
      },
    });
  };

  const onRestore = () => {
    toast.promise(restoreMutation.mutateAsync(), {
      loading: `Restaurando a ${process.name}`,
      success: `${process.name} ha sido restaurado`,
      error: `Error al restaurar a ${process.name}`,
    });
  };

  const onIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];
    setIcon(file);
    const result = safeParse(ProcessIconSchema, file);
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
    const result = safeParse(ProcessNameSchema, value);
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
    setParent(Number(value));
    setErrors({
      ...errors,
      parent: undefined,
    });
  };

  const { data: url } = useProcessUrl(process.id);

  return (
    <>
      <SheetTitle>Detalles: {process.name}</SheetTitle>
      <ScrollArea className="h-full">
        <div className="grow space-y-4 p-4">
          <div className="flex items-center justify-center space-x-4">
            <Avatar>
              <AvatarImage
                src={icon ? URL.createObjectURL(icon) : imgSrc}
                alt={process.name}
              />
              <AvatarFallback>{getInitials(process.name)}</AvatarFallback>
            </Avatar>
            {can('update', 'process') && (
              <div>
                <Input name="icon" onChange={onIconChange} type="file" />
                {errors?.icon && <ErrorText>{errors.icon}</ErrorText>}
              </div>
            )}
            <QRCodeButton url={url?.url} processName={process.name} />
          </div>
          <div>
            <Label htmlFor="name">Nombre</Label>
            <Input
              value={name}
              name="name"
              onChange={onNameChange}
              disabled={!can('update', 'process')}
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
                disabled={!can('update', 'process')}
                value={parent ? String(parent) : undefined}>
                <SelectTrigger className="h-fit">
                  <SelectValue placeholder="Asociar con un proceso padre" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  <SelectGroup>
                    <SelectItem value="0">
                      <div className="flex flex-row items-center gap-4">
                        Sin proceso padre
                      </div>
                    </SelectItem>
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
          {isPending && (
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          )}
          {isSuccess && processDetails.sub_processes.length > 0 && (
            <div>
              <Label>Sub procesos</Label>
              <ul className="w-full space-y-4">
                {processDetails.sub_processes.map(subProcess => (
                  <li
                    key={subProcess.id}
                    className="flex w-full flex-row items-center gap-4 rounded border border-input p-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          subProcess.icon
                            ? env('API_URL') + subProcess.icon
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        {getInitials(process.name)}
                      </AvatarFallback>
                    </Avatar>
                    {subProcess.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {isSuccess && processDetails.services.length > 0 && (
            <div>
              <Label>Servicios</Label>
              <ul className="w-full space-y-4">
                {processDetails.services.map(service => (
                  <li
                    key={service.id}
                    className="flex w-full flex-row items-center gap-4 rounded border border-input p-2">
                    <Avatar>
                      <AvatarImage
                        src={
                          service.icon
                            ? env('API_URL') + service.icon
                            : undefined
                        }
                      />
                      <AvatarFallback>
                        {getInitials(service.name)}
                      </AvatarFallback>
                    </Avatar>
                    {service.name}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
      <SheetFooter>
        {can('delete', 'process') && (
          <SheetClose asChild>
            {process.deleted_at ? (
              <Button variant="ghost" onClick={onRestore}>
                Restaurar
              </Button>
            ) : (
              <DeleteProcessAlert name={process.name} action={onDelete}>
                <Button variant="destructive">Desactivar</Button>
              </DeleteProcessAlert>
            )}
          </SheetClose>
        )}
        {can('update', 'process') && (
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
          <AlertDialogTitle>Desactivar proceso {name}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas desactivar el proceso {name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={action}>Desactivar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function QRCodeButton({
  url,
  processName,
}: Readonly<{
  url: string | undefined;
  processName: string;
}>) {
  const { user } = useAuth({ middleware: 'auth' });
  const canSeeQRCode = user?.role === Role.CAMPUS_COORDINATOR;
  if (!canSeeQRCode) {
    return null;
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Código QR de Encuesta</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Código QR de Encuesta</DialogTitle>
        <DialogDescription className="sr-only">
          Código QR para la encuesta de {processName}
        </DialogDescription>
        <QRCodeView url={url} name={processName} />
      </DialogContent>
    </Dialog>
  );
}

function QRCodeView({
  url,
  name,
}: Readonly<{
  url: string | undefined;
  name: string;
}>) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  useEffect(() => {
    const toDataUrl = async () => {
      const result = await QRCode.toDataURL(url);
      setDataUrl(result);
    };
    if (url) {
      toDataUrl();
    }
  }, [url]);
  if (!dataUrl) {
    return (
      <div className="flex h-48 w-full items-center justify-center">
        <LoaderCircle className="size-12 animate-spin" />
      </div>
    );
  }
  const copyToClipboard = () => {
    navigator.clipboard.writeText(String(url));
    toast.info('Código QR copiado al portapapeles');
  };
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <img src={dataUrl || ''} alt="QR Code" />
      <Button onClick={() => copyToClipboard()}>
        Copiar
      </Button>
      <Button onClick={() => downloadURI(dataUrl || '', `Código QR ${name}`)}>
        Descargar
      </Button>
    </div>
  );
}