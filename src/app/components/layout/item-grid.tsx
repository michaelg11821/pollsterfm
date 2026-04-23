import { cn } from "@/lib/next-utils";
import type { ReactNode } from "react";

type ItemGridProps = {
  density?: "default" | "dense" | "compact";
  gap?: "sm" | "md";
  className?: string;
  children: ReactNode;
};

const DENSITY_CLASSES: Record<NonNullable<ItemGridProps["density"]>, string> = {
  default: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  dense: "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  compact:
    "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6",
};

const GAP_CLASSES: Record<NonNullable<ItemGridProps["gap"]>, string> = {
  sm: "gap-4",
  md: "gap-6",
};

function ItemGrid({
  density = "default",
  gap = "md",
  className,
  children,
}: ItemGridProps) {
  return (
    <div
      className={cn("grid", DENSITY_CLASSES[density], GAP_CLASSES[gap], className)}
    >
      {children}
    </div>
  );
}

export default ItemGrid;
