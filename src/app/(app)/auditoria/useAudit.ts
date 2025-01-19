import backendClient from '@/services/backendClient';
import { Audit } from '@/types/audit';
import { useQuery } from '@tanstack/react-query';

async function GetAudit() {
  return (await backendClient.get<Audit[]>('/api/audits')).data;
}

export default function useAudit() {
  return useQuery({
    queryKey: ['audits'],
    queryFn: () => GetAudit(),
    select: data =>
      data.map(audit => ({
        ...audit,
        old_values: JSON.stringify(audit.old_values, null, 6),
        new_values: JSON.stringify(audit.new_values, null, 6),
      })),
  });
}
