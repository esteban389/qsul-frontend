import * as v from 'valibot';
import { convertBinaryUnits } from '@/lib/utils';

export const CampusNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
  v.maxLength(255, 'El nombre debe tener menos de 255 caracteres'),
);

export const CampusAddressSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar la dirección'),
  v.minLength(3, 'La dirección debe tener al menos 3 caracteres'),
  v.maxLength(255, 'La dirección debe tener menos de 255 caracteres'),
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

export const OptionalCampusIconSchema = v.optional(CampusIconSchema);

// ---- Processes schemas
export const ProcessNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
  v.maxLength(255, 'El nombre debe tener menos de 255 caracteres'),
);

export const ProcessIconSchema = v.pipe(
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

export const OptionalProcessIconSchema = v.optional(ProcessIconSchema);

// ---- Services schemas
export const ServiceNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
  v.maxLength(255, 'El nombre debe tener menos de 255 caracteres'),
);

export const ServiceIconSchema = v.pipe(
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

export const ServiceProcessSchema = v.number('Debes seleccionar un proceso');

export const OptionalServiceIconSchema = v.optional(ServiceIconSchema);

// ---- Employee schemas
export const EmployeeNameSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el nombre'),
  v.minLength(3, 'El nombre debe tener al menos 3 caracteres'),
  v.maxLength(255, 'El nombre debe tener menos de 255 caracteres'),
);

export const EmployeeEmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el correo'),
  v.email('Debes ingresar un correo válido'),
  v.maxLength(255, 'El correo debe tener menos de 255 caracteres'),
);

export const EmployeeAvatarSchema = v.pipe(
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

export const EmployeeProcessSchema = v.number('Debes seleccionar un proceso');

export const OptionalEmployeeAvatarSchema = v.optional(EmployeeAvatarSchema);
