"use client";

import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import TopAffinitiesBase from "./base";

type TopUserAffinitiesProps = {
  username: string;
};

function TopUserAffinities({ username }: TopUserAffinitiesProps) {
  const userAffinities = useQuery(api.user.getAffinities, {
    amount: 6,
    username,
  });

  return <TopAffinitiesBase affinities={userAffinities} />;
}

export default TopUserAffinities;
