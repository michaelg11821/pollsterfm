import type { Affinity } from "@/lib/types/pollster";
import { Card } from "../ui/card";

type AffinityCardProps = {
  affinity: Affinity;
};

function AffinityCard({ affinity }: AffinityCardProps) {
  return (
    <Card className="bg-primary/20 border-primary/20 hover:bg-primary/30 h-32 cursor-pointer justify-center transition-[background-color]">
      <span className="self-center text-lg font-medium">{affinity}</span>
    </Card>
  );
}

export default AffinityCard;
