import { removeUndefinedAndNull } from '@/lib/utils';
import backendClient from '@/services/backendClient';
import { Answer, GetAnswersRequestFilters } from '@/types/answer';
import { useQuery } from '@tanstack/react-query';

async function GetAnswers(filters: GetAnswersRequestFilters) {
  const actualFilters = removeUndefinedAndNull(filters);
  const searchParams = new URLSearchParams();
  Object.entries(actualFilters).forEach(([key, value]) => {
    return searchParams.append(`filter[${key}]`, String(value));
  });
  return (
    await backendClient.get<Answer[]>('/api/answers', { params: searchParams })
  ).data;
}

export default function useAnswers(filters: GetAnswersRequestFilters) {
  return useQuery({
    queryKey: ['answers', filters],
    queryFn: () => GetAnswers(filters),
  });
}
