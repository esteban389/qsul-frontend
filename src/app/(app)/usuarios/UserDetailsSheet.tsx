import { User } from '@/types/user';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ReactNode } from 'react';
import env from '@/lib/env';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { getInitials } from '@/lib/utils';
import useDeleteUser from '@/app/(app)/usuarios/UseDeleteUser';
import { toast } from 'sonner';
import useRestoreUser from '@/app/(app)/usuarios/useRestoreUser';

// TODO add employee and campus info
export default function UserDetailsSheet({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  const imgSrc = user.avatar ? env('API_URL') + user.avatar : '/';
  const deleteUserMutation = useDeleteUser(user.id);
  const restoreUserMutation = useRestoreUser(user.id);
  const onDelete = () => {
    toast.promise(deleteUserMutation.mutateAsync(), {
      loading: `Deshabilitando a ${user.name}`,
      success: `${user.name} ha sido deshabilitado eliminado`,
      error: `Error al deshabilitar a ${user.name}`,
    });
  };
  const onRestore = () => {
    toast.promise(restoreUserMutation.mutateAsync(), {
      loading: `Restaurando a ${user.name}`,
      success: `${user.name} ha sido restaurado`,
      error: `Error al restaurar a ${user.name}`,
    });
  };
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <SheetTitle>Detalles: {user.name}</SheetTitle>
        <div className="grow p-4">
          <div className="flex items-center space-x-4">
            <Avatar>
              <AvatarImage src={imgSrc} alt={user.name} />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-lg font-semibold">{user.name}</h3>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Rol</h4>
            <p className="text-sm">{user.role}</p>
          </div>
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Campus</h4>
            <p className="text-sm">{user.campus_id}</p>
          </div>
        </div>
        <SheetFooter className="mt-auto">
          <SheetClose asChild>
            {user.deleted_at ? (
              <Button onClick={onRestore}>Restaurar</Button>
            ) : (
              <Button variant="destructive" onClick={onDelete}>
                Eliminate
              </Button>
            )}
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
