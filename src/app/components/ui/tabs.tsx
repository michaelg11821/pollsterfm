"use client";

import { Tabs as TabsPrimitive } from "@base-ui-components/react";
import type { ComponentProps } from "react";

import { cn } from "@/lib/next-utils";

function Tabs({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Root>) {
  return (
    <TabsPrimitive.Root
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

function TabsList({
  className,
  children,
  ...props
}: ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn(
        "bg-muted text-muted-foreground relative z-0 flex gap-1 rounded-lg px-1",
        className,
      )}
      {...props}
    >
      {children}
    </TabsPrimitive.List>
  );
}

function TabsTrigger({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Tab>) {
  return (
    <TabsPrimitive.Tab
      className={cn(
        "text-foreground/50 data-[selected]:text-foreground hover:text-foreground before:outline-ring flex h-8 items-center justify-center border-0 px-2 text-sm break-keep whitespace-nowrap transition-[color] outline-none select-none before:inset-x-0 before:inset-y-1 before:rounded-sm before:-outline-offset-1 focus-visible:relative focus-visible:before:absolute focus-visible:before:outline-2",
        className,
      )}
      {...props}
    />
  );
}

function TabsIndicator({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Indicator>) {
  return (
    <TabsPrimitive.Indicator
      className={cn(
        "bg-input absolute top-1/2 left-0 z-[-1] h-6 w-[var(--active-tab-width)] translate-x-[var(--active-tab-left)] -translate-y-1/2 rounded-sm transition-all duration-200 ease-in-out",
        className,
      )}
      {...props}
    />
  );
}

function TabsContent({
  className,
  ...props
}: ComponentProps<typeof TabsPrimitive.Panel>) {
  return (
    <TabsPrimitive.Panel
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsContent, TabsIndicator, TabsList, TabsTrigger };
