'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { ValidationErrors } from '@/types/ValidationResult';
import { safeParse } from 'valibot';
import {
  ResetPasswordConfirmSchema,
  ResetPasswordSchema,
} from '@/Schemas/AuthenticationSchemas';
import ErrorText from '@/components/ui/ErrorText';
import { useParams, useSearchParams } from 'next/navigation';
import { LoaderCircle } from 'lucide-react';
import Link from 'next/link';
import useResetPassword from './useResetPassword';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ValidationErrors>({
    password: undefined,
    confirmPassword: undefined,
  });

  const params = useParams();
  const query = useSearchParams();

  const sendResetPassword = useResetPassword({
    token: params.token as string,
    email: query.get('email') as string,
    password,
    confirmPassword,
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    const passwordResult = safeParse(ResetPasswordSchema, password);
    const confirmPasswordResult = safeParse(
      ResetPasswordConfirmSchema(password),
      confirmPassword,
    );
    if (!passwordResult.success || !confirmPasswordResult.success) {
      setErrors({
        password: passwordResult.issues,
        confirmPassword: confirmPasswordResult.issues,
      });
      return;
    }
    sendResetPassword.mutate();
  };

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setPassword(value);
    const result = safeParse(ResetPasswordSchema, value);
    setErrors({ ...errors, password: result.issues });
  };

  const onChangeConfirmPassword = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setConfirmPassword(value);
    const result = safeParse(ResetPasswordConfirmSchema(password), value);
    setErrors({ ...errors, confirmPassword: result.issues });
  };
  return (
    <main className="mx-4 flex h-screen flex-col items-center justify-center lg:mx-auto lg:w-1/2">
      <h1 className="w-full text-center text-2xl font-bold">
        Reestablecer contraseña
      </h1>
      <h2 className="text-center text-primary/60">
        Parece que olvidaste tu contraseña. Por favor, crea una nueva contraseña
        para acceder a tu cuenta.
      </h2>
      <form onSubmit={handleSubmit} className="mt-4 w-full space-y-4">
        <div>
          <Label htmlFor="password">Nueva contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="*******"
            value={password}
            onChange={onChangePassword}
            variant={errors.password ? 'invalid' : 'default'}
          />
          {errors.password && (
            <ErrorText>{errors.password[0].message}</ErrorText>
          )}
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="*******"
            value={confirmPassword}
            onChange={onChangeConfirmPassword}
            variant={errors.confirmPassword ? 'invalid' : 'default'}
          />
          {errors.confirmPassword && (
            <ErrorText>{errors.confirmPassword[0].message}</ErrorText>
          )}
        </div>
        <div className="mt-4 flex flex-row justify-center">
          {sendResetPassword.isSuccess ? (
            <Link href="/" className={buttonVariants({ variant: 'link' })}>
              Iniciar sesión
            </Link>
          ) : (
            <Button type="submit" disabled={sendResetPassword.isPending}>
              {sendResetPassword.isPending && (
                <LoaderCircle className="animate-spin" />
              )}
              Actualizar contraseña
            </Button>
          )}
        </div>
      </form>
    </main>
  );
}

export default UpdatePassword;
