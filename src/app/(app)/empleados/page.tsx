'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  Table as TanTable,
} from '@tanstack/react-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Credenza,
  CredenzaContent,
  CredenzaDescription,
  CredenzaTitle,
  CredenzaTrigger,
} from '@/components/ui/modal';
import { safeParse } from 'valibot';
import { useAuthorize } from '@/lib/authorizations';
import { Label } from '@/components/ui/label';
import ErrorText from '@/components/ui/ErrorText';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';
import { cn, getInitials } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Bird, Search } from 'lucide-react';
import {
  EmployeeAvatarSchema,
  EmployeeEmailSchema,
  EmployeeNameSchema,
  EmployeeProcessSchema,
} from '@/Schemas/UniversitySchema';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/select';
import { SelectValue } from '@radix-ui/react-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import useProcesses from '@/app/(app)/procesos/useProcesses';
import useEmployees from '@/app/(app)/empleados/useEmployees';
import useCreateEmployee from '@/app/(app)/empleados/useCreateEmployee';
import QueryRenderer from '@/components/QueryRenderer';
import LoadingContent from '@/components/LoadingContent';
import { Employee } from '@/types/employee';
import { Role } from '@/types/user';
import useAuth from '@/hooks/useAuth';
import useEmployeeServices from '@/app/(app)/perfil/_components/useEmployeeServices';
import columns from './TableDefinition';
import EmployeeDetailsSheet from './EmployeeDetailsSheet';

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
const EmployeesTable = ({ table }: { table: TanTable<Employee> }) => {
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
                <EmployeeDetailsSheet key={row.id} employee={row.original}>
                  <motion.tr
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
                </EmployeeDetailsSheet>
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
  const employeesQuery = useEmployees({ include: ['process', 'services'] });
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const can = useAuthorize();
  const table = useReactTable({
    data: employeesQuery.data ?? [],
    columns,
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
        Administrar empleados
      </motion.h1>
      <motion.div
        className="size-full max-w-[90%] space-y-4"
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3 }}>
        <motion.div
          className="flex w-full flex-col justify-between gap-4 md:flex-row"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}>
          {can('create', 'employee') && (
            <Credenza>
              <CredenzaTrigger asChild>
                <Button className="transition-transform hover:scale-105">
                  Crear empleado
                </Button>
              </CredenzaTrigger>
              <CredenzaContent>
                <CreateEmployee />
              </CredenzaContent>
            </Credenza>
          )}
          <motion.div
            className="relative w-full max-w-lg"
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}>
            <Input
              className="pr-10 transition-all focus:ring-2 focus:ring-primary/30"
              placeholder="Armando Casas"
              value={
                (table.getColumn('name')?.getFilterValue() as string) ?? ''
              }
              onChange={e =>
                table.getColumn('name')?.setFilterValue(e.target.value)
              }
            />
            <Search className="pointer-events-none absolute inset-y-0 right-0 mr-2 h-full text-muted-foreground" />
          </motion.div>
        </motion.div>
        <QueryRenderer
          query={employeesQuery}
          config={{
            preferCacheOverFetch: false,
            pending: Loading,
            success: EmployeesTable,
            error: ({ error, retry }: { error: Error; retry: () => void }) => (
              <motion.div
                className="text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}>
                <p>Error: {error.message}</p>
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

function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState<File | null>(null);
  const [process, setProcess] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  
  // Get current user info
  const { user } = useAuth({ middleware: 'auth' });
  const isProcessLeader = useMemo(() => user?.role === Role.PROCESS_LEADER, [user]);
  
  // Fetch employee data for process leaders to get their process_id
  const employeeQuery = useEmployeeServices(
    isProcessLeader && user?.employee_id ? user.employee_id : undefined
  );
  
  // For process leaders, use their own process_id
  const processId = useMemo(() => isProcessLeader && employeeQuery.data?.process_id 
    ? employeeQuery.data.process_id 
    : process, [isProcessLeader, employeeQuery.data?.process_id, process]);
  
  const { data: processes, isSuccess } = useProcesses({ deleted_at: 'null' });
  const createEmployeeMutation = useCreateEmployee({
    name,
    avatar: avatar as File,
    process_id: processId as number,
    email,
  });

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const nameResult = safeParse(EmployeeNameSchema, name);
    const iconResult = safeParse(EmployeeAvatarSchema, avatar);
    
    // Only validate process if user is not a process leader
    const processResult = isProcessLeader 
      ? { success: true as const, issues: null } 
      : safeParse(EmployeeProcessSchema, process);
    
    if (nameResult.success && iconResult.success && processResult.success) {
      toast.promise(createEmployeeMutation.mutateAsync(), {
        loading: 'Creando empleado...',
        success: 'Empleado creado correctamente',
        error: 'Error al crear el empleado',
      });
      return;
    }
    setErrors({
      name: nameResult.issues && nameResult.issues[0].message,
      avatar: iconResult.issues && iconResult.issues[0].message,
      process: !isProcessLeader && processResult.issues ? processResult.issues[0].message : undefined,
    });
  };

  const onNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setName(value);
    const result = safeParse(EmployeeNameSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        name: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      name: result.issues[0].message,
    });
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    const result = safeParse(EmployeeEmailSchema, value);
    if (result.success) {
      setErrors({
        ...errors,
        email: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      email: result.issues[0].message,
    });
  };

  const onAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    const file = files && files[0];

    setAvatar(file);
    const result = safeParse(EmployeeAvatarSchema, file);
    if (result.success) {
      setErrors({
        ...errors,
        avatar: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      avatar: result.issues[0].message,
    });
  };

  const onProcessChange = (value: string) => {
    setProcess(Number(value));
    setErrors({
      ...errors,
      process: undefined,
    });
  };

  // If user is process leader, wait for employee data to load
  if (isProcessLeader) {
	  if(employeeQuery.isSuccess) {
		  return <CreateEmployeeForm 
              isProcessLeader={isProcessLeader}
              processes={processes ?? []}
              isSuccess={isSuccess}
              onSubmit={onSubmit}
              name={name}
              onNameChange={onNameChange}
              email={email}
              onEmailChange={onEmailChange}
              onAvatarChange={onAvatarChange}
              onProcessChange={onProcessChange}
              errors={errors}
            />
	  }
    return (
      <QueryRenderer
        query={employeeQuery}
        config={{
          pending: () => (
            <div className="space-y-4 p-12">
              <CredenzaTitle className="mb-4">Registrar empleado</CredenzaTitle>
              <div className="flex justify-center">
                <LoadingContent />
              </div>
            </div>
          ),
          error: ({ error }: { error: Error }) => (
            <div className="space-y-4 p-12">
              <CredenzaTitle className="mb-4">Registrar empleado</CredenzaTitle>
              <p className="text-center text-red-500">Error: {error.message}</p>
            </div>
          ),
          success: () => (
            <CreateEmployeeForm 
              isProcessLeader={isProcessLeader}
              processes={processes ?? []}
              isSuccess={isSuccess}
              onSubmit={onSubmit}
              name={name}
              onNameChange={onNameChange}
              email={email}
              onEmailChange={onEmailChange}
              onAvatarChange={onAvatarChange}
              onProcessChange={onProcessChange}
              errors={errors}
            />
          ),
        }}
      />
    );
  }

  // For non-process leaders, render form directly
  return (
    <CreateEmployeeForm 
      isProcessLeader={isProcessLeader}
      processes={processes ?? []}
      isSuccess={isSuccess}
      onSubmit={onSubmit}
      name={name}
      onNameChange={onNameChange}
      email={email}
      onEmailChange={onEmailChange}
      onAvatarChange={onAvatarChange}
      onProcessChange={onProcessChange}
      errors={errors}
    />
  );
}

