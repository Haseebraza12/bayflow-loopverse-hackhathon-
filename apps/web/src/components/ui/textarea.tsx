import * as React from 'react'
import { cn } from 'cn'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'flex field-sizing-content min-h-20 px-4 py-[11px] leading-5 w-full min-w-0 rounded-none border-0 border-b border-border-strong bg-field text-sm tracking-[0.16px] text-foreground transition-[background-color,outline-color] duration-[70ms] ease-productive outline-none placeholder:text-helper hover:bg-field-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:border-transparent disabled:text-border-strong disabled:hover:bg-field aria-invalid:outline-2 aria-invalid:-outline-offset-2 aria-invalid:outline-destructive',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
