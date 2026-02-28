"use client";

import { Card } from "@/app/components/ui/card";
import {
  getReviewItemHref,
  getReviewItemName,
  getReviewItemType,
} from "@/lib/convex-utils";
import type { ReviewWithUser } from "@/lib/types/pollster";
import { formatDistanceToNow } from "date-fns";
import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Badge } from "../ui/badge";
import StarRating from "./star-rating";

type ReviewPreviewProps = {
  review: ReviewWithUser;
};

function ReviewPreview({ review }: ReviewPreviewProps) {
  const itemName = getReviewItemName(review);
  const itemType = getReviewItemType(review);
  const itemHref = getReviewItemHref(review);

  return (
    <Card className="p-6 transition-[background-color]">
      <div className="flex gap-4">
        <Link href={itemHref} className="flex-shrink-0">
          <div className="relative h-20 w-20 overflow-hidden rounded-lg">
            <Image
              src={review.image}
              fill
              className="object-cover"
              alt={itemName}
            />
          </div>
        </Link>

        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="min-w-0">
              <Link
                href={itemHref}
                className="hover:text-primary truncate font-semibold transition-colors"
              >
                {itemName}
              </Link>
              <div className="text-muted-foreground flex items-center gap-2 text-sm">
                <span>{review.artist}</span>
                <Badge variant="secondary">{itemType}</Badge>
              </div>
            </div>
            <StarRating rating={review.rating} />
          </div>

          <p className="text-muted-foreground mt-2 line-clamp-3 text-sm">
            {review.text}
          </p>

          <div className="text-muted-foreground mt-3 flex items-center gap-4 text-sm">
            <Link
              href={`/user/${review.user.username}`}
              className="hover:text-foreground flex items-center gap-1.5 transition-colors"
            >
              <Avatar className="size-5">
                <AvatarImage src={review.user.image} />
                <AvatarFallback>
                  {review.user.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span>@{review.user.username}</span>
            </Link>
            <span>
              {formatDistanceToNow(review._creationTime, { addSuffix: true })}
            </span>
            <div className="flex items-center gap-1">
              <Heart className="h-3.5 w-3.5" />
              <span>{review.likes}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ReviewPreview;
