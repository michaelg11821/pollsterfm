import { Card, CardContent, CardHeader } from "../ui/card";

function PollSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <div className="skeleton h-6 w-20 animate-pulse rounded-full"></div>
            <div className="skeleton h-5 w-24 animate-pulse rounded-lg"></div>
          </div>
          <div className="skeleton h-10 w-96 animate-pulse rounded-lg lg:h-11 lg:w-[32rem]"></div>
          <div className="skeleton mt-4 h-6 w-64 animate-pulse rounded-lg"></div>
          <div className="mt-4 flex items-center gap-3">
            <div className="skeleton h-10 w-10 animate-pulse rounded-full"></div>
            <div>
              <div className="skeleton h-5 w-32 animate-pulse rounded-lg"></div>
              <div className="skeleton mt-1 h-4 w-24 animate-pulse rounded-lg"></div>
            </div>
          </div>
        </div>
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="skeleton h-7 w-32 animate-pulse rounded-lg"></div>
              <div className="skeleton h-6 w-24 animate-pulse rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array(3)
              .fill(null)
              .map((_, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-lg border-white/10 bg-white/5 transition-all duration-300"
                >
                  <div className="p-4">
                    <div className="mb-3 flex items-center gap-4">
                      <div className="skeleton h-16 w-16 animate-pulse rounded-lg"></div>
                      <div className="min-w-0 flex-1">
                        <div className="skeleton h-6 w-48 animate-pulse rounded-lg"></div>
                        <div className="mt-1 flex gap-1">
                          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
                          <div className="skeleton h-5 w-16 animate-pulse rounded-full"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="skeleton h-7 w-24 animate-pulse rounded-lg"></div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="skeleton h-4 w-20 animate-pulse rounded-lg"></div>
                <div className="skeleton mt-1 h-7 w-16 animate-pulse rounded-lg"></div>
              </div>
              <div>
                <div className="skeleton h-4 w-20 animate-pulse rounded-lg"></div>
                <div className="skeleton mt-1 h-7 w-16 animate-pulse rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="skeleton h-2 w-2 animate-pulse rounded-full"></div>
              <div className="skeleton h-7 w-32 animate-pulse rounded-lg"></div>
              <div className="skeleton h-6 w-20 animate-pulse rounded-full"></div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="mb-4 grid grid-cols-2 gap-3">
              <div className="bg-accent/80 rounded-lg p-2 text-center">
                <div className="skeleton h-7 w-12 animate-pulse rounded-lg"></div>
                <div className="skeleton mt-1 h-4 w-24 animate-pulse rounded-lg"></div>
              </div>
              <div className="bg-accent/80 rounded-lg p-2 text-center">
                <div className="skeleton h-7 w-12 animate-pulse rounded-lg"></div>
                <div className="skeleton mt-1 h-4 w-24 animate-pulse rounded-lg"></div>
              </div>
            </div>
            <div className="skeleton h-px w-full animate-pulse"></div>
            <div className="space-y-2">
              <div className="skeleton h-4 w-32 animate-pulse rounded-lg"></div>
              {Array(3)
                .fill(null)
                .map((_, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <div className="skeleton h-6 w-6 animate-pulse rounded-full"></div>
                    <div className="min-w-0 flex-1">
                      <div className="skeleton h-4 w-24 animate-pulse rounded-lg"></div>
                      <div className="skeleton mt-1 h-4 w-32 animate-pulse rounded-lg"></div>
                    </div>
                    <div className="skeleton h-4 w-16 animate-pulse rounded-lg"></div>
                  </div>
                ))}
            </div>
            <div className="skeleton h-8 w-32 animate-pulse rounded-lg"></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default PollSkeleton;
