import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export function Input({
  className,
  type,
  ...props
}: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'bg-background placeholder:text-muted-foreground focus-visible:outline-ring flex h-10 w-full rounded-md border px-3 py-2 text-lg transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed disabled:cursor-not-allowed disabled:opacity-50',
        className,
      )}
      {...props}
    />
  );
}
Input.displayName = 'Input';
