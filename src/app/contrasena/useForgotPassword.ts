import useAuth from '@/hooks/useAuth';
import backendClient from '@/services/backendClient';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

function sendRequest(email: string) {
  return backendClient.post('/forgot-password', { email });
}

export default function useForgotPassword(email: string) {
  const { csrf } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/Inicio',
  });
  const router = useRouter();
  return useMutation({
    mutationFn: async () => {
      await csrf();
      sendRequest(email);
    },
    onSuccess: () => {
      toast.success('Correo electrónico enviado, revisa tu bandeja de entrada');
      router.push('/');
    },
  });
}
