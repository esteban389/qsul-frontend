import { ReactNode } from 'react';
import ReactQueryContext from '@/Context/ReactQueryContext';
import Sonner from '@/Context/Sonner';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <ReactQueryContext>
      <NuqsAdapter>
        <Sonner>{children}</Sonner>
      </NuqsAdapter>
    </ReactQueryContext>
  );
}
