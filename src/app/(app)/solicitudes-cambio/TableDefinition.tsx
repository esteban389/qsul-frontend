import { Button } from '@/components/ui/button';
import { ColumnDef } from '@tanstack/react-table';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { User } from '@/types/user';
import { cn, formatDate } from '@/lib/utils';
import { ArrowDown } from 'lucide-react';

const changeTypeTranslations: Record<string, string> = {
  campus: 'Seccional',
  process: 'Proceso',
  services: 'Servicios',
};

const statusTranslations: Record<string, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  rejected: 'Rechazado',
};

function translateChangeType(type: string): string {
  return changeTypeTranslations[type] || type;
}

function translateStatus(status: string): string {
  return statusTranslations[status] || status;
}

export type PendingProfileChange = {
  id: number;
  user: User | null;
  change_type: string;
  status: string;
  requester: User | null;
  requested_at: string;
  approver: User | null;
  created_at?: string; // For lint fix and display
};

type ActionHandlers = {
  onApprove: (row: PendingProfileChange) => void;
  onReject: (row: PendingProfileChange) => void;
  showActions?: (row: PendingProfileChange) => boolean;
};

export function getColumns(handlers: ActionHandlers): ColumnDef<PendingProfileChange>[] {
  return [
    {
      accessorKey: 'user',
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
      accessorFn: row => row.user?.name || '',
      cell: ({ row }) => {
        const user = row.original.user;
        return user ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={user.avatar || undefined} alt={user.name} />
              <AvatarFallback>{user.name?.[0] ?? '-'}</AvatarFallback>
            </Avatar>
            <span>{user.name}</span>
          </div>
        ) : '-';
      },
      filterFn: 'includesString',
      enableSorting: true,
    },
    {
      accessorKey: 'change_type',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}>
            Tipo de cambio
            <ArrowDown
              className={cn(
                'ml-2 size-4 transition-transform',
                column.getIsSorted() === 'desc' && 'rotate-180',
              )}
            />
          </Button>
        );
      },
      cell: ({ row }) => translateChangeType(row.original.change_type),
      enableSorting: true,
    },
    {
      accessorKey: 'status',
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
      cell: ({ row }) => translateStatus(row.original.status),
    },
    {
      accessorKey: 'requester',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}>
            Solicitado por
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
        const requester = row.original.requester;
        return requester ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={requester.avatar || undefined} alt={requester.name} />
              <AvatarFallback>{requester.name?.[0] ?? '-'}</AvatarFallback>
            </Avatar>
            <span>{requester.name}</span>
          </div>
        ) : '-';
      },
      filterFn: 'includesString',
      enableSorting: true,
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
        const date = row.original.created_at || row.original.requested_at;
        if (!date) return '-';
        return formatDate(date);
      },
      enableSorting: true,
    },
    {
      accessorKey: 'approver',
      accessorFn: row => row.approver?.name || '',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => {
              column.toggleSorting(column.getIsSorted() === 'asc');
            }}
          >
            Revisado por
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
        const approver = row.original.approver;
        return approver ? (
          <div className="flex items-center gap-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={approver.avatar || undefined} alt={approver.name} />
              <AvatarFallback>{approver.name?.[0] ?? '-'}</AvatarFallback>
            </Avatar>
            <span>{approver.name}</span>
          </div>
        ) : <span className="italic text-muted-foreground">Sin aprobar</span>;
      },
      filterFn: 'includesString',
      enableSorting: true,
    },
    {
      id: 'actions',
      header: '',
      cell: ({ row }) => {
        const show = handlers.showActions ? handlers.showActions(row.original) : true;
        if (!show) return null;
        return (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => handlers.onApprove(row.original)}>
              Aprobar
            </Button>
            <Button size="sm" variant="destructive" onClick={() => handlers.onReject(row.original)}>
              Rechazar
            </Button>
          </div>
        );
      },
      enableSorting: false,
      enableColumnFilter: false,
    },
  ];
}
