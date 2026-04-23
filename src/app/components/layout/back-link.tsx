import { buttonVariants } from "@/app/components/ui/button";
import { cn } from "@/lib/next-utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

type BackLinkProps = {
  href: string;
  label?: string;
  className?: string;
};

function BackLink({ href, label = "Back", className }: BackLinkProps) {
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(
        buttonVariants({ variant: "ghost", size: "icon" }),
        className,
      )}
    >
      <ChevronLeft />
      <span className="visually-hidden">{label}</span>
    </Link>
  );
}

export default BackLink;
