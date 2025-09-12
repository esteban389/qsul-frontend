import backendClient from "@/services/backendClient";
import { UpdateProfileRequest } from "@/types/user";
import { useMutation, useQueryClient } from "@tanstack/react-query";

async function mutate(request: UpdateProfileRequest) {
  return backendClient.post('/api/profile', request, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

export default function useUpdateProfile(request: UpdateProfileRequest) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => mutate(request),
    mutationKey: ['updateProfile'],
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['user'] })
  })
}