"use client";

import { getReviewType } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import type { ReviewWithUser } from "@/lib/types/pollster";
import { useQuery } from "convex/react";
import { MessageSquare } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import ReviewPreview from "../review-preview/review-preview";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import ReviewsSkeleton from "./skeleton";

const filterOptions = [
  { id: "all", label: "All Reviews" },
  { id: "album", label: "Albums" },
  { id: "track", label: "Tracks" },
  { id: "artist", label: "Artists" },
];

function Reviews() {
  const reviews = useQuery(api.pollster.review.getReviews);
  const searchParams = useSearchParams();
  const router = useRouter();

  if (reviews === undefined) return <ReviewsSkeleton />;

  if (reviews === null || reviews.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="text-muted-foreground mb-4">
          <MessageSquare className="mx-auto mb-4 h-12 w-12" />
          <p className="text-lg">No reviews yet</p>
          <p className="text-sm">Be the first to share your thoughts</p>
        </div>
      </div>
    );
  }

  const currentFilter = searchParams.get("filter");

  const filteredReviews = reviews.filter((review) => {
    if (currentFilter === "all" || currentFilter === null) return true;
    return getReviewType(review as ReviewWithUser) === currentFilter;
  });

  return (
    <div>
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {filterOptions.map((filter) => (
              <Button
                key={filter.id}
                variant={
                  currentFilter === filter.id ||
                  (filter.id === "all" && currentFilter === null)
                    ? "default"
                    : "outline"
                }
                size="sm"
                onClick={() => router.push(`?filter=${filter.id}`)}
                className={cn(
                  "cursor-pointer",
                  currentFilter === filter.id ||
                    (filter.id === "all" && currentFilter === null)
                    ? "bg-primary border-0"
                    : "bg-transparent",
                )}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-6">
        {filteredReviews.map((review) => (
          <ReviewPreview key={review._id} review={review as ReviewWithUser} />
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="py-12 text-center">
          <div className="text-muted-foreground mb-4">
            <MessageSquare className="mx-auto mb-4 h-12 w-12" />
            <p className="text-lg">No reviews found</p>
            <p className="text-sm">Try adjusting your filters</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
