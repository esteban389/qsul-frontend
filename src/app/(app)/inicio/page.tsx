'use client';

import AlertsCenter from '@/components/AlertsCenter';
import useAuth from '@/hooks/useAuth';

function HomePage() {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <main className="mx-4 flex h-full flex-col gap-8 lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-3xl font-bold">
        Bienvenido {user?.name}
      </h1>
      <AlertsCenter />
    </main>
  );
}
export default HomePage;
