"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import ReviewPreview from "../review-preview/review-preview";
import UserReviewsSkeleton from "./skeleton";

type UserReviewsProps = {
  username: string;
  limit?: number;
};

function UserReviews({ username, limit }: UserReviewsProps) {
  const resolvedLimit = limit ?? 5;
  const reviews = useQuery(api.pollster.review.getUserReviews, {
    username,
    limit: resolvedLimit,
  });

  if (reviews === undefined) {
    return <UserReviewsSkeleton limit={resolvedLimit} />;
  }

  if (reviews.length === 0) {
    return <p className="text-muted-foreground text-sm">No reviews yet.</p>;
  }

  return (
    <div className="flex flex-col gap-3">
      {reviews.map((review) => (
        <ReviewPreview key={review._id} review={review} />
      ))}
    </div>
  );
}

export default UserReviews;
