"use client";

import { Switch as SwitchPrimitive } from "@base-ui-components/react/switch";
import type { ComponentProps } from "react";

import { cn } from "@/lib/next-utils";

function Switch({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Root>) {
  return (
    <SwitchPrimitive.Root
      className={cn(
        "bg-input data-[checked]:bg-primary focus-visible:ring-ring focus-visible:ring-offset-background relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <SwitchThumb />
    </SwitchPrimitive.Root>
  );
}

function SwitchThumb({
  className,
  ...props
}: ComponentProps<typeof SwitchPrimitive.Thumb>) {
  return (
    <SwitchPrimitive.Thumb
      className={cn(
        "bg-background pointer-events-none block h-5 w-5 rounded-full shadow-lg ring-0 transition-transform data-[checked]:translate-x-5 data-[unchecked]:translate-x-0",
        className,
      )}
      {...props}
    />
  );
}

export { Switch, SwitchThumb };
