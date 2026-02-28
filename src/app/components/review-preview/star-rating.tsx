import { cn } from "@/lib/next-utils";
import { Star } from "lucide-react";

type StarRatingProps = {
  rating: number;
};

function StarRating({ rating }: StarRatingProps) {
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < Math.floor(rating)
              ? "fill-primary text-primary"
              : i < rating
                ? "fill-primary/50 text-primary"
                : "text-muted-foreground/30",
          )}
        />
      ))}
    </div>
  );
}

export default StarRating;
