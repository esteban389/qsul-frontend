'use client';

import { buttonVariants } from '@/components/ui/button';
import { cn, getInitials } from '@/lib/utils';
import { Employee } from '@/types/employee';
import { ChevronLeft } from 'lucide-react';
import { useQueryState, parseAsInteger } from 'nuqs';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import env from '@/lib/env';
import ServicesList, { EMPLOYEE_SERVICE_PARAM } from './ServicesList';
import Questions from './Questions';

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
    <div className="relative flex h-full flex-col items-start gap-4">
      <Link
        href={`/encuesta/${params.seccional}/${params.proceso}`}
        className={cn(buttonVariants(), 'sticky left-0 top-0 z-10')}>
        <ChevronLeft />
      </Link>
      <div className="group flex w-full flex-row items-center gap-4">
        <Avatar className="size-24 overflow-visible rounded-lg">
          <div className="relative isolate">
            <div className="size-full overflow-hidden rounded-lg">
              <AvatarImage
                src={env('API_URL') + employee.avatar}
                alt={employee.name}
                className="rounded-lg transition-transform group-hover:scale-110"
              />
            </div>
            <AvatarImage
              src={env('API_URL') + employee.avatar}
              alt={employee.name}
              className="absolute left-0 top-0 -z-10 opacity-0 transition-all group-hover:-left-2 group-hover:-top-2 group-hover:opacity-100 group-hover:blur-md"
            />
          </div>
          <AvatarFallback className="rounded-lg">
            {getInitials(employee.name)}
          </AvatarFallback>
        </Avatar>

        <h1 className="w-full text-2xl font-bold md:w-3/4">
          Selecciona el servicio que te atendió {employee.name}
        </h1>
      </div>
      {employee.services && employee.services.length > 0 && (
        <ServicesList services={employee.services} />
      )}
    </div>
  );
}
