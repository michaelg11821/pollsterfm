import { Card } from "../ui/card";

function PollPreviewSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="skeleton h-6 w-full animate-pulse rounded-lg sm:h-7 sm:max-w-64"></div>
            <div className="skeleton h-6 w-20 animate-pulse rounded-full"></div>
          </div>
          <div className="text-muted-foreground flex flex-col items-start gap-2 text-sm sm:flex-row sm:items-center sm:gap-4">
            <div className="skeleton h-5 w-20 animate-pulse rounded-lg sm:w-24"></div>
            <div className="skeleton h-5 w-24 animate-pulse rounded-lg sm:w-28"></div>
          </div>
        </div>
        <div className="skeleton h-5 w-5 flex-shrink-0 animate-pulse rounded-full"></div>
      </div>
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center">
        <div className="skeleton h-5 w-20 animate-pulse rounded-lg sm:w-24"></div>
        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
        </div>
      </div>
    </Card>
  );
}

export default PollPreviewSkeleton;
