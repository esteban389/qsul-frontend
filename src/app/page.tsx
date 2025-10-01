'use client';

import Image from 'next/image';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button, buttonVariants } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import Link from 'next/link';
import { ChangeEvent, FormEvent, useState } from 'react';
import useAuth from '@/hooks/useAuth';
import { useMutation } from '@tanstack/react-query';
import { LoaderCircle, AlertTriangle } from 'lucide-react';
import { ValidationErrors } from '@/types/ValidationResult';
import { safeParse } from 'valibot';
import ErrorText from '@/components/ui/ErrorText';
import { AxiosError } from 'axios';
import { toast } from 'sonner';
import {
  EmailSchema,
  LoginPasswordSchema,
} from '@/Schemas/AuthenticationSchemas';

interface ConfigurationError {
  error: string;
  message: string;
}

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({
    email: undefined,
    password: undefined,
  });
  const [serverError, setServerError] = useState<string | undefined>(undefined);
  const [configurationError, setConfigurationError] = useState<ConfigurationError | undefined>(undefined);
  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/inicio',
  });

  const loginMut = useMutation({
    mutationFn: () => login(email, password),
    onError: error => {
      if (error instanceof AxiosError) {
        const body = error.response?.data;
        if (body && 'error' in body && 'message' in body) {
          // Check if it's a configuration error
          if (body.error && body.error.includes('cuenta no está completamente configurada')) {
            setConfigurationError({
              error: body.error,
              message: body.message
            });
            setServerError(undefined);
          } else {
            setServerError(body.message);
            setConfigurationError(undefined);
          }
        } else if (body && 'message' in body) {
          setServerError(body.message);
          setConfigurationError(undefined);
        } else {
          toast.error(`Ocurrió un error inesperado: ${error.message}`);
        }
      }
    },
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setServerError(undefined);
    setConfigurationError(undefined);
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
    setConfigurationError(undefined);
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
    setConfigurationError(undefined);
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
          
          {configurationError && (
            <Alert variant="destructive" className="border-2 border-red-500 bg-red-50">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="text-lg font-bold mb-2">
                {configurationError.error}
              </AlertTitle>
              <AlertDescription className="text-base">
                <p className="mb-3">{configurationError.message}</p>
                <p className="text-sm font-medium">
                  <strong>¿Qué significa esto?</strong>
                </p>
                <p className="text-sm mb-3">
                  Tu cuenta ha sido creada exitosamente, pero necesita ser configurada completamente por un administrador antes de que puedas acceder al sistema.
                </p>
                <p className="text-sm font-medium">
                  <strong>¿Qué debes hacer?</strong>
                </p>
                <p className="text-sm">
                  Contacta al administrador del sistema para que complete la configuración de tu cuenta asignándote el proceso o seccional correspondiente.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
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
