'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/modal';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import {
  EmailSchema,
  UserAvatarSchema,
  UserCampusSchema,
  UserNameSchema,
} from '@/Schemas/AuthenticationSchemas';
import useCreateUser from '@/app/(app)/usuarios/useCreateUser';
import { Label } from '@/components/ui/label';
import ErrorText from '@/components/ui/ErrorText';
import { toast } from 'sonner';
import useAuth from '@/hooks/useAuth';
import UserDetailsSheet from '@/app/(app)/usuarios/UserDetailsSheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn, getInitials } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Role } from '@/types/user';
import { Rabbit, Search } from 'lucide-react';
import useCampuses from '@/app/(app)/seccionales/useCampuses';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import useUsers from './useUsers';
import columns from './TableDefinition';

function UsersPage() {
  const usersQuery = useUsers({});
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: usersQuery.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  const can = useAuthorize();

  return (
    <main className="mx-4 flex h-full flex-col items-center space-y-6 py-8">
      <h1 className="w-full text-center text-3xl font-bold">
        Administrar usuarios
      </h1>
      <div className="w-full max-w-[90%] space-y-4">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          {can('create', 'user') && (
            <Credenza>
              <CredenzaTrigger asChild>
                <Button>Crear usuario</Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CreateUserModal />
              </CredenzaContent>
            </Credenza>
          )}
          <div className="relative w-full max-w-lg">
            <Input
              placeholder="Armando Casas"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={e =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
            />
            <Search className="pointer-events-none absolute inset-y-0 right-0 mr-2 h-full text-muted-foreground" />
          </div>
        </div>
        <ScrollArea
          className={cn(
            'w-full rounded-md border-2 border-secondary shadow-md',
          )}>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map(headerGroup => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map(header => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {usersQuery.isSuccess && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <UserDetailsSheet key={row.id} user={row.original}>
                    <TableRow data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </UserDetailsSheet>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24">
                    <div className="flex w-full flex-col items-center justify-center py-8">
                      <Rabbit className="size-28 transition hover:-scale-x-100" />
                      <p className="ml-4 text-lg font-semibold">
                        Upps, parece que no hay usuarios
                      </p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="flex items-center justify-end space-x-2 py-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}>
            Anterior
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}>
            Siguiente
          </Button>
        </div>
      </div>
    </main>
  );
}

function CreateUserModal() {
  const { user } = useAuth({
    redirectIfAuthenticated: '/',
    middleware: 'auth',
  });
  const { data: campuses, isSuccess } = useCampuses({
    deleted_at: 'null',
  });
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [campus, setCampus] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const createUserMutation = useCreateUser({
    name,
    email,
    avatar,
    campus_id: campus ? Number(campus) : undefined,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameResult = safeParse(UserNameSchema, name);
    const emailResult = safeParse(EmailSchema, email);
    const avatarResult = safeParse(UserAvatarSchema, avatar);
    const campusResult = safeParse(UserCampusSchema, campus);
    if (
      nameResult.success &&
      emailResult.success &&
      avatarResult.success &&
      (campusResult.success || user?.role !== Role.NATIONAL_COORDINATOR)
    ) {
      toast.promise(createUserMutation.mutateAsync(), {
        loading: 'Creando usuario...',
        success: 'Usuario creado correctamente',
        error: 'Error al crear el usuario',
      });
      return;
    }
    setErrors({
      name: nameResult.issues && nameResult.issues[0].message,
      email: emailResult.issues && emailResult.issues[0].message,
      avatar: avatarResult.issues && avatarResult.issues[0].message,
      campus: campusResult.issues && campusResult.issues[0].message,
    });
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    const result = safeParse(UserNameSchema, value);
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

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    const result = safeParse(EmailSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        email: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      email: result.issues[0].message,
    });
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];

    setAvatar(file);
    const result = safeParse(UserAvatarSchema, file);
    if (result.success) {
      setErrors({
        ...errors,
        avatar: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      avatar: result.issues[0].message,
    });
  };

  const onCampusChange = (value: string) => {
    setCampus(value);
    const result = safeParse(UserCampusSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        campus: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      campus: result.issues[0].message,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-12">
      <CredenzaTitle className="mb-4">Crear usuario</CredenzaTitle>
      <CredenzaDescription className="sr-only">
        Crear un usuario
      </CredenzaDescription>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          name="name"
          placeholder="Elsa Pato"
          value={name}
          onChange={onNameChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          name="email"
          placeholder="elsa@ejemplo.com"
          value={email}
          onChange={onEmailChange}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="avatar">Imagen de perfil</Label>
        <Input name="avatar" type="file" onChange={onAvatarChange} />
        {errors.avatar && <ErrorText>{errors.avatar}</ErrorText>}
      </div>
      {user?.role === Role.NATIONAL_COORDINATOR && (
        <div>
          <Select onValueChange={onCampusChange}>
            <SelectTrigger className="h-fit">
              <SelectValue placeholder="Seleccionar seccional" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {isSuccess &&
                  campuses.map(campus => (
                    <SelectItem value={String(campus.id)}>
                      <div className="flex flex-row items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={
                              campus.icon
                                ? env('API_URL') + campus.icon
                                : undefined
                            }
                          />
                          <AvatarFallback>
                            {getInitials(campus.name)}
                          </AvatarFallback>
                        </Avatar>
                        {campus.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.campus && <ErrorText>{errors.campus}</ErrorText>}
        </div>
      )}
      <div className="flex w-full justify-center">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}

export default UsersPage;
