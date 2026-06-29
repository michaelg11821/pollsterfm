import EmptyState from "../layout/empty-state";
import SectionHeader from "../layout/section-header";

type TopListenersProps = {
  category: "artist" | "album" | "track";
  itemName: string;
};

async function TopListeners({ category, itemName }: TopListenersProps) {
  return (
    <section>
      <SectionHeader title="Top Listeners" />
      <EmptyState
        message={`Top listener rankings for this ${category}, "${itemName}", are not available yet.`}
      />
    </section>
  );
}

export default TopListeners;
