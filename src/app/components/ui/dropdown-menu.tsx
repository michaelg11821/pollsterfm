import { Menu as DropdownMenuPrimitive } from "@base-ui-components/react/menu";
import {
  forwardRef,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";

import { cn } from "@/lib/next-utils";

const DropdownMenu = DropdownMenuPrimitive.Root;

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger;

// const DropdownMenuGroup = DropdownMenuPrimitive.Group;

// const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup;

const DropdownMenuContent = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Popup>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Positioner>
>(({ className, sideOffset = 0, alignOffset = 0, children, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Positioner
      alignOffset={alignOffset}
      sideOffset={sideOffset}
      className="isolate z-100 outline-none"
      {...props}
    >
      <DropdownMenuPrimitive.Popup
        ref={ref}
        className={cn(
          "bg-popover text-popover-foreground outline-border origin-[var(--transform-origin)] rounded-md py-1 shadow-lg shadow-gray-200 outline transition-[transform,scale,opacity] data-[ending-style]:scale-90 data-[ending-style]:opacity-0 data-[starting-style]:scale-90 data-[starting-style]:opacity-0 dark:shadow-none dark:-outline-offset-1",
          className,
        )}
      >
        {children}
      </DropdownMenuPrimitive.Popup>
    </DropdownMenuPrimitive.Positioner>
  </DropdownMenuPrimitive.Portal>
));
DropdownMenuContent.displayName = DropdownMenuPrimitive.Popup.displayName;

const DropdownMenuItem = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Item>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
  }
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "data-[highlighted]:before:bg-popover-foreground/8 flex cursor-pointer items-center gap-2.5 px-2.5 py-1.5 text-[0.83rem] leading-4 outline-0 select-none data-[highlighted]:relative data-[highlighted]:z-0 data-[highlighted]:before:absolute data-[highlighted]:before:inset-x-1 data-[highlighted]:before:inset-y-0 data-[highlighted]:before:z-[-1] data-[highlighted]:before:rounded-sm",
      className,
    )}
    {...props}
  />
));
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

const DropdownMenuSeparator = forwardRef<
  ElementRef<typeof DropdownMenuPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("bg-muted mx-4 my-1.5 h-px", className)}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
};
