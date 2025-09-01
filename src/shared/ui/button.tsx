import { Slot } from '@radix-ui/react-slot';
import * as React from 'react';

import { cn } from '@/shared/lib/utils';

export function Button({
  className,
  asChild = false,
  type = 'button',
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean;
}) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(
        'bg-primary text-primary-foreground focus-visible:outline-ring inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-base font-medium whitespace-nowrap uppercase transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-dashed disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      type={type}
      {...props}
    />
  );
}

Button.displayName = 'Button';
