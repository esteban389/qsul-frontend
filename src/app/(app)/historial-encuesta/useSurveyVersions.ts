import backendClient from '@/services/backendClient';
import { Survey } from '@/types/survey';
import { useQuery } from '@tanstack/react-query';

async function getSurveyVersions() {
  return (await backendClient.get<Survey[]>('api/survey/versions')).data;
}

export default function UseSurveyVersions() {
  return useQuery({
    queryKey: ['surveys'],
    queryFn: () => getSurveyVersions(),
    staleTime: 1000 * 60 * 5,
  });
}
