import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Slot } from 'radix-ui'

// Landing-page button (DESIGN.md "Buttons"): a full pill with a 14px medium-weight label; the
// primary is brand blue and glows on hover (GarageBox's primary shadow). Heights: sm 36 /
// default 42 / lg 48. Focus is a 2px brand-blue ring 2px outside the pill, so it shows on blue
// fills too.
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-full border border-transparent text-sm leading-5 font-medium whitespace-nowrap transition-[background-color,border-color,color,box-shadow,transform] duration-150 ease-out outline-none select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring focus-visible:outline-solid active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none aria-invalid:outline-2 aria-invalid:outline-offset-2 aria-invalid:outline-destructive aria-invalid:outline-solid [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        // The one primary action of a view: brand blue (--primary); blue glow on hover.
        default:
          'bg-primary text-primary-foreground shadow-sm shadow-primary/25 hover:bg-primary-hover hover:shadow-glow',
        // Attention: the orange ink, kept for the rare "act now" conversion (spec 09 §3.1, R7).
        cta: 'bg-cta text-cta-foreground shadow-sm shadow-cta/25 hover:bg-cta-hover hover:shadow-md hover:shadow-cta/25',
        // Secondary action: white pill, stone border, dark label.
        outline:
          'border-border-medium bg-card text-foreground shadow-xs hover:border-border-strong hover:bg-secondary aria-expanded:border-border-strong aria-expanded:bg-secondary',
        // Quiet filled action on white cards.
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-layer-selected aria-expanded:bg-layer-selected',
        // Toolbar and inline actions: no fill until hovered.
        ghost: 'bg-transparent text-foreground hover:bg-foreground/5 aria-expanded:bg-foreground/5',
        // Solid danger (white label stays AA on both themes).
        destructive:
          'bg-destructive-strong text-destructive-foreground shadow-sm shadow-destructive-strong/25 hover:bg-[color-mix(in_oklch,var(--destructive-strong),black_12%)] hover:shadow-md hover:shadow-destructive-strong/25 focus-visible:outline-destructive',
        link: 'h-auto! rounded-sm! px-0! text-brand-blue-ink underline-offset-4 shadow-none hover:underline active:scale-100',
      },
      size: {
        default:
          'h-10.5 gap-2 px-5 has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4',
        xs: "h-7 gap-1 px-3 text-xs [&_svg:not([class*='size-'])]:size-3.5",
        sm: 'h-9 gap-1.5 px-4 has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3',
        lg: 'h-12 gap-2 px-6 text-base has-data-[icon=inline-end]:pr-5 has-data-[icon=inline-start]:pl-5',
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
