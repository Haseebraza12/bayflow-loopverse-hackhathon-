import * as React from 'react'
import { cn } from 'cn'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Carbon text input: 40px, field fill, 1px bottom rule, inset 2px focus/invalid outline.
        'h-10 w-full min-w-0 rounded-none border-0 border-b border-border-strong bg-field px-4 text-sm tracking-[0.16px] text-foreground transition-[background-color,outline-color] duration-[70ms] ease-productive outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-helper hover:bg-field-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:border-transparent disabled:text-border-strong disabled:hover:bg-field aria-invalid:outline-2 aria-invalid:-outline-offset-2 aria-invalid:outline-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
