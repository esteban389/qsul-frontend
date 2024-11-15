'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle } from 'lucide-react';
import { ValidationErrors } from '@/types/ValidationResult';
import {
  EmailSchema,
  LoginPasswordSchema,
} from '@/Schemas/AuthenticationSchemas';
import { safeParse } from 'valibot';
import ErrorText from '@/components/ui/ErrorText';
import { AxiosError } from 'axios';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({
    email: undefined,
    password: undefined,
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/Inicio',
  });

  const loginMut = useMutation({
    mutationFn: () => login(email, password),
    onError: error => {
      if (error instanceof AxiosError) {
        const body = error.response?.data;
        if (body && 'message' in body) {
          setServerError(body.message);
        }
      }
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);
    const { issues: emailIssues, success: emailSuccess } = safeParse(
      EmailSchema,
      email,
    );
    const { issues: passwordIssues, success: passwordSuccess } = safeParse(
      LoginPasswordSchema,
      password,
    );
    if (!emailSuccess || !passwordSuccess) {
      setErrors({
        email: emailIssues,
        password: passwordIssues,
      });
      return;
    }
    loginMut.mutate();
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    setServerError(undefined);
    const { issues, success } = safeParse(EmailSchema, value);
    if (success) {
      setErrors({
        ...errors,
        email: undefined,
      });
    }
    if (!success) {
      setErrors({
        ...errors,
        email: issues,
      });
    }
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    setServerError(undefined);
    const { issues, success } = safeParse(LoginPasswordSchema, value);
    if (success) {
      setErrors({
        ...errors,
        password: undefined,
      });
    }
    if (!success) {
      setErrors({
        ...errors,
        password: issues,
      });
    }
  };

  return (
    <main className="flex min-h-screen flex-row items-center justify-between lg:items-stretch">
      <section className="m-auto lg:max-w-[25%]">
        <div className="mx-4 flex-auto space-y-2 rounded-lg bg-gray-100/75 p-4 text-gray-800 shadow-md lg:basis-1/3 lg:bg-transparent lg:shadow-none">
          <div>
            <h1 className="w-full text-center text-2xl font-bold">
              Iniciar sesión
            </h1>
            <h2 className="text-center text-primary lg:text-primary/60">
              Escribe tu correo y contraseña para ingresar
            </h2>
          </div>
          {serverError && <ErrorText>{serverError}</ErrorText>}
          <form onSubmit={handleSubmit} className="mt-2 space-y-4">
            <div>
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                type="email"
                placeholder="ejemplo@mail.com"
                id="email"
                value={email}
                onChange={onEmailChange}
                variant={errors.email ? 'invalid' : 'default'}
              />
              {errors.email && <ErrorText>{errors.email[0].message}</ErrorText>}
            </div>
            <div>
              <Label htmlFor="password">Contraseña</Label>
              <Input
                type="password"
                placeholder="*******"
                id="password"
                value={password}
                onChange={onPasswordChange}
                variant={errors.password ? 'invalid' : 'default'}
              />
              {errors.password && (
                <ErrorText>{errors.password[0].message}</ErrorText>
              )}
            </div>
            <div className="flex flex-col items-center justify-center gap-2">
              <Button type="submit" disabled={loginMut.isPending}>
                {loginMut.isPending && (
                  <LoaderCircle className="animate-spin" />
                )}
                Iniciar sesión
              </Button>
              <Link
                className={buttonVariants({ variant: 'ghost' })}
                href="/contrasena">
                Olvidé mi contraseña
              </Link>
            </div>
          </form>
        </div>
      </section>

      <section className="fixed inset-0 -z-10 flex-auto bg-gray-100 blur-[6px] lg:static lg:basis-3/4 lg:blur-0">
        <Image
          className="size-full max-h-screen object-cover"
          src="/login-people.png"
          width={500}
          height={500}
          alt="Personas mirando una pantalla"
        />
      </section>
    </main>
  );
}
