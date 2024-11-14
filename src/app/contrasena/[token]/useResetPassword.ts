import backendClient from '@/services/backendClient';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

function sendRequest(
  token: string,
  password: string,
  password_confirmation: string,
  email: string,
) {
  return backendClient.post('/reset-password', {
    token,
    password,
    password_confirmation,
    email,
  });
}

export default function useResetPassword({
  token,
  email,
  password,
  confirmPassword,
}: {
  token: string;
  email: string;
  password: string;
  confirmPassword: string;
}) {
  return useMutation({
    mutationFn: async () => {
      sendRequest(token, password, confirmPassword, email);
    },
    onSuccess: () => {
      toast.success('Contraseña actualizada');
    },
  });
}
