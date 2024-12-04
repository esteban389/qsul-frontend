import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Campus } from '@/types/campus';
import { ChangeEvent, ReactNode, useState } from 'react';
import { getInitials } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  CampusAddressSchema,
  CampusIconSchema,
  CampusNameSchema,
  OptionalCampusIconSchema,
} from '@/Schemas/UniversitySchema';
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import ErrorText from '@/components/ui/ErrorText';
import { Button } from '@/components/ui/button';
import useDeleteCampus from '@/app/(app)/seccionales/useDeleteCampus';
import { toast } from 'sonner';
import useRestoreCampus from '@/app/(app)/seccionales/useRestoreCampus';
import { AxiosError } from 'axios';
import useUpdateCampus from '@/app/(app)/seccionales/useUpdateCampus';
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

export default function CampusDetailsSheet({
  campus,
  children,
}: Readonly<{
  campus: Campus;
  children: ReactNode;
}>) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <CampusSheetContent campus={campus} />
      </SheetContent>
    </Sheet>
  );
}

function CampusSheetContent({ campus }: Readonly<{ campus: Campus }>) {
  const imgSrc = campus.icon ? env('API_URL') + campus.icon : '/';
  const [icon, setIcon] = useState<File | null>();
  const [name, setName] = useState(campus.name);
  const [address, setAddress] = useState(campus.address);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const can = useAuthorize();
  const updateMutation = useUpdateCampus(campus.id, {
    icon,
    name,
    address,
  });
  const deleteMutation = useDeleteCampus(campus.id);
  const restoreMutation = useRestoreCampus(campus.id);

  const onUpdate = () => {
    const iconResult = safeParse(OptionalCampusIconSchema, icon);
    const nameResult = safeParse(CampusNameSchema, name);
    const addressResult = safeParse(CampusAddressSchema, address);
    if (!iconResult.success || !nameResult.success || !addressResult.success) {
      setErrors({
        icon: iconResult.success ? undefined : iconResult.issues[0].message,
        name: nameResult.success ? undefined : nameResult.issues[0].message,
        address: addressResult.success
          ? undefined
          : addressResult.issues[0].message,
      });
      return;
    }
    toast.promise(updateMutation.mutateAsync(), {
      loading: `Actualizando a ${campus.name}`,
      success: `${campus.name} ha sido actualizado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al actualizar a ${campus.name}`;
      },
    });
  };

  const onDelete = () => {
    toast.promise(deleteMutation.mutateAsync(), {
      loading: `Eliminando a ${campus.name}`,
      success: `${campus.name} ha sido eliminado`,
      error: error => {
        if (error instanceof AxiosError) {
          const body = error.response?.data;
          if (body && 'message' in body) {
            return body.message;
          }
          return `Ocurrió un error inesperado: ${error.message}`;
        }
        return `Error al eliminar a ${campus.name}`;
      },
    });
  };

  const onRestore = () => {
    toast.promise(restoreMutation.mutateAsync(), {
      loading: `Restaurando a ${campus.name}`,
      success: `${campus.name} ha sido restaurado`,
      error: `Error al restaurar a ${campus.name}`,
    });
  };

  const onIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];
    setIcon(file);
    const result = safeParse(CampusIconSchema, file);
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
    const result = safeParse(CampusNameSchema, value);
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

  const onAddressChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setAddress(value);
    const result = safeParse(CampusAddressSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        address: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      address: result.issues[0].message,
    });
  };
  return (
    <>
      <SheetTitle>Detalles: {campus.name}</SheetTitle>
      <div className="grow space-y-4 p-4">
        <div className="flex items-center space-x-4">
          <Avatar>
            <AvatarImage
              src={icon ? URL.createObjectURL(icon) : imgSrc}
              alt={campus.name}
            />
            <AvatarFallback>{getInitials(campus.name)}</AvatarFallback>
          </Avatar>
          {can('update', 'campus') && (
            <div>
              <Input name="icon" onChange={onIconChange} type="file" />
              {errors?.icon && <ErrorText>{errors.icon}</ErrorText>}
            </div>
          )}
        </div>
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input value={name} name="name" onChange={onNameChange} />
          {errors?.name && <ErrorText>{errors.name}</ErrorText>}
        </div>
        <div>
          <Label htmlFor="address">Dirección</Label>
          <Input value={address} name="address" onChange={onAddressChange} />
          {errors?.address && <ErrorText>{errors.address}</ErrorText>}
        </div>
      </div>
      <SheetFooter>
        {can('delete', 'campus') && (
          <SheetClose asChild>
            {campus.deleted_at ? (
              <Button variant="ghost" onClick={onRestore}>
                Restaurar
              </Button>
            ) : (
              <DeleteCampusAlert name={campus.name} action={onDelete}>
                <Button variant="destructive">Eliminar</Button>
              </DeleteCampusAlert>
            )}
          </SheetClose>
        )}
        {can('update', 'campus') && (
          <SheetClose asChild>
            <Button onClick={onUpdate}>Actualizar</Button>
          </SheetClose>
        )}
      </SheetFooter>
    </>
  );
}
function DeleteCampusAlert({
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
          <AlertDialogTitle>Eliminar seccional {name}</AlertDialogTitle>
          <AlertDialogDescription>
            ¿Estás seguro de que deseas eliminar la seccional {name}?
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
