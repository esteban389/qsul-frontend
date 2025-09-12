import { Button } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import { Answer } from '@/types/answer';
import { motion } from 'framer-motion';

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
        <motion.div layoutId={`avatar-${row.original.id}`}>
          <Avatar>
            <AvatarImage
              src={
                row.original.employee_service.employee.avatar
                  ? env('API_URL') +
                    row.original.employee_service.employee.avatar
                  : undefined
              }
              className="rounded-lg object-cover"
            />
            <AvatarFallback>
              {getInitials(row.original.employee_service.employee.avatar)}
            </AvatarFallback>
          </Avatar>
        </motion.div>
        <motion.span layoutId={`name-${row.original.id}`}>
          {row.original.employee_service.employee.name}
        </motion.span>
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
    cell: ({ row }) => (
      <motion.div layoutId={`service-${row.original.id}`}>
        {row.original.employee_service.service.name}
      </motion.div>
    ),
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
      <motion.div
        layoutId={`email-${row.original.id}`}
        className="flex flex-row items-center gap-4">
        {row.original.email}
      </motion.div>
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
    cell: ({ row }) => (
      <motion.div
        layoutId={`respondent-${row.original.id}`}
        className="flex w-full items-center justify-center">
        {row.original.respondent_type.name}
      </motion.div>
    ),
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
    cell: ({ row }) => (
      <motion.div
        layoutId={`average-${row.original.id}`}
        className="flex w-full items-center justify-center">
        {row.original.average < 3 ? (
          <Badge variant="red">{row.original.average}</Badge>
        ) : (
          <Badge variant="green">{row.original.average}</Badge>
        )}
      </motion.div>
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
      <motion.div
        layoutId={`version-${row.original.id}`}
        className="flex w-full items-center justify-center">
        {row.original.survey.version}
      </motion.div>
    ),
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
          Incluido en reporte general
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
      return (
        <motion.div
          layoutId={`deleted-${row.original.id}`}
          className="flex w-full items-center justify-center">
          {row.original.deleted_at ? 'No' : 'Sí'}
        </motion.div>
      );
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
      const formattedDate = new Intl.DateTimeFormat('es-CO', {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(date);
      return (
        <motion.div
          layoutId={`date-${row.original.id}`}
          className="flex w-full items-center justify-center">
          {formattedDate}
        </motion.div>
      );
    },
  },
];

export default columns;
