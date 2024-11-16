'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { Button, buttonVariants } from '@/components/ui/button';
import { ChangeEvent, FormEvent, useState } from 'react';
import { safeParse } from 'valibot';
import { ValidationErrors } from '@/types/ValidationResult';
import ErrorText from '@/components/ui/ErrorText';
import { LoaderCircle } from 'lucide-react';
import { EmailSchema } from '@/Schemas/AuthenticationSchemas';
import useForgotPassword from './useForgotPassword';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({
    email: undefined,
  });

  const sendEmail = useForgotPassword(email);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { issues, success } = safeParse(EmailSchema, email);
    if (!success) {
      setErrors({ email: issues });
    } else {
      sendEmail.mutate();
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    const { issues, success } = safeParse(EmailSchema, value);
    if (!success) {
      setErrors({ email: issues });
    } else {
      setErrors({ email: undefined });
    }
  };

  return (
    <main className="mx-4 flex h-screen flex-col items-center justify-center lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-2xl font-bold">
        ¿Olvidaste tu contraseña?
      </h1>
      <h2 className="text-center text-primary/60">
        No te preocupes, solo ingresa tu correo electrónico y te enviaremos un
        enlace para reestablcecer tu contraseña si encontramos tu cuenta
      </h2>
      <form className="w-full" onSubmit={onSubmit}>
        <Label>Correo electrónico</Label>
        <Input
          type="email"
          placeholder="ejemplo@mail.com"
          value={email}
          onChange={onChange}
          variant={errors.email ? 'invalid' : 'default'}
        />
        {errors.email && <ErrorText>{errors.email[0].message}</ErrorText>}
        <div className="mt-4 flex flex-row justify-center gap-4">
          <Link href="/" className={buttonVariants({ variant: 'destructive' })}>
            Cancelar
          </Link>
          <Button type="submit" disabled={sendEmail.isPending}>
            {sendEmail.isPending && <LoaderCircle className="animate-spin" />}
            Enviar
          </Button>
        </div>
      </form>
    </main>
  );
}

export default ForgotPassword;
