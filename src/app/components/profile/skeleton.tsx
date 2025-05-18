import { CalendarIcon } from "lucide-react";

function ProfileHeaderSkeleton() {
  return (
    <>
      <div className="relative h-36 w-full bg-[linear-gradient(to_right,oklch(0.274_0.006_286.033_/_30%),oklch(0.705_0.015_286.067_/_30%))] xl:h-48">
        <div className="bg-background/5 h-full w-full animate-pulse opacity-4"></div>
      </div>

      <div className="content-wrapper relative px-5 xl:p-0">
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-20 md:flex-row">
          <div className="relative">
            <div className="border-background bg-background/5 [position:inherit] h-32 w-32 animate-pulse overflow-hidden rounded-full border-6 md:h-40 md:w-40"></div>
          </div>

          <div className="-mt-7.5 flex-1 pt-2 md:mt-0 md:pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="bg-background/5 h-6 w-38 animate-pulse rounded-md"></div>
                <div className="bg-background/5 mt-1 h-5 w-25 animate-pulse rounded-md"></div>
              </div>
              <div className="flex items-end gap-2">
                <div className="bg-background/5 h-9 w-27 animate-pulse rounded-md"></div>
                <div className="bg-background/5 h-9 w-9 animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="bg-background/5 mt-4 h-5 w-75 animate-pulse rounded-md"></div>
            <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-2 gap-y-6 text-sm">
              <div className="mr-6 flex items-center">
                <CalendarIcon className="mr-1 h-5 w-5" />
                <div className="bg-background/5 h-4 w-25 animate-pulse rounded-md"></div>
              </div>
            </div>
            <div className="mt-4 flex gap-4">
              <div className="bg-background/5 h-5 w-20 animate-pulse rounded-md"></div>
              <div className="bg-background/5 h-5 w-20 animate-pulse rounded-md"></div>
              <div className="bg-background/5 h-5 w-20 animate-pulse rounded-md"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeaderSkeleton;
