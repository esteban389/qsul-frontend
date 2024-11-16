import { Button } from '@/components/ui/button';
import { cn, RolesTranslations } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { User } from '@/types/user';
import { Badge } from '@/components/ui/badge';

const columns: ColumnDef<User>[] = [
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
  },
  {
    accessorKey: 'email',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Correo
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
  },
  {
    accessorKey: 'role',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Rol
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    cell: ({ row }) => RolesTranslations[row.original.role],
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
        <Badge variant="destructive">Inactivo</Badge>
      ) : (
        <Badge>Activo</Badge>
      ),
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
