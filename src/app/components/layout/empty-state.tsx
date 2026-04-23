import { cn } from "@/lib/next-utils";
import type { ComponentType, ReactNode } from "react";

type EmptyStateProps = {
  message: string;
  title?: string;
  icon?: ComponentType<{ className?: string }>;
  withIcon?: boolean;
  action?: ReactNode;
  className?: string;
};

function EmptyState({
  message,
  title,
  icon: Icon,
  withIcon = false,
  action,
  className,
}: EmptyStateProps) {
  if (!withIcon && !title && !action) {
    return (
      <p className={cn("text-muted-foreground", className)}>{message}</p>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 py-12 text-center",
        className,
      )}
    >
      {Icon ? <Icon className="text-muted-foreground h-10 w-10" /> : null}
      {title ? <h3 className="text-xl font-semibold">{title}</h3> : null}
      <p className="text-muted-foreground max-w-md">{message}</p>
      {action}
    </div>
  );
}

export default EmptyState;
