'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';

function UpdatePassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      const confirmPasswordElement = document.getElementById(
        'confirm-password',
      ) as HTMLInputElement;
      if (confirmPasswordElement) {
        confirmPasswordElement.setCustomValidity(
          'Las contraseñas no coinciden',
        );
        confirmPasswordElement.reportValidity();
        confirmPasswordElement.focus();
      }
      return;
    }
    alert('Contraseña actualizada');
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
            required
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="confirm-password">Confirmar contraseña</Label>
          <Input
            id="confirm-password"
            type="password"
            placeholder="*******"
            required
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="[&:invalid:not(:placeholder-shown)]:ring-1 [&:invalid:not(:placeholder-shown)]:ring-destructive"
          />
        </div>
        <div className="mt-4 flex flex-row justify-center">
          <Button type="submit">Actualizar contraseña</Button>
        </div>
      </form>
    </main>
  );
}

export default UpdatePassword;
