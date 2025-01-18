'use client';

import { useState } from 'react';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table as TanTable,
  Row,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bird } from 'lucide-react';
import QueryRenderer from '@/components/QueryRenderer';
import LoadingContent from '@/components/LoadingContent';
import { Answer } from '@/types/answer';
import useAuth from '@/hooks/useAuth';
import { Role } from '@/types/user';
import { Dialog, DialogContent, DialogPortal } from '@radix-ui/react-dialog';
import { DialogOverlay } from '@/components/ui/dialog';
import useAnswers from './useAnswers';
import columns from './TableDefinition';
import DetailsDialogContent from './DetailsDialogContent';

function EmptyContent() {
  return (
    <motion.div
      className="flex w-full flex-col items-center justify-center py-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}>
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, -10, 10, -10, 0],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          repeatType: 'reverse',
        }}>
        <Bird className="size-28 transition-transform" />
      </motion.div>
      <motion.p
        className="ml-4 text-lg font-semibold"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}>
        Upps, parece que no hay empleados
      </motion.p>
    </motion.div>
  );
}

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <LoadingContent />
    </div>
  );
}

const AnswerRow = ({
  row,
  index,
  onClick,
  active,
}: {
  row: Row<Answer>;
  index: number;
  onClick: (answer: Answer) => void;
  active: Answer | null;
}) => {
  if (active && active.id === row.original.id) return null;
  return (
    <motion.tr
      layoutId={`row-${row.original.id}`}
      key={`row-${row.original.id}`}
      onClick={() => onClick(row.original)}
      className={`cursor-pointer bg-background hover:bg-muted ${row.getIsSelected() ? 'selected' : ''
        }`}>
      {row.getVisibleCells().map(cell => (
        <TableCell key={cell.id}>
          <motion.div>
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </motion.div>
        </TableCell>
      ))}
    </motion.tr>
  );
};

// Success component that handles the table
const AnswersTable = ({ table }: { table: TanTable<Answer> }) => {
  const [active, setActive] = useState<Answer | null>(null);

  const handleClose = () => {
    setActive(null);
  };

  return (
    <>
      <Dialog open={!!active} onOpenChange={handleClose}>
        <DialogPortal>
          <DialogOverlay />
          <AnimatePresence>
            <DialogContent className="fixed inset-0 z-50 w-full max-w-lg overflow-hidden bg-muted shadow-lg sm:rounded-3xl md:left-1/2 md:top-1/2 md:grid md:h-[95vh] md:-translate-x-1/2 md:-translate-y-1/2">
              {active && typeof active === 'object' && (
                <DetailsDialogContent active={active} setActive={setActive} />
              )}
            </DialogContent>
          </AnimatePresence>
        </DialogPortal>
      </Dialog>
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
            {table.getRowModel().rows.map((row, index) => (
              <AnswerRow
                key={row.id}
                row={row}
                index={index}
                onClick={setActive}
                active={active}
              />
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
};

function AnswersPage() {
  const answersQuery = useAnswers({});
  const { user } = useAuth({ middleware: 'auth' });
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'created_at', desc: true },
  ]);
  const table = useReactTable({
    data: answersQuery.data ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnVisibility: {
        email: user?.role === Role.NATIONAL_COORDINATOR,
      },
    },
  });

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
        Reporte Detallado
      </motion.h1>
      <motion.div
        className="size-full max-w-[90%] space-y-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}>
        <QueryRenderer
          query={answersQuery}
          config={{
            preferCacheOverFetch: false,
            pending: Loading,
            success: AnswersTable,
            error: ({ error, retry }) => (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <p>Error</p>
                <Button
                  onClick={retry}
                  className="transition-transform hover:scale-105">
                  Retry
                </Button>
              </motion.div>
            ),
            empty: EmptyContent,
          }}
          successProps={{
            table,
          }}
        />
      </motion.div>
    </motion.main>
  );
}

export default AnswersPage;
