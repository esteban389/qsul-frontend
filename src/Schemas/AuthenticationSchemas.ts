import * as v from 'valibot';
import { convertBinaryUnits } from '@/lib/utils';

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
export const UserNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
);
export const UserAvatarSchema = v.pipe(
  v.file('Debes seleccionar una imagen'),
  v.mimeType(
    ['image/jpeg', 'image/png'],
    'La imagen debe ser de tipo JPG o PNG',
  ),
  v.maxSize(
    convertBinaryUnits(5, 'MB', 'B'),
    'La imagen debe pesar menos de 5MB',
  ),
);
export const UserCampusSchema = v.string('Debes seleccionar un campus');
