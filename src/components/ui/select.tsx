import * as React from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className, children, ...props }, ref) => {
  return (
    <div className="relative w-full">
      <select
        className={cn(
          'flex h-10 w-full appearance-none rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/40 dark:bg-zinc-900/30 pl-3.5 pr-10 py-2 text-sm shadow-sm transition-all duration-200 focus-visible:outline-none focus-visible:border-primary/80 focus-visible:bg-white dark:focus-visible:bg-zinc-950 focus-visible:ring-4 focus-visible:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-50 text-foreground dark:text-zinc-100',
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
      <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 dark:text-zinc-500">
        <ChevronDown className="h-4.5 w-4.5 stroke-[2.5]" />
      </span>
    </div>
  );
});
Select.displayName = 'Select';

export { Select };
