import backendClient from "@/services/backendClient";
import { UpdatePasswordRequest } from "@/types/user";
import { useMutation } from "@tanstack/react-query";

async function mutate(request: UpdatePasswordRequest) {
  return backendClient.post('/api/profile/password', request);
}

export default function useUpdatePassword(request: UpdatePasswordRequest) {

  return useMutation({
    mutationFn: () => mutate(request),
    mutationKey: ['updatePassword'],
  })
}