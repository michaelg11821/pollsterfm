import { api } from "@/lib/convex/_generated/api";
import { useQuery } from "convex/react";
import Image from "next/image";
import PollAuthorImageSkeleton from "./skeleton";

type PollAuthorImageProps = {
  username: string;
};

function PollAuthorImage({ username }: PollAuthorImageProps) {
  const profile = useQuery(api.user.getProfile, { username });

  if (profile === undefined) return <PollAuthorImageSkeleton />;

  if (profile === null) return null;

  return (
    <div className="bg-background relative m-0 flex h-10 w-10 cursor-pointer items-center justify-center gap-1.5 rounded-full border-none outline-0 focus:outline-2 focus:outline-offset-2">
      {profile.image && (
        <Image
          src={profile.image}
          alt=""
          fill
          className="rounded-full object-cover"
        />
      )}
    </div>
  );
}

export default PollAuthorImage;
