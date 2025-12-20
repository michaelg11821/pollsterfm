import { api } from "@/lib/convex/_generated/api";
import { cn } from "@/lib/next-utils";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import AffinityCard from "../affinity-card/affinity-card";

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

  return (
    <div
      className={cn(
        "grid gap-3",
        isCompact
          ? "grid-cols-2 sm:grid-cols-3"
          : "grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6",
      )}
    >
      {affinities.map((affinity, i) => (
        <AffinityCard
          key={`affinity-card-${i}`}
          affinity={affinity}
          compact={isCompact}
        />
      ))}
    </div>
  );
}

export default RandomAffinities;
