import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';

export type url = {
  url: string;
}
async function getEmployeeUrl(id: number){
  return (await backendClient.get<url>('api/employees/' + id + "/url")).data;
}

export default function useEmployeeUrl(id:number){
  return useQuery({
    queryKey: ['employees', id, 'url'],
    queryFn: () => getEmployeeUrl(id),
  });
}