import * as v from 'valibot';

export const EmailSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes ingresar el correo'),
  v.email('Debes ingresar un correo válido'),
);

export const RespondentTypeSchema = v.pipe(
  v.string(),
  v.nonEmpty('Debes seleccionar un tipo de encuestado'),
);
