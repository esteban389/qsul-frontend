import backendClient from '@/services/backendClient';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/app/types/user';

interface useAuthProps {
  middleware?: 'guest' | 'auth';
  redirectIfAuthenticated?: string;
}

export default function useAuth({
  middleware = 'guest',
  redirectIfAuthenticated = '/',
}: useAuthProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await backendClient.get<User>('/api/user');
      return response.data;
    },
  });

  const csrf = () => backendClient.get('/sanctum/csrf-cookie');

  const login = async (email: string, password: string) => {
    await csrf();
    await backendClient.post('/login', {
      email,
      password,
    });
    await refetch();
  };

  const logout = useCallback(async () => {
    await backendClient.post('/logout');
    queryClient.clear();
    router.push('/');
  }, [queryClient, router]);

  useEffect(() => {
    if (middleware === 'guest' && redirectIfAuthenticated && user) {
      router.push(redirectIfAuthenticated);
    }

    if (middleware === 'auth' && !user && !error && !isLoading) {
      router.push('/');
    }
    if (middleware === 'auth' && error) {
      logout();
    }
  }, [
    user,
    error,
    middleware,
    redirectIfAuthenticated,
    isLoading,
    router,
    logout,
  ]);
  return {
    csrf,
    login,
    user,
    logout,
  };
}