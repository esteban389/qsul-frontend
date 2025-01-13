'use client';

import { useRef, useState, MouseEvent, useEffect, useMemo, useId } from 'react';
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
import env from '@/lib/env';
import { createPortal } from 'react-dom';
import useAnswers from './useAnswers';
import columns from './TableDefinition';
import useClickOutside from '@/hooks/use-click-outside';

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
  return (
    <motion.tr
      layoutId={`row-${row.original.id}`}
      key={`row-${row.original.id}`}
      initial={{ opacity: 0, x: -80 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        // Only apply delay to the initial animation
        delay: index * 0.1,
        duration: 0.2,
        type: 'spring',
        stiffness: 300,
        damping: 30,
        // When layout changes (like during click animations),
        // use these transition settings instead
        layout: {
          delay: 0, // No delay for layout animations
        }
      }}
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

const CloseIcon = () => {
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-4 text-black">
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M18 6l-12 12" />
      <path d="M6 6l12 12" />
    </motion.svg>
  );
};

// Success component that handles the table
const AnswersTable = ({ table }: { table: TanTable<Answer> }) => {
  const [active, setActive] = useState<Answer | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [active]);
  useClickOutside(ref, () => setActive(null));

  return (
    <>
      {createPortal(
        <>
          <AnimatePresence>
            {active && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-10 size-full bg-black/30"
              />
            )}
          </AnimatePresence>
          <AnimatePresence>
            {active && typeof active === 'object' ? (
              <div className="fixed inset-0 z-[100] grid place-items-center">
                <motion.button
                  key={`button-${active.id}`}
                  layout
                  initial={{
                    opacity: 0,
                  }}
                  animate={{
                    opacity: 1,
                  }}
                  exit={{
                    opacity: 0,
                    transition: {
                      duration: 0.05,
                    },
                  }}
                  className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full bg-white lg:hidden"
                  onClick={() => setActive(null)}>
                  <CloseIcon />
                </motion.button>
                <motion.div
                  layoutId={`row-${active.id}`}
                  ref={ref}
                  className="flex size-full max-w-[500px] flex-col overflow-hidden bg-muted sm:rounded-3xl md:h-fit md:max-h-[90%]">
                  <ScrollArea>
                    <motion.div layoutId={`avatar-${active.id}`}>
                      <img
                        width={200}
                        height={200}
                        src={
                          env('API_URL') +
                          active.employee_service.employee.avatar
                        }
                        alt={active.employee_service.employee.name}
                        className="h-80 w-full object-cover object-top sm:rounded-t-lg lg:h-80"
                      />
                    </motion.div>
                    <div className="flex h-screen items-start justify-between p-4">
                      <div className="">
                        <motion.h3
                          layoutId={`name-${active.id}`}
                          className="font-bold text-neutral-700">
                          {active.employee_service.employee.name}
                        </motion.h3>
                        <motion.p
                          layoutId={`service-${active.id}`}
                          className="text-neutral-600">
                          {active.employee_service.service.name}
                        </motion.p>
                      </div>
                    </div>
                  </ScrollArea>
                </motion.div>
              </div>
            ) : null}
          </AnimatePresence>
        </>,
        document.body,
      )}
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
                <AnswerRow
                  key={row.id}
                  row={row}
                  index={index}
                  onClick={setActive}
                  active={active}
                />
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
