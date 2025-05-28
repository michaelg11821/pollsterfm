import { enUS } from "date-fns/locale";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/data-access/user/read";

import type { Month } from "date-fns";

import Image from "next/image";

import EditProfile from "../edit-profile/edit-profile";

import { Calendar, Ellipsis } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

type ProfileHeaderProps = {
  username: string;
};

async function ProfileHeader({ username }: ProfileHeaderProps) {
  const profile = await getProfile(username);

  if (!profile) return redirect("/not-found");

  const session = await auth();
  const loggedInUser = session?.user;

  const joinMonth = profile.createdAt.getMonth() as Month;

  const joinDate = `${enUS.localize.month(
    joinMonth,
  )} ${profile.createdAt.getFullYear()}`;

  return (
    <>
      <div className="relative h-36 w-full xl:h-48">
        {profile.headerImage && (
          <Image
            src={profile.headerImage}
            alt=""
            fill
            sizes="100%"
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.7)_100%)]" />
      </div>
      <div className="content-wrapper relative px-5 xl:p-0">
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-20 md:flex-row">
          <div className="relative">
            <div className="border-background bg-background/5 [position:inherit] h-32 w-32 overflow-hidden rounded-full border-6 md:h-40 md:w-40">
              {profile.image && (
                <Image
                  src={profile.image}
                  className="rounded-full object-cover"
                  alt=""
                  fill
                  sizes="100%"
                  priority
                />
              )}
            </div>
          </div>
          <div className="-mt-7.5 flex-1 pt-2 md:mt-0 md:pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">
                  {profile.name}
                </h1>
                <p className="text-[#9F9F9A]">@{username}</p>
              </div>
              <div className="flex items-end gap-2">
                {loggedInUser?.username === username ? (
                  <EditProfile
                    headerImage={profile.headerImage}
                    profileIcon={profile.image}
                    name={profile.name}
                    username={username}
                    aboutMe={profile.aboutMe}
                  />
                ) : (
                  <Button
                    variant="default"
                    className="bg-background cursor-pointer px-4 py-2"
                  >
                    Follow
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="cursor-pointer bg-transparent px-2.5 py-3.5"
                >
                  <Ellipsis className="text-muted-foreground h-5 w-5" />
                </Button>
              </div>
            </div>
            <p className="text-foreground/80 mt-4 max-w-128">
              {profile.aboutMe}
            </p>
            <div className="text-muted-foreground mt-4 flex flex-wrap gap-x-2 gap-y-6 text-sm">
              {profile.createdAt && (
                <div className="mr-6 flex items-center">
                  <Calendar className="mr-1 h-5 w-5" />
                  <span>Joined {joinDate}</span>
                </div>
              )}
            </div>
            <div className="mt-4 flex gap-4 text-sm">
              <Link
                href="#"
                className="text-foreground/80 hover:text-foreground"
              >
                <span className="font-bold">33</span>
                <span className="text-muted-foreground ml-1">Following</span>
              </Link>
              <Link
                href="#"
                className="text-foreground/80 hover:text-foreground"
              >
                <span className="font-bold">33</span>
                <span className="text-muted-foreground ml-1">Followers</span>
              </Link>
              <Link
                href="#"
                className="text-foreground/80 hover:text-foreground"
              >
                <span className="font-bold">33</span>
                <span className="text-muted-foreground ml-1">
                  Polls Created
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileHeader;
