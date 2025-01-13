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
import useAnswers from './useAnswers';
import columns from './TableDefinition';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';

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
// Success component that handles the table
const AnswersTable = ({ table }: { table: TanTable<Answer> }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleClick = (e) => {
    console.log(e)
    // Prevent the click from propagating to avoid immediate closing
    e.preventDefault();

    // Get click coordinates relative to viewport
    const x = e.clientX;
    const y = e.clientY;

    setPosition({ x, y });
  };
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
            <AnimatePresence>
              {table.getRowModel().rows.map((row, index) => (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <motion.tr
                      onClick={handleClick}
                      key={row.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: index * 0.1 }}
                      className={row.getIsSelected() ? 'selected' : ''}>
                      {row.getVisibleCells().map(cell => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext(),
                          )}
                        </TableCell>
                      ))}
                    </motion.tr>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent style={{
                    transform: `translate(${position.x}px, ${position.y}px)`,
                  }}>
                    hi
                  </DropdownMenuContent>
                </DropdownMenu>
              ))}
            </AnimatePresence>
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

function EmployeePage() {
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

export default EmployeePage;
