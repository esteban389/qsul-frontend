import { Button } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Audit } from '@/types/audit';

const eventTranslations = {
  created: 'Creación',
  updated: 'Actualización',
  deleted: 'Eliminación',
};
const columns: ColumnDef<Audit>[] = [
  {
    accessorKey: 'author.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Usuario
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
              row.original.author.avatar
                ? env('API_URL') + row.original.author.avatar
                : undefined
            }
          />
          <AvatarFallback>
            {getInitials(row.original.author.name)}
          </AvatarFallback>
        </Avatar>
        {row.original.author.name}
      </div>
    ),
  },
  {
    accessorKey: 'event',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Evento
          <ArrowDown
            className={cn(
              'ml-2 size-4 transition-transform',
              column.getIsSorted() === 'desc' && 'rotate-180',
            )}
          />
        </Button>
      );
    },
    filterFn: 'equalsStringSensitive', // use built-in filter function
    cell: ({ row }) => {
      return eventTranslations[row.original.event];
    },
  },
  {
    accessorKey: 'ip_address',
    header: () => 'Dirección IP',
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
