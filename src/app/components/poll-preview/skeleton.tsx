import { Card } from "../ui/card";

function PollPreviewSkeleton() {
  return (
    <Card className="p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <div className="skeleton h-7 w-64 animate-pulse rounded-lg"></div>
            <div className="skeleton h-6 w-20 animate-pulse rounded-full"></div>
          </div>
          <div className="text-muted-foreground flex items-center gap-4 text-sm">
            <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
            <div className="skeleton h-5 w-28 animate-pulse rounded-lg"></div>
          </div>
        </div>
        <div className="skeleton h-5 w-5 animate-pulse rounded-full"></div>
      </div>
      <div className="flex items-center gap-2">
        <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
        <div className="flex flex-wrap gap-2">
          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
        </div>
      </div>
    </Card>
  );
}

export default PollPreviewSkeleton;
