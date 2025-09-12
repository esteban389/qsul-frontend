import { ReactNode } from 'react';
import { Toaster } from '@/components/ui/sonner';

function Sonner({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        richColors
        position="bottom-right"
        closeButton
        visibleToasts={5}
      />
    </>
  );
}

export default Sonner;
