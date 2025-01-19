'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useStorage from '@/hooks/use-storage';
import React, { useState, useEffect } from 'react';
import { UserCog } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RespondentType } from '@/types/respondentType';
import QueryRenderer from '@/components/QueryRenderer';
import { Skeleton } from '@/components/ui/skeleton';
import { safeParse } from 'valibot';
import { EmailSchema, RespondentTypeSchema } from '@/Schemas/SurveySchema';
import { Label } from '@/components/ui/label';
import ErrorText from '@/components/ui/ErrorText';
import { ValidationErrors } from '@/types/ValidationResult';
import useRespondentType from './useRespondentType';

export const SURVEY_EMAIL_KEY = 'survey-email';
export const SURVEY_USER_TYPE_KEY = 'survey-user-type';

export default function AskForEmailAndUserTypeModal() {
  const [email, setEmail] = useStorage<string>(
    SURVEY_EMAIL_KEY,
    '',
    'sessionStorage',
  );
  const [userType, setUserType] = useStorage<string>(
    SURVEY_USER_TYPE_KEY,
    '',
    'sessionStorage',
  );
  const [errors, setErrors] = useState<ValidationErrors>({
    email: undefined,
    type: undefined,
  });

  const shouldOpen = !email || !userType;
  const [open, setOpen] = useState(shouldOpen);
  const respondentTypesQuery = useRespondentType();
  const handleSave = () => {
    const { issues: emailIssues, success: emailSuccess } = safeParse(
      EmailSchema,
      email,
    );
    const { issues: typeIssues, success: typeSuccess } = safeParse(
      RespondentTypeSchema,
      userType,
    );
    if (!emailSuccess) {
      setErrors({
        ...errors,
        email: emailIssues,
      });
    }
    if (!typeSuccess) {
      setErrors({
        ...errors,
        type: typeIssues,
      });
    }
    if (email && userType && emailSuccess && typeSuccess) {
      setOpen(false);
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setEmail(value);
    const { issues, success } = safeParse(EmailSchema, value);
    if (success) {
      setErrors({
        ...errors,
        email: undefined,
      });
      return;
    }
    setErrors({
      ...errors,
      email: issues,
    });
  };

  return (
    <Dialog open={open} onOpenChange={handleSave}>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <RippleButton onClick={() => setOpen(true)} />
          </TooltipTrigger>
          <TooltipContent side="right" sideOffset={10}>
            Cambiar información personal
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DialogContent>
        <DialogTitle>Información del encuestante</DialogTitle>
        <DialogDescription>
          Ingresa tu correo electrónico y el tipo de usuario
        </DialogDescription>
        <div>
          <Label>Correo electrónico</Label>
          <Input
            className="w-full"
            placeholder="Correo electrónico"
            value={email}
            onChange={handleEmailChange}
            variant={errors.email ? 'invalid' : 'default'}
          />
          {errors.email && <ErrorText>{errors.email[0].message}</ErrorText>}
        </div>
        <QueryRenderer
          query={respondentTypesQuery}
          config={{
            pending: LoadSelect,
            error: Error,
            success: SelectRespondentType,
          }}
          successProps={{
            value: userType,
            setValue: setUserType,
            error: errors.type,
          }}
        />
        <Button onClick={handleSave}>Continuar</Button>
      </DialogContent>
    </Dialog>
  );
}

function LoadSelect() {
  return <Skeleton className="h-10 w-full" />;
}

function Error() {
  return <div>Error cargando esta información</div>;
}

type SafeParseResultType = ReturnType<typeof safeParse>;
function SelectRespondentType({
  value,
  setValue,
  data: respondentTypes,
  error,
}: {
  value: string;
  setValue: () => void;
  data: RespondentType[];
  error: SafeParseResultType['issues'];
}) {
  return (
    <div>
      <Label>Tipo de usuario</Label>
      <Select value={value} onValueChange={setValue}>
        <SelectTrigger>
          <SelectValue placeholder="Selecciona tu tipo de usuario" />
        </SelectTrigger>
        <SelectContent>
          {respondentTypes.map(type => (
            <SelectItem key={type.id} value={String(type.id)}>
              {type.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error && <ErrorText>{error[0].message}</ErrorText>}
    </div>
  );
}

interface RippleStyle {
  left: number;
  top: number;
  width: number;
  height: number;
}

const RippleButton = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...rest }, ref) => {
  const [ripples, setRipples] = useState<Array<RippleStyle & { id: number }>>(
    [],
  );

  useEffect(() => {
    ripples.forEach(ripple => {
      const timer = setTimeout(() => {
        setRipples(prevRipples => prevRipples.filter(r => r.id !== ripple.id));
      }, 1000);

      return () => clearTimeout(timer);
    });
  }, [ripples]);

  const createRipple = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();

    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    const ripple = {
      id: Date.now(),
      width: diameter,
      height: diameter,
      left: event.clientX - rect.left - radius,
      top: event.clientY - rect.top - radius,
    };

    setRipples(prevRipples => [...prevRipples, ripple]);
    if (onClick) {
      onClick(event);
    }
  };

  return (
    <button
      type="button"
      onClick={createRipple}
      ref={ref}
      {...rest}
      className="group relative size-16 overflow-hidden rounded-full bg-purple-700 shadow-[0_0_15px_rgba(147,51,234,0.5)] transition-all duration-300 hover:shadow-[0_0_30px_rgba(147,51,234,0.8)] active:scale-90">
      <div className="absolute inset-0 animate-spin bg-gradient-to-r from-purple-500 to-blue-500" />
      <div className="absolute inset-0.5 flex items-center justify-center rounded-full bg-purple-700">
        <UserCog className="relative z-10 size-10 text-white" />
      </div>
      <div className="group-hover:before:animate-glitch absolute inset-0 bg-white opacity-0 transition-opacity duration-300 before:absolute before:left-0 before:top-0 before:size-full before:translate-x-full before:bg-blue-400 before:content-[''] group-hover:opacity-20" />
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className="absolute block animate-ripple rounded-full bg-white/30"
          style={{
            left: ripple.left,
            top: ripple.top,
            width: ripple.width,
            height: ripple.height,
          }}
        />
      ))}
    </button>
  );
});
