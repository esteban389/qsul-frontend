'use client';

import AlertsCenter from '@/components/AlertsCenter';
import useAuth from '@/hooks/useAuth';
import SurveyStats from './SurveyStats';

function HomePage() {
  const { user } = useAuth({ middleware: 'auth' });
  return (
    <main className="mx-4 flex h-full flex-col gap-8 lg:mx-auto px-0">
      <h1 className="w-full text-center text-3xl font-bold">
        Bienvenido {user?.name}
      </h1>
      <div className='flex flex-col gap-4 w-full p-0 md:flex-row md:p-4'>
        <SurveyStats />
        <AlertsCenter />
      </div>
    </main>
  );
}

export default HomePage;
