import { safeParse } from 'valibot';

type SafeParseResultType = ReturnType<typeof safeParse>;
export type ValidationErrors = Record<string, SafeParseResultType['issues']>;
export type FailedValidation = {
  isValid: false;
  errors: ValidationErrors;
};
export type SuccessfulValidation = {
  isValid: true;
};
export type ValidationResult = FailedValidation | SuccessfulValidation;
