import backendClient from '@/services/backendClient';
import { Survey } from '@/types/survey';
import { useQuery } from '@tanstack/react-query';

async function getCurrentSurvey() {
  const response = await backendClient.get<Survey>('api/survey');
  return response.data;
}

export default function useSurvey() {
  return useQuery({
    queryKey: ['surveys', 'current'],
    queryFn: () => getCurrentSurvey(),
  });
}
