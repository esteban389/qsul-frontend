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
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Dog, Search } from 'lucide-react';
import useCreateCampus from '@/app/(app)/seccionales/useCreateCampus';
import {
  CampusAddressSchema,
  CampusIconSchema,
  CampusNameSchema,
} from '@/Schemas/UniversitySchema';
import CampusDetailsSheet from '@/app/(app)/seccionales/CampusDetailsSheet';
import useCampuses from './useCampuses';
import columns from './TableDefinition';

function CampusPage() {
  const campusesQuery = useCampuses();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: campusesQuery.data || [],
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
                <Button>Crear seccional</Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CreateCampusModal />
              </CredenzaContent>
            </Credenza>
          )}
          <div className="relative w-full max-w-lg">
            <Input
              placeholder="Cúcuta"
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
              {campusesQuery.isSuccess && table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map(row => (
                  <CampusDetailsSheet campus={row.original} key={row.id}>
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
                  </CampusDetailsSheet>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={table.getVisibleFlatColumns().length}
                    className="h-24">
                    <div className="flex w-full flex-col items-center justify-center py-8">
                      <Dog className="size-28 transition hover:-scale-x-100" />
                      <p className="ml-4 text-lg font-semibold">
                        Upps, parece que no hay seccionales
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

function CreateCampusModal() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState<File | null>(null);
  const [address, setAddress] = useState('');
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const createUserMutation = useCreateCampus({
    name,
    icon,
    address,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameResult = safeParse(CampusNameSchema, name);
    const addressResult = safeParse(CampusAddressSchema, address);
    const iconResult = safeParse(CampusIconSchema, icon);
    if (nameResult.success && iconResult.success && addressResult.success) {
      toast.promise(createUserMutation.mutateAsync(), {
        loading: 'Creando seccional...',
        success: 'Seccional creado correctamente',
        error: 'Error al crear la seccional',
      });
      return;
    }
    setErrors({
      name: nameResult.issues && nameResult.issues[0].message,
      icon: iconResult.issues && iconResult.issues[0].message,
      address: addressResult.issues && addressResult.issues[0].message,
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

  const onIconChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];

    setIcon(file);
    const result = safeParse(CampusIconSchema, file);
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

  return (
    <form onSubmit={onSubmit} className="space-y-4 p-12">
      <CredenzaTitle className="mb-4">Crear Seccional</CredenzaTitle>
      <CredenzaDescription className="sr-only">
        Crear un seccional
      </CredenzaDescription>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          name="name"
          placeholder="Cúcuta"
          value={name}
          onChange={onNameChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="address">Dirección</Label>
        <Input
          name="address"
          placeholder="Calle 14"
          value={address}
          onChange={onAddressChange}
        />
        {errors.address && <ErrorText>{errors.address}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="avatar">Ícono del campus</Label>
        <Input name="avatar" type="file" onChange={onIconChange} />
        {errors.icon && <ErrorText>{errors.icon}</ErrorText>}
      </div>
      <div className="flex w-full justify-center">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}

export default CampusPage;
