import { Card } from "../ui/card";

function ReviewPreviewSkeleton() {
  return (
    <Card className="p-6">
      <div className="flex gap-4">
        <div className="skeleton h-20 w-20 flex-shrink-0 animate-pulse rounded-lg" />
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="skeleton mb-1 h-5 w-40 animate-pulse rounded" />
              <div className="flex items-center gap-2">
                <div className="skeleton h-4 w-24 animate-pulse rounded" />
                <div className="skeleton h-5 w-14 animate-pulse rounded-full" />
              </div>
            </div>
            <div className="flex gap-0.5">
              {Array(5)
                .fill(null)
                .map((_, i) => (
                  <div
                    key={i}
                    className="skeleton h-4 w-4 animate-pulse rounded"
                  />
                ))}
            </div>
          </div>
          <div className="mt-2 space-y-1">
            <div className="skeleton h-4 w-full animate-pulse rounded" />
            <div className="skeleton h-4 w-3/4 animate-pulse rounded" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="skeleton h-5 w-24 animate-pulse rounded" />
            <div className="skeleton h-4 w-20 animate-pulse rounded" />
            <div className="skeleton h-4 w-10 animate-pulse rounded" />
          </div>
        </div>
      </div>
    </Card>
  );
}

export default ReviewPreviewSkeleton;
