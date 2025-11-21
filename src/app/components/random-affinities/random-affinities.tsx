import { api } from "@/lib/convex/_generated/api";
import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { fetchQuery } from "convex/nextjs";
import AffinityCard from "../affinity-card/affinity-card";

type RandomAffinitiesProps = {
  amount?: number;
  upper?: boolean;
};

async function RandomAffinities({ amount }: RandomAffinitiesProps) {
  const token = await convexAuthNextjsToken();
  const affinities = await fetchQuery(
    api.pollster.affinity.getRandomAffinities,
    { amount: amount ?? 12, upper: false },
    { token },
  );

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
      {affinities.map((affinity, i) => (
        <AffinityCard key={`affinity-card-${i}`} affinity={affinity} />
      ))}
    </div>
  );
}

export default RandomAffinities;
