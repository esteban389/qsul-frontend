import { Button } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Employee } from '@/types/employee';

const columns: ColumnDef<Employee>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Nombre
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex flex-row items-center gap-4">
        <Avatar>
          <AvatarImage
            src={
              row.original.avatar
                ? env('API_URL') + row.original.avatar
                : undefined
            }
          />
          <AvatarFallback>{getInitials(row.original.name)}</AvatarFallback>
        </Avatar>
        {row.original.name}
      </div>
    ),
  },
  {
    accessorKey: 'process_id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Proceso
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      return row.original.process?.name || 'N/A';
    },
  },
  {
    accessorKey: 'deleted_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Estado
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) =>
      row.original.deleted_at ? (
        <Badge variant="red">Inactivo</Badge>
      ) : (
        <Badge variant="green">Activo</Badge>
      ),
  },
  {
    accessorKey: 'updated_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Fecha de última actualización
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      if (!row.original.updated_at) return 'N/A';
      const date = new Date(row.original.updated_at);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    },
  },
  {
    accessorKey: 'created_at',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Fecha de creación
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.original.created_at);
      return new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
    },
  },
];

export default columns;
