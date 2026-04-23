function ArtistCardSkeleton() {
  return (
    <div className="bg-card block rounded-xl border p-4 no-underline">
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-full">
        <div className="skeleton h-full w-full animate-pulse rounded-full"></div>
      </div>
      <div className="skeleton h-5 w-25 animate-pulse rounded-lg"></div>
    </div>
  );
}

export default ArtistCardSkeleton;
