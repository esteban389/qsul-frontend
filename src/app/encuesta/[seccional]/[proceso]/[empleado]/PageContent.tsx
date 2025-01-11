'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Employee } from '@/types/employee';
import { ChevronLeft } from 'lucide-react';
import { useQueryState, parseAsInteger } from 'nuqs';
import ServicesList, { EMPLOYEE_SERVICE_PARAM } from './ServicesList';
import Questions from './Questions';
import Link from 'next/link';

type params = { seccional: string; proceso: string; empleado: string };

export default function PageContent({
  service,
  employee,
  params,
}: {
  service: number;
  employee: Employee;
  params: params;
}) {
  const [selectedEmployeeService] = useQueryState<number>(
    EMPLOYEE_SERVICE_PARAM,
    parseAsInteger.withDefault(service),
  );
  if (selectedEmployeeService !== 0) return <Questions employee={employee} />;

  return <SelectService params={params} employee={employee} />;
}

function SelectService({
  params,
  employee,
}: {
  params: params;
  employee: Employee;
}) {
  return (
    <div className="relative flex h-full flex-col gap-4 md:items-center">
      <Link
        href={`/encuesta/${params.seccional}/${params.proceso}`}
        className={cn(buttonVariants(), 'static left-0 top-0 md:absolute')}>
        <ChevronLeft />
      </Link>
      <h1 className="w-full text-center text-2xl font-bold md:w-3/4">
        Selecciona el servicio que te atendió {employee.name}
      </h1>
      {employee.services && employee.services.length > 0 && (
        <ServicesList services={employee.services} />
      )}
    </div>
  );
}
