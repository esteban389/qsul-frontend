import { useQuery } from '@tanstack/react-query';
import backendClient from '@/services/backendClient';
import { PendingProfileChange } from './TableDefinition';

import { useMemo } from 'react';

export type PendingProfileChangeFilters = {
  status?: string;
  date_range?: string;
};

export default function usePendingProfileChanges(filters: PendingProfileChangeFilters = {}) {
  const params = useMemo(() => {
    const searchParams = new URLSearchParams();
    if (filters.status) searchParams.set('status', filters.status);
    if (filters.date_range) searchParams.set('date_range', filters.date_range);
    return searchParams.toString();
  }, [filters.status, filters.date_range]);

  return useQuery({
    queryKey: ['pending-profile-changes', filters],
    queryFn: async () => {
      const url = params ? `/api/profile/pending-changes?${params}` : '/api/profile/pending-changes';
      const res = await backendClient.get<PendingProfileChange[]>(url);
      return res.data;
    },
  });
}

