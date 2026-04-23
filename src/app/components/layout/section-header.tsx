import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/lib/next-utils";
import Link from "next/link";

type SectionHeaderAction = {
  label: string;
  href: string;
  variant?: "outline" | "ghost";
};

type SectionHeaderProps = {
  title: string;
  variant?: "main" | "sidebar";
  action?: SectionHeaderAction;
  count?: number;
  className?: string;
};

function SectionHeader({
  title,
  variant = "main",
  action,
  count,
  className,
}: SectionHeaderProps) {
  const titleClass =
    variant === "sidebar" ? "text-xl font-bold" : "text-2xl font-bold";
  const actionVariant =
    action?.variant ?? (variant === "sidebar" ? "ghost" : "outline");

  const right =
    action != null ? (
      <Link
        href={action.href}
        className={buttonVariants({ variant: actionVariant })}
      >
        {action.label}
      </Link>
    ) : count !== undefined ? (
      <span className="text-muted-foreground text-sm">{count}</span>
    ) : null;

  return (
    <div
      className={cn(
        "flex items-center justify-between",
        variant === "main" && "mb-6",
        className,
      )}
    >
      <h2 className={titleClass}>{title}</h2>
      {right}
    </div>
  );
}

export default SectionHeader;
