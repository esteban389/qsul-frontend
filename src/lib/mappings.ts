/* eslint-disable import/prefer-default-export */
export const mapAuditableTypeToText = (auditableType: string): string => {
  auditableType = auditableType.toLowerCase();
  switch (auditableType) {
    case 'app\\models\\answer':
      return 'Respuesta';
    case 'app\\models\\answerquestion':
      return 'Respuesta a pregunta';
    case 'app\\models\\audit':
      return 'Auditoría';
    case 'app\\models\\campus':
      return 'Seccional';
    case 'app\\models\\employee':
      return 'Empleado';
    case 'app\\models\\employeeservice':
      return 'Servicio de empleado';
    case 'app\\models\\observation':
      return 'Observación';
    case 'app\\models\\process':
      return 'Proceso';
    case 'app\\models\\question':
      return 'Pregunta';
    case 'app\\models\\respondenttype':
      return 'Tipo de encuestado';
    case 'app\\models\\service':
      return 'Servicio';
    case 'app\\models\\survey':
      return 'Encuesta';
    case 'app\\models\\user':
      return 'Usuario';
    default:
      return auditableType;
  }
};
