'use client'

import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from 'cn'
import { Tabs as TabsPrimitive } from 'radix-ui'

function Tabs({
  className,
  orientation = 'horizontal',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      data-orientation={orientation}
      className={cn('group/tabs flex gap-0 data-horizontal:flex-col', className)}
      {...props}
    />
  )
}

const tabsListVariants = cva(
  // Carbon tabs: a row of 40px line tabs over a 1px subtle rule; the active tab gets a 2px bar.
  'group/tabs-list inline-flex w-fit max-w-full items-end overflow-x-auto rounded-none p-0 text-muted-foreground shadow-[inset_0_-1px_0_var(--border-subtle)] group-data-horizontal/tabs:h-10 group-data-vertical/tabs:h-fit group-data-vertical/tabs:flex-col group-data-vertical/tabs:shadow-[inset_-1px_0_0_var(--border-subtle)]',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        line: 'bg-transparent',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

function TabsList({
  className,
  variant = 'default',
  ...props
}: React.ComponentProps<typeof TabsPrimitive.List> & VariantProps<typeof tabsListVariants>) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      data-variant={variant}
      className={cn(tabsListVariants({ variant }), className)}
      {...props}
    />
  )
}

function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        "relative inline-flex h-10 shrink-0 items-center justify-start gap-2 rounded-none px-4 text-sm tracking-[0.16px] whitespace-nowrap text-muted-foreground shadow-[inset_0_-2px_0_transparent] transition-[color,box-shadow] duration-[70ms] ease-productive outline-none group-data-vertical/tabs:w-full hover:text-foreground hover:shadow-[inset_0_-2px_0_var(--border-strong)] focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:text-border-strong data-active:font-semibold data-active:text-foreground data-active:shadow-[inset_0_-2px_0_var(--primary)] group-data-vertical/tabs:data-active:shadow-[inset_3px_0_0_var(--primary)] [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      {...props}
    />
  )
}

function TabsContent({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Content>) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn('flex-1 pt-4 text-sm outline-none', className)}
      {...props}
    />
  )
}

export { Tabs, TabsList, TabsTrigger, TabsContent, tabsListVariants }
