import backendClient from '@/services/backendClient';
import { Employee } from '@/types/employee';
import { useQuery } from '@tanstack/react-query';

async function getEmployeeServices(employeeId: number) {
  return (await backendClient.get<Employee>(`api/employees/id/${employeeId}`)).data;
}

export default function useEmployeeServices(employeeId: number | undefined) {
  return useQuery({
    queryKey: ['employees', employeeId],
    queryFn: () => getEmployeeServices(employeeId!),
    enabled: !!employeeId,
  });
}
