"use client"

import * as React from "react"
import * as AccordionPrimitive from "@radix-ui/react-accordion"

import { cn } from "@/lib/utils"

const Accordion: typeof AccordionPrimitive.Root = AccordionPrimitive.Root

type AccordionItemRef = React.ElementRef<typeof AccordionPrimitive.Item>
type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>

const AccordionItem: React.ForwardRefExoticComponent<
  AccordionItemProps & React.RefAttributes<AccordionItemRef>
> = React.forwardRef<AccordionItemRef, AccordionItemProps>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item
    ref={ref}
    className={cn("border-b", className)}
    {...props}
  />
))
AccordionItem.displayName = "AccordionItem"

type AccordionTriggerRef = React.ElementRef<typeof AccordionPrimitive.Trigger>
type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>

const AccordionTrigger: React.ForwardRefExoticComponent<
  AccordionTriggerProps & React.RefAttributes<AccordionTriggerRef>
> = React.forwardRef<AccordionTriggerRef, AccordionTriggerProps>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header className="flex">
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        "flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200"
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

type AccordionContentRef = React.ElementRef<typeof AccordionPrimitive.Content>
type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>

const AccordionContent: React.ForwardRefExoticComponent<
  AccordionContentProps & React.RefAttributes<AccordionContentRef>
> = React.forwardRef<AccordionContentRef, AccordionContentProps>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
    {...props}
  >
    <div className={cn("pb-4 pt-0", className)}>{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
