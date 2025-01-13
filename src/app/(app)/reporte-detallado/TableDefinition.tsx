import { Button } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Answer } from '@/types/answer';

const columns: ColumnDef<Answer>[] = [
  {
    accessorKey: 'employee_service.employee.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Empleado
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
              row.original.employee_service.employee.avatar
                ? env('API_URL') + row.original.employee_service.employee.avatar
                : undefined
            }
          />
          <AvatarFallback>
            {getInitials(row.original.employee_service.employee.avatar)}
          </AvatarFallback>
        </Avatar>
        {row.original.employee_service.employee.name}
      </div>
    ),
  },
  {
    accessorKey: 'employee_service.service.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Servicio
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
          Correo electrónico
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
        {row.original.email}
      </div>
    ),
  },
  {
    accessorKey: 'respondent_type.name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Tipo de encuestado
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
    accessorKey: 'average',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Promedio
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
      row.original.average < 3 ? (
        <Badge variant="red">{row.original.average}</Badge>
      ) : (
        <Badge variant="green">{row.original.average}</Badge>
      ),
  },
  {
    accessorKey: 'survey',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => {
            column.toggleSorting(column.getIsSorted() === 'asc');
          }}>
          Versión de la encuesta
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
      <div className="flex w-full items-center justify-center">
        {row.original.survey.version}
      </div>
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
