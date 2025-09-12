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
import { Fish, Search } from 'lucide-react';
import {
  OptionalProcessIconSchema,
  ProcessIconSchema,
  ProcessNameSchema,
} from '@/Schemas/UniversitySchema';
import useCreateProcess from '@/app/(app)/procesos/useCreateProcess';
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
import ProcessDetailsSheet from '@/app/(app)/procesos/ProcessDetailsSheet';
import useProcesses from './useProcesses';
import columns from './TableDefinition';

function CampusPage() {
  const processesQuery = useProcesses();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: processesQuery.data || [],
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
        Administrar procesos
      </h1>
      <div className="w-full max-w-[90%] space-y-4">
        <div className="flex w-full flex-col justify-between gap-4 md:flex-row">
          {can('create', 'process') && (
            <Credenza>
              <CredenzaTrigger asChild>
                <Button>Crear proceso</Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CreateProcessModal />
              </CredenzaContent>
            </Credenza>
          )}
          <div className="relative w-full max-w-lg">
            <Input
              placeholder="Docencia"
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
              {processesQuery.isSuccess && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <ProcessDetailsSheet process={row.original} key={row.id}>
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
                  </ProcessDetailsSheet>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24">
                    <div className="flex w-full flex-col items-center justify-center py-8">
                      <Fish className="size-28 transition hover:-scale-x-100" />
                      <p className="ml-4 text-lg font-semibold">
                        Upps, parece que no hay procesos
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

function CreateProcessModal() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [parent, setParent] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const { data: processes, isSuccess } = useProcesses({ deleted_at: 'null' });
  const createProcessMutation = useCreateProcess({
    name,
    icon,
    parent_id: parent,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameResult = safeParse(ProcessNameSchema, name);
    const iconResult = safeParse(OptionalProcessIconSchema, icon);
    if (nameResult.success && iconResult.success) {
      toast.promise(createProcessMutation.mutateAsync(), {
        loading: 'Creando proceso...',
        success: () => {
          return 'Proceso creado correctamente';
        },
        error: 'Error al crear el proceso',
      });
      return;
    }
    setErrors({
      name: nameResult.issues && nameResult.issues[0].message,
      icon: iconResult.issues && iconResult.issues[0].message,
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

  const onProcessChange = (value: string) => {
    setParent(Number(value));
    setErrors({
      ...errors,
      parent: undefined,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-12">
      <CredenzaTitle className="mb-4">Crear Proceso</CredenzaTitle>
      <CredenzaDescription className="sr-only">
        Crear un proceso
      </CredenzaDescription>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          name="name"
          placeholder="Docencia"
          value={name}
          onChange={onNameChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="icon">Ícono del campus</Label>
        <Input name="icon" type="file" onChange={onIconChange} />
        {errors.icon && <ErrorText>{errors.icon}</ErrorText>}
      </div>
      <div>
        <Select onValueChange={onProcessChange}>
          <SelectTrigger className="h-fit">
            <SelectValue placeholder="Seleccionar proceso padre" />
          </SelectTrigger>
          <SelectContent className="max-h-60">
            <SelectGroup>
              {isSuccess &&
                processes.map(process => (
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
      </div>
      <div className="flex w-full justify-center">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}

export default CampusPage;
