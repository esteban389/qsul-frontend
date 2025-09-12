import backendClient from '@/services/backendClient';
import { Answer } from '@/types/answer';
import { useQuery } from '@tanstack/react-query';

async function GetAnswer(id: number) {
  return (await backendClient.get<Required<Answer>>(`/api/answers/${id}`)).data;
}

export default function useAnswerDetails(id: number) {
  return useQuery({
    queryKey: ['answers', id],
    queryFn: () => GetAnswer(id),
  });
}
