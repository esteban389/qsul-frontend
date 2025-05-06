'use client';

import QueryRenderer from '@/components/QueryRenderer';
import Loading from './Loading';
import ErrorContent from './ErrorContent';
import EmptyContent from './EmptyContent';
import { getColumns, PendingProfileChange } from './TableDefinition';
import { flexRender, getCoreRowModel, getFilteredRowModel, getSortedRowModel, useReactTable } from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import usePendingProfileChanges from './usePendingProfileChanges';
import { useApproveProfileChange, useRejectProfileChange } from './useApproveRejectProfileChange';
import type { ColumnFiltersState, OnChangeFn, SortingState } from '@tanstack/react-table';
import { useState } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Table as TanTable } from '@tanstack/react-table';

type PendingProfileChangesTableProps = {
  table: TanTable<PendingProfileChange>;
};

function PendingProfileChangesTable({ table }: PendingProfileChangesTableProps) {


  return (
    <ScrollArea className="w-full rounded-md border-2 border-secondary shadow-md">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map(headerGroup => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map(header => (
                <TableHead key={header.id}>
                  {flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map(row => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

export default function SolicitudesCambioPage() {
  const [status, setStatus] = useState<string>('pending');
  const [dateNumber, setDateNumber] = useState<number>(7);
  const [dateUnit, setDateUnit] = useState<'days' | 'months'>('days');
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const dateRange = dateNumber ? `${dateNumber}${dateUnit}` : '';
  const query = usePendingProfileChanges({ status, date_range: dateRange })

  const approveMutation = useApproveProfileChange();
  const rejectMutation = useRejectProfileChange();
  const [sorting, setSorting] = useState<SortingState>([]);

  const table = useReactTable({
    data: query.data || [],
    columns: getColumns({
      onApprove: (row) => approveMutation.mutate(row.id, {
        onSuccess: () => toast.success('Solicitud aprobada'),
        onError: () => toast.error('Error al aprobar'),
      }),
      onReject: (row) => rejectMutation.mutate(row.id, {
        onSuccess: () => toast.success('Solicitud rechazada'),
        onError: () => toast.error('Error al rechazar'),
      }),
      showActions: (row) => row.status === 'pending',
    }),
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    state: {
      columnFilters,
      sorting,
    },
    getRowId: (row: PendingProfileChange) => row.id.toString(),
  });
  return (
    <main className="w-full p-4">
      <h1 className="text-2xl font-bold text-center mb-4">Solicitudes de Cambio</h1>
      <div className="flex flex-wrap gap-4 mb-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="approved">Aprobado</SelectItem>
              <SelectItem value="rejected">Rechazado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Rango de fecha</label>
          <div className="flex gap-2">
            <Input
              type="number"
              min={1}
              value={dateNumber}
              onChange={e => setDateNumber(Number(e.target.value))}
              className="w-20"
            />
            <Select value={dateUnit} onValueChange={v => setDateUnit(v as 'days' | 'months')}>
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">días</SelectItem>
                <SelectItem value="months">meses</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Buscar usuario</label>
          <Input
            type="text"
            placeholder="Nombre de usuario"
            value={table.getColumn('user')?.getFilterValue() as string}
            onChange={e => table.getColumn('user')?.setFilterValue(e.target.value)}
            className="w-40"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Buscar aprobador</label>
          <Input
            type="text"
            placeholder="Nombre de aprobador"
            value={table.getColumn('approver')?.getFilterValue() as string}
            onChange={e => table.getColumn('approver')?.setFilterValue(e.target.value)}
            className="w-40"
          />
        </div>
      </div>
      <QueryRenderer query={query} config={{
        pending: Loading,
        loading: Loading,
        error: ErrorContent,
        empty: EmptyContent,
        success: () => (
          <PendingProfileChangesTable table={table} />
        ),
      }}
      />
    </main>
  );
}


