import backendClient from '@/services/backendClient';
import { useQuery } from '@tanstack/react-query';

async function getRespondentTypes() {
  return (await backendClient.get('api/respondent-types')).data;
}

export default function useRespondentType() {
  return useQuery({
    queryKey: ['respondent-types'],
    queryFn: () => getRespondentTypes(),
  });
}
