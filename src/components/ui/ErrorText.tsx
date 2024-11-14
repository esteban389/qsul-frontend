import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ErrorTextProps extends HTMLAttributes<HTMLParagraphElement> {
  className?: string;
  children?: ReactNode;
}

export default function ErrorText({
  className,
  children,
  ...props
}: ErrorTextProps) {
  return (
    <p className={cn('mt-2 text-xs text-destructive', className)} role="alert"
       aria-live="polite" {...props}>
      {children}
    </p>
  );
}