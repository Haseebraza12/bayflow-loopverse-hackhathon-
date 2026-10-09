import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

// Carbon button (DESIGN.md §Buttons): 14px regular label, Carbon heights (sm 32 / md 40 / lg 48),
// fast-02 productive motion and a 2px focus ring with a 1px inset gap. BayFlow deviation: every
// button is a full pill (rounded-full) instead of Carbon's square corners.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm leading-[1.125rem] font-normal tracking-[0.16px] whitespace-nowrap transition-[background-color,border-color,color,box-shadow] duration-[110ms] ease-productive outline-none select-none focus-visible:shadow-[inset_0_0_0_1px_var(--background)] focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-ring disabled:pointer-events-none disabled:border-transparent disabled:bg-layer-selected disabled:text-border-strong aria-invalid:outline-2 aria-invalid:outline-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // Carbon primary
        default: 'bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary-hover',
        // BayFlow: the one orange conversion button per customer-portal screen (spec 09 §3.1, R7).
        cta: 'bg-cta text-cta-foreground hover:bg-cta-hover active:bg-cta-hover',
        // Carbon tertiary: outlined in the primary colour, fills on hover
        outline:
          'border-primary bg-transparent text-primary hover:bg-primary hover:text-primary-foreground aria-expanded:bg-primary aria-expanded:text-primary-foreground',
        // Carbon secondary
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-layer-selected aria-expanded:bg-layer-selected',
        // Carbon ghost
        ghost:
          'bg-transparent text-primary hover:bg-layer-hover aria-expanded:bg-layer-hover',
        // Carbon danger (solid)
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-[color-mix(in_oklch,var(--destructive),black_12%)] focus-visible:outline-destructive',
        link: 'h-auto! rounded-none! px-0! text-primary underline-offset-4 hover:underline',
      },
      size: {
        // Carbon "md" field-height button
        default:
          'h-10 gap-2 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        xs: "h-6 gap-1 px-2.5 text-xs tracking-[0.32px] [&_svg:not([class*='size-'])]:size-3",
        sm: 'h-8 gap-1.5 px-3 has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5',
        lg: 'h-12 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        icon: 'size-10',
        'icon-xs': "size-6 [&_svg:not([class*='size-'])]:size-3",
        'icon-sm': 'size-8',
        'icon-lg': 'size-12',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant = 'default',
  size = 'default',
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : 'button'

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
