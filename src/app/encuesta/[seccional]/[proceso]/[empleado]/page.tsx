import backendClient from '@/services/backendClient';
import { Employee } from '@/types/employee';
import { notFound } from 'next/navigation';
import type { SearchParams } from 'nuqs';
import { loadSerachParams } from './nuqsLoader';
import PageContent from './PageContent';

export interface PageProps {
  params: Promise<{ seccional: string; proceso: string; empleado: string }>;
  searchParams: Promise<SearchParams>;
}
export default async function page({ params, searchParams }: PageProps) {
  const pathParams = await params;
  try {
    await backendClient.get(`/api/campuses/${pathParams.seccional}`);
    await backendClient.get(`/api/processes/${pathParams.proceso}`);
  } catch (error) {
    notFound();
  }
  const employee = (
    await backendClient
      .get<Employee>(`/api/employees/${pathParams.empleado}?include=services`)
      .catch(() => notFound())
  ).data;

  const { service } = await loadSerachParams(searchParams);

  return (
    <PageContent service={service} employee={employee} params={pathParams} />
  );
}
