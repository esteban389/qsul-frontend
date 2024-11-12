import { ReactNode } from 'react';
import ReactQueryContext from '@/Context/ReactQueryContext';
import Sonner from '@/Context/Sonner';

export default function AppContext({ children }: { children: ReactNode }) {
  return (
    <ReactQueryContext>
      <Sonner>{children}</Sonner>
    </ReactQueryContext>
  );
}
