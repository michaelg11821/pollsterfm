import { cn } from "@/lib/next-utils";
import type { ReactNode } from "react";

type PageShellProps = {
  variant?: "standard" | "split";
  hero?: ReactNode;
  children: ReactNode;
  className?: string;
};

function PageShell({
  variant = "standard",
  hero,
  children,
  className,
}: PageShellProps) {
  if (variant === "split") {
    return (
      <main className={cn("px-0 py-8", className)}>
        {hero}
        <div className="content-wrapper mt-10 px-5 py-0 xl:p-0">{children}</div>
      </main>
    );
  }

  return (
    <main className={cn("content-wrapper px-5 py-8 xl:px-0", className)}>
      {children}
    </main>
  );
}

export default PageShell;
