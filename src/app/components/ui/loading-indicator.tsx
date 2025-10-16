import { cn } from "@/lib/next-utils";
import { Loader2 } from "lucide-react";
import type { ForwardedRef } from "react";

type LoadingIndicatorProps = {
  className?: string;
  ref?: ForwardedRef<HTMLDivElement>;
  loading: boolean;
  message?: string;
};

function LoadingIndicator({
  className,
  ref,
  loading,
  message = "Loading...",
}: LoadingIndicatorProps) {
  return (
    <div>
      <div
        ref={ref}
        className={cn("flex justify-center px-0 py-6", className)}
        data-testid="loader-ref"
      >
        {loading && (
          <div className="text-muted-foreground flex items-center gap-5">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoadingIndicator;
