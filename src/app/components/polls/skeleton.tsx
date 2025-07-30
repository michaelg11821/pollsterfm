import PollPreviewSkeleton from "../poll-preview/skeleton";
import { Card } from "../ui/card";

function PollsSkeleton() {
  return (
    <div>
      <div className="mb-8">
        <Card className="p-6">
          <div className="flex flex-wrap justify-center gap-3">
            {Array(6)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="skeleton h-8 w-20 animate-pulse rounded"
                ></div>
              ))}
          </div>
        </Card>
      </div>
      <div className="grid gap-6">
        {Array(3)
          .fill(null)
          .map((_, i) => (
            <PollPreviewSkeleton key={`poll-preview-skeleton-${i}`} />
          ))}
      </div>
    </div>
  );
}

export default PollsSkeleton;
