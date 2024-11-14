import * as v from 'valibot';

export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el correo'),
  v.email('Debes ingresar un correo válido'),
);

export const LoginPasswordSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar la contraseña'),
);

export const ResetPasswordSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar la contraseña'),
  v.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
);

export const ResetPasswordConfirmSchema = (password: string) =>
  v.pipe(
    v.string(),
    v.nonEmpty('Debes confirmar la contraseña'),
    v.minLength(8, 'La contraseña debe tener al menos 8 caracteres'),
    v.value(password, 'Las contraseñas no coinciden'),
  );
