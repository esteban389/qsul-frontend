'use client';

import useAuth from '@/hooks/useAuth';

function HomePage() {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <main className="mx-4 flex h-full flex-col items-center justify-center lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-2xl font-bold">
        Bienvenido {user?.name}
      </h1>
    </main>
  );
}
export default HomePage;
