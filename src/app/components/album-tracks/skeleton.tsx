import LoadingIndicator from "../ui/loading-indicator";

function AlbumTracksSkeleton() {
  return (
    <section>
      <h2 className="mb-6 text-2xl font-bold">Tracks</h2>
      <LoadingIndicator loading={true} message="Loading more tracks..." />
    </section>
  );
}

export default AlbumTracksSkeleton;
