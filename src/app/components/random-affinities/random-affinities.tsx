import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import AffinityCard from "../affinity-card/affinity-card";
import ItemGrid from "../layout/item-grid";

type RandomAffinitiesProps = {
  amount?: number;
  compact?: boolean;
};

async function RandomAffinities({ amount, compact }: RandomAffinitiesProps) {
  const token = await convexAuthNextjsToken();
  const affinities = await fetchQuery(
    api.pollster.affinity.getRandomAffinities,
    { amount: amount ?? 12, upper: false },
    { token },
  );

  const isCompact = compact ?? (amount !== undefined && amount <= 6);

  if (isCompact) {
    return (
      <div className={cn("grid grid-cols-2 gap-3 sm:grid-cols-3")}>
        {affinities.map((affinity, i) => (
          <AffinityCard
            key={`affinity-card-${i}`}
            affinity={affinity}
            compact
          />
        ))}
      </div>
    );
  }

  return (
    <ItemGrid density="compact" gap="sm">
      {affinities.map((affinity, i) => (
        <AffinityCard key={`affinity-card-${i}`} affinity={affinity} />
      ))}
    </ItemGrid>
  );
}

export default RandomAffinities;
