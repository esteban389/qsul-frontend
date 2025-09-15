import * as v from 'valibot';

export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el correo'),
  v.email('Debes ingresar un correo válido'),
  v.maxLength(255, 'El correo debe tener menos de 255 caracteres'),
);

export const RespondentTypeSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes seleccionar un tipo de encuestado'),
);

export const ObservationDescriptionShchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar una descripción'),
  v.maxLength(255, 'La descripción debe tener menos de 255 caracteres'),
);

export const ObservationTypeSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes seleccionar un tipo de observación'),
  v.maxLength(255, 'El tipo de observación debe tener menos de 255 caracteres'),
);
