import ReviewPreviewSkeleton from "../review-preview/skeleton";
import { Card } from "../ui/card";

function ReviewsSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-8 w-24 animate-pulse rounded"
                />
              ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <ReviewPreviewSkeleton key={i} />
          ))}
      </div>
    </div>
  );
}

export default ReviewsSkeleton;
