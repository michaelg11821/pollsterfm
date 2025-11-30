import { CalendarIcon } from "lucide-react";

function ProfileHeaderSkeleton() {
  return (
    <>
      <div className="relative h-36 w-full xl:h-48">
        <div className="skeleton h-full w-full animate-pulse opacity-4"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.7)_100%)]" />
      </div>

      <div className="content-wrapper relative px-5 xl:p-0">
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-20 md:flex-row">
          <div className="relative">
            <div className="border-background skeleton [position:inherit] h-32 w-32 animate-pulse overflow-hidden rounded-full border-6 md:h-40 md:w-40"></div>
          </div>

          <div className="-mt-7.5 flex-1 pt-2 md:mt-0 md:pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="skeleton h-6 w-38 animate-pulse rounded-md"></div>
                <div className="skeleton mt-1 h-5 w-25 animate-pulse rounded-md"></div>
              </div>
              <div className="flex items-end gap-2">
                <div className="skeleton h-9 w-25 animate-pulse rounded-md"></div>
                <div className="skeleton h-9 w-9 animate-pulse rounded-md"></div>
              </div>
            </div>
            <p className="skeleton mt-4 h-5 w-75 animate-pulse rounded-md"></p>
            <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-2 gap-y-6 text-sm">
              <div className="mr-6 flex items-center">
                <CalendarIcon className="mr-1 h-5 w-5" />
                <div className="skeleton h-4 w-25 animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="skeleton h-5 w-20 animate-pulse rounded-md"></div>
              <div className="skeleton h-5 w-20 animate-pulse rounded-md"></div>
              <div className="skeleton h-5 w-20 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeaderSkeleton;
