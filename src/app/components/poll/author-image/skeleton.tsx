function PollAuthorImageSkeleton() {
  return (
    <div className="bg-background relative m-0 flex h-10 w-10 items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
      <div className="skeleton h-full w-full animate-pulse rounded-full"></div>
    </div>
  );
}

export default PollAuthorImageSkeleton;
