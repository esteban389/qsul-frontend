import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';

function ForgotPassword() {
  return (
    <main className="mx-4 flex h-screen flex-col items-center justify-center lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-2xl font-bold">
        ¿Olvidaste tu contraseña?
      </h1>
      <h2 className="text-center text-primary/60">
        No te preocupes, solo ingresa tu correo electrónico y te enviaremos un
        enlace para reestablcecer tu contraseña si encontramos tu cuenta
      </h2>
      <form className="w-full">
        <Label>Correo electrónico</Label>
        <Input type="email" placeholder="ejemplo@mail.com" required />
        <div className="mt-4 flex flex-row justify-center gap-4">
          <Link href="/" className={buttonVariants({ variant: 'destructive' })}>
            Cancelar
          </Link>
          <Button type="submit">Enviar</Button>
        </div>
      </form>
    </main>
  );
}

export default ForgotPassword;
