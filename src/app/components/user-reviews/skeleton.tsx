import ReviewPreviewSkeleton from "../review-preview/skeleton";

type UserReviewsSkeletonProps = {
  limit: number;
};

function UserReviewsSkeleton({ limit }: UserReviewsSkeletonProps) {
  return (
    <div className="flex flex-col gap-3">
      {Array.from({ length: limit }).map((_, i) => (
        <ReviewPreviewSkeleton key={i} />
      ))}
    </div>
  );
}

export default UserReviewsSkeleton;
