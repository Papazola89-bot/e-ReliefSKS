'use client';

import { useFormStatus } from 'react-dom';

export function SubmitButton({ children, className = 'button primary full', disabled = false }: {
  children: React.ReactNode; className?: string; disabled?: boolean;
}) {
  const { pending } = useFormStatus();
  return <button type="submit" className={className} disabled={disabled || pending} aria-busy={pending}>
    {pending ? 'Sedang memproses…' : children}
  </button>;
}
