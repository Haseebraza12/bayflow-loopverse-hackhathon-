import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

const badgeVariants = cva(
  'group/badge inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a]:hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80',
        destructive:
          'bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20',
        outline: 'border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground',
        ghost: 'hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50',
        link: 'text-primary underline-offset-4 hover:underline',
        // BayFlow: booking status phases (spec 09 §3.3) — tinted background, dark ink, 1 px border.
        intake: 'border-status-intake-border bg-status-intake-bg text-status-intake-fg',
        inspection:
          'border-status-inspection-border bg-status-inspection-bg text-status-inspection-fg',
        estimate: 'border-status-estimate-border bg-status-estimate-bg text-status-estimate-fg',
        'estimate-rejected':
          'border-status-estimate-rejected-border bg-status-estimate-rejected-bg text-status-estimate-rejected-fg',
        parts: 'border-status-parts-border bg-status-parts-bg text-status-parts-fg',
        'repair-qc':
          'border-status-repair-qc-border bg-status-repair-qc-bg text-status-repair-qc-fg',
        handover: 'border-status-handover-border bg-status-handover-bg text-status-handover-fg',
        closed: 'border-status-closed-border bg-status-closed-bg text-status-closed-fg',
        // "Action needed" chip (spec 09 §3.4): attention surface, cta ink.
        attention: 'border-attention-border bg-attention text-cta',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function Badge({
  className,
  variant = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : 'span'

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
