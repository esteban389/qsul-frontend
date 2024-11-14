import { email, nonEmpty, object, pipe, safeParse } from 'valibot';
import { ValidationResult } from '@/types/ValidationResult';
import { useMutation } from '@tanstack/react-query';

function sendRequest(email: string) {
  console.log('Sending request to server with email: ', email);
}

const ForgotPasswordSchema = object({
  email: pipe(
    nonEmpty('Debes ingresar el correo'),
    email('Debes ingresar un correo válido'),
  ),
});

function validateRequest(email: string): ValidationResult {
  const result = safeParse(ForgotPasswordSchema, { email });
  if (result.success) {
    return { isValid: true };
  }
  return {
    isValid: false,
    errors: { email: result.issues },
  };
}

export default function useForgotPassword(email: string) {
  const validationResult = validateRequest(email);
  const mutation = useMutation({
    mutationFn: () => sendRequest(email),
  });
  if (!validationResult.isValid) {
    return validationResult.errors;
  }
  return mutation;
}
