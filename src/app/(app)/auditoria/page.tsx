'use client';

import { useState } from 'react';
import {
  flexRender,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table as TanTable,
} from '@tanstack/react-table';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import QueryRenderer from '@/components/QueryRenderer';
import LoadingContent from '@/components/LoadingContent';
import { Audit } from '@/types/audit';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Table,
  TableBody,
  TableHeader,
  TableRow,
  TableHead,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useAudit from './useAudit';
import columns from './TableDefinition';
import AuditRow from './AuditRow';

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}

export default function Page() {
  const auditsQuery = useAudit();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const table = useReactTable({
    data: auditsQuery.data || [],
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
    columns,
  });
  console.log(table.getColumn('event')?.getFilterValue());

  return (
    <motion.main
      className="mx-4 flex h-full flex-col items-center space-y-6 py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}>
      <motion.h1
        className="w-full text-center text-3xl font-bold"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}>
        Tabla de Auditoría
      </motion.h1>
      <motion.div
        className="flex w-full flex-col justify-between gap-4 md:flex-row"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}>
        <motion.div
          className="relative w-full max-w-lg"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}>
          <Input
            className="pr-10 transition-all focus:ring-2 focus:ring-primary/30"
            placeholder="Armando Casas"
            value={
              (table.getColumn('author_name')?.getFilterValue() as string) ?? ''
            }
            onChange={e =>
              table.getColumn('author_name')?.setFilterValue(e.target.value)
            }
          />
          <Search className="pointer-events-none absolute inset-y-0 right-0 mr-2 h-full text-muted-foreground" />
        </motion.div>
        <Select
          key={table.getColumn('event')?.getFilterValue() as string}
          value={table.getColumn('event')?.getFilterValue() as string}
          onValueChange={value =>
            table.getColumn('event')?.setFilterValue(value)
          }>
          <SelectTrigger>
            <SelectValue placeholder="Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created">Creación</SelectItem>
            <SelectItem value="deleted">Eliminación</SelectItem>
            <SelectItem value="updated">Actualización</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={() => table.resetColumnFilters()}>
          Quitar filtros
        </Button>
      </motion.div>
      <QueryRenderer
        query={auditsQuery}
        successProps={{ table }}
        config={{
          pending: Loading,
          error: ({ error, retry }) => (
            <motion.div
              className="text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}>
              <p>Error: {error.message}</p>
              <Button
                onClick={retry}
                className="transition-transform hover:scale-105">
                Reintentar
              </Button>
            </motion.div>
          ),
          success: ContentTable,
        }}
      />
    </motion.main>
  );
}

function ContentTable({ table }: { table: TanTable<Audit> }) {
  return (
    <>
      <ScrollArea
        className={cn('w-full rounded-md border-2 border-secondary shadow-md')}>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map(headerGroup => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map(row => (
              <AuditRow key={row.id} row={row} />
            ))}
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
    </>
  );
}
