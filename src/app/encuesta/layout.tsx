import { ReactNode } from 'react';
import AskForEmailAndUserTypeModal from './AskForEmailAndUserTypeModal';

export default function layout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="fixed inset-0 -z-10 size-full grayscale-[50%]">
        <img
          src="/fondo-encuesta.jpg"
          alt="fondo"
          className="size-full object-cover"
        />
      </div>
      <main className="mx-4 h-3/4 w-full max-w-3xl rounded-md bg-background/70 p-4">
        {children}
      </main>
      <div className="fixed left-4 top-4 flex items-center justify-center">
        <AskForEmailAndUserTypeModal />
      </div>
    </div>
  );
}
