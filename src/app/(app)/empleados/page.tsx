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
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import { Label } from '@/components/ui/label';
import ErrorText from '@/components/ui/ErrorText';
import { toast } from 'sonner';
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
import { Bird, Search } from 'lucide-react';
import {
  EmployeeAvatarSchema,
  EmployeeEmailSchema,
  EmployeeNameSchema,
  EmployeeProcessSchema,
} from '@/Schemas/UniversitySchema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import useProcesses from '@/app/(app)/procesos/useProcesses';
import useEmployees from '@/app/(app)/empleados/useEmployees';
import useCreateEmployee from '@/app/(app)/empleados/useCreateEmployee';
import columns from './TableDefinition';
import EmployeeDetailsSheet from './EmployeeDetailsSheet';

function EmployeePage() {
  const employeesQuery = useEmployees({ include: ['process', 'services'] });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: employeesQuery.data || [],
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
        Administrar empleados
      </h1>
      <div className="w-full max-w-[90%] space-y-4">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          {can('create', 'employee') && (
            <Credenza>
              <CredenzaTrigger asChild>
                <Button>Crear empleado</Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CreateServiceModal />
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
              {employeesQuery.isSuccess && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <EmployeeDetailsSheet key={row.id} employee={row.original}>
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && 'selected'}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  </EmployeeDetailsSheet>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24">
                    <div className="flex w-full flex-col items-center justify-center py-8">
                      <Bird className="size-28 transition hover:-scale-x-100" />
                      <p className="ml-4 text-lg font-semibold">
                        Upps, parece que no hay empleados
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

function CreateServiceModal() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [process, setProcess] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { data: processes, isSuccess } = useProcesses({ deleted_at: 'null' });
  const createEmployeeMutation = useCreateEmployee({
    name,
    avatar: avatar as File,
    process_id: process as number,
    email,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameResult = safeParse(EmployeeNameSchema, name);
    const iconResult = safeParse(EmployeeAvatarSchema, avatar);
    const processResult = safeParse(EmployeeProcessSchema, process);
    if (nameResult.success && iconResult.success && processResult.success) {
      toast.promise(createEmployeeMutation.mutateAsync(), {
        loading: 'Creando seccional...',
        success: 'Seccional creado correctamente',
        error: 'Error al crear la seccional',
      });
      return;
    }
    setErrors({
      name: nameResult.issues && nameResult.issues[0].message,
      avatar: iconResult.issues && iconResult.issues[0].message,
      process: processResult.issues && processResult.issues[0].message,
    });
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    const result = safeParse(EmployeeNameSchema, value);
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
    const result = safeParse(EmployeeEmailSchema, value);
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
    const result = safeParse(EmployeeAvatarSchema, file);
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

  const onProcessChange = (value: string) => {
    setProcess(Number(value));
    setErrors({
      ...errors,
      process: undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-12">
      <CredenzaTitle className="mb-4">Crear un servicio</CredenzaTitle>
      <CredenzaDescription className="sr-only">
        Crear un empleado
      </CredenzaDescription>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          name="name"
          placeholder="Armando Casas"
          value={name}
          onChange={onNameChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="name">Correo electrónico</Label>
        <Input
          name="email"
          placeholder="armando@example.com"
          value={email}
          onChange={onEmailChange}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="avatar">Imagen del empleado</Label>
        <Input name="avatar" type="file" onChange={onAvatarChange} />
        {errors.avatar && <ErrorText>{errors.avatar}</ErrorText>}
      </div>
      <div>
        <Select onValueChange={onProcessChange}>
          <SelectTrigger className="h-fit">
            <SelectValue placeholder="Seleccionar proceso" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectGroup>
              {isSuccess &&
                processes.map(process => (
                  <SelectItem key={process.id} value={String(process.id)}>
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
        {errors.process && <ErrorText>{errors.process}</ErrorText>}
      </div>
      <div className="flex w-full justify-center">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}

export default EmployeePage;
