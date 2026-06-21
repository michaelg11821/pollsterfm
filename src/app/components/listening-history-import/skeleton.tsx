function ListeningHistoryImportSkeleton() {
  return (
    <section className="space-y-6 rounded-xl border p-6">
      <div className="space-y-2">
        <div className="skeleton h-8 w-72 animate-pulse rounded" />
        <div className="skeleton h-4 w-full animate-pulse rounded" />
      </div>

      <div className="space-y-2 rounded-lg border border-dashed p-8">
        <div className="mx-auto skeleton h-6 w-6 animate-pulse rounded-full" />
        <div className="mx-auto skeleton h-4 w-40 animate-pulse rounded" />
        <div className="mx-auto skeleton h-4 w-64 animate-pulse rounded" />
      </div>

      <div className="space-y-2 rounded-lg border p-4">
        <div className="skeleton h-4 w-28 animate-pulse rounded" />
        <div className="skeleton h-4 w-full animate-pulse rounded" />
      </div>

      <div className="skeleton h-10 w-full animate-pulse rounded-md" />
    </section>
  );
}

export default ListeningHistoryImportSkeleton;
