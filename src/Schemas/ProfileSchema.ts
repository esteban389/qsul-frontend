import { convertBinaryUnits } from '@/lib/utils';
import * as v from 'valibot';

export const UserAvatarSchema = v.optional(
  v.pipe(
    v.file('Debes seleccionar una imagen'), // this error won't trigger if it's optional
    v.mimeType(['image/jpeg', 'image/png'], 'La imagen debe ser de tipo JPG o PNG'),
    v.maxSize(convertBinaryUnits(5, 'MB', 'B'), 'La imagen debe pesar menos de 5MB')
  )
);

export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el correo'),
  v.email('Debes ingresar un correo válido'),
  v.maxLength(255, 'El correo debe tener menos de 255 caracteres'),
);

export const NameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
  v.maxLength(255, 'El nombre debe tener menos de 255 caracteres'),
);

export const UserProfileSchema = v.object({
  avatar: UserAvatarSchema,
  email: EmailSchema,
  name: NameSchema,
});

export const ResetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(
      v.string(),
      v.nonEmpty('Debes ingresar la contraseña'),
      v.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
    ),
    confirm_password: v.pipe(
      v.string(),
      v.nonEmpty('Debes confirmar la contraseña'),
      v.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
    ),
    current_password: v.pipe(
      v.string(),
      v.nonEmpty('Debes ingresar la contraseña actual'),
      v.minLength(8, 'La contraseña debe tener al menos 8 caracteres')
    ),
  }),
  v.custom((data) => {
    if (typeof data === 'object' && data !== null && 'password' in data && 'confirmPassword' in data) {
      if (data.password !== data.confirmPassword) {
        return false;
      }
    }
    return true;
  })
);