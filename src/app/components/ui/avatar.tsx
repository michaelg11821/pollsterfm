"use client";

import { Avatar as AvatarPrimitive } from "@base-ui-components/react/avatar";
import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

function Avatar({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "bg-muted inline-flex size-12 items-center justify-center overflow-hidden rounded-full align-middle text-base font-medium select-none",
        className,
      )}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("size-full object-cover", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn("flex size-full items-center justify-center", className)}
      {...props}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
