import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import backendClient from '@/services/backendClient';
import { Employee } from '@/types/employee';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import EmployeesList from './EmployeesList';

export default async function page({
  params,
}: {
  params: { seccional: string; proceso: string };
}) {
  try {
    await backendClient.get(`/api/campuses/${params.seccional}`);
    await backendClient.get(`/api/processes/${params.proceso}`);
  } catch (error) {
    notFound();
  }
  const employees = (
    await backendClient.get<Employee[]>(
      `/api/employees?filter[process.token]=${params.proceso}`,
    )
  ).data;

  return (
    <div className="relative flex h-full flex-col gap-4">
      <Link
        href={`/encuesta/${params.seccional}`}
        className={cn(buttonVariants(), 'static left-0 top-0 md:absolute')}>
        <ChevronLeft />
      </Link>
      <h1 className="w-full text-center text-2xl font-bold">
        Selecciona el empleado
      </h1>
      <p className="text-center text-primary lg:text-primary/80">
        Identifica al empleado que te ayudó
      </p>
      <EmployeesList
        employees={employees}
        seccional={params.seccional}
        proceso={params.proceso}
      />
    </div>
  );
}
