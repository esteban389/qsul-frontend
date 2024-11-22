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
import { getInitials, RolesTranslations } from '@/lib/utils';
import useDeleteUser from '@/app/(app)/usuarios/UseDeleteUser';
import { toast } from 'sonner';
import useRestoreUser from '@/app/(app)/usuarios/useRestoreUser';
import useUserById from '@/app/(app)/usuarios/useUserById';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuthorize } from '@/lib/authorizations';

export default function UserDetailsSheet({
  user,
  children,
}: {
  user: User;
  children: ReactNode;
}) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="flex h-full flex-col">
        <UserSheetContent user={user} />
      </SheetContent>
    </Sheet>
  );
}

function UserSheetContent({ user }: { user: User }) {
  const imgSrc = user.avatar ? env('API_URL') + user.avatar : '/';
  const can = useAuthorize();
  const deleteUserMutation = useDeleteUser(user.id);
  const restoreUserMutation = useRestoreUser(user.id);
  const { data: userDetails, isPending } = useUserById({ id: user.id });
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
    <>
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
          <p className="text-sm">{RolesTranslations[user.role]}</p>
        </div>
        {isPending && (
          <>
            <Skeleton className="mt-4 h-4 w-16" />
            <Skeleton className="mt-2 h-4 w-28" />
          </>
        )}
        {userDetails?.campus && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold">Campus</h4>
            <p className="text-sm">
              {userDetails?.campus.name} - {userDetails?.campus.address}
            </p>
          </div>
        )}
      </div>
      {can('delete', 'user') && (
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
      )}
    </>
  );
}