function CreateEmployeeForm({ 
  isProcessLeader, 
  processes, 
  isSuccess, 
  onSubmit, 
  name, 
  onNameChange, 
  email, 
  onEmailChange, 
  onAvatarChange, 
  onProcessChange, 
  errors 
}: {
  isProcessLeader: boolean;
  processes: any[];
  isSuccess: boolean;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  name: string;
  onNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
  email: string;
  onEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onAvatarChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onProcessChange: (value: string) => void;
  errors: Record<string, string | undefined>;
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4 p-12">
      <CredenzaTitle className="mb-4">Registrar empleado</CredenzaTitle>
      <CredenzaDescription className="sr-only">
        Crear un empleado
      </CredenzaDescription>
      <div>
        <Label htmlFor="name">Nombre</Label>
        <Input
          name="name"
          placeholder="Armando Casas"
          value={name}
          onChange={onNameChange}
        />
        {errors.name && <ErrorText>{errors.name}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="name">Correo electrónico</Label>
        <Input
          name="email"
          placeholder="armando@example.com"
          value={email}
          onChange={onEmailChange}
        />
        {errors.email && <ErrorText>{errors.email}</ErrorText>}
      </div>
      <div>
        <Label htmlFor="avatar">Imagen del empleado</Label>
        <Input name="avatar" type="file" onChange={onAvatarChange} />
        {errors.avatar && <ErrorText>{errors.avatar}</ErrorText>}
      </div>
      {!isProcessLeader && (
        <div>
          <Select onValueChange={onProcessChange}>
            <SelectTrigger className="h-fit">
              <SelectValue placeholder="Seleccionar proceso" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              <SelectGroup>
                {isSuccess &&
                  processes.map((process: any) => (
                    <SelectItem key={process.id} value={String(process.id)}>
                      <div className="flex flex-row items-center gap-4">
                        <Avatar>
                          <AvatarImage
                            src={
                              process.icon
                                ? env('API_URL') + process.icon
                                : undefined
                            }
                          />
                          <AvatarFallback>
                            {getInitials(process.name)}
                          </AvatarFallback>
                        </Avatar>
                        {process.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          {errors.process && <ErrorText>{errors.process}</ErrorText>}
        </div>
      )}
      <div className="flex w-full justify-center">
        <Button>Guardar</Button>
      </div>
    </form>
  );
}

export default EmployeePage;
