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
