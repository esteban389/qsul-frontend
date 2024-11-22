import * as v from 'valibot';
import { convertBinaryUnits } from '@/lib/utils';

export const CampusNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
);

export const CampusAddressSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar la dirección'),
  v.minLength(3, 'La dirección debe tener al menos 3 caracteres'),
);

export const CampusIconSchema = v.pipe(
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

export const OptionalCampusIconScheme = v.optional(CampusIconSchema);
