"use client";

import Image from "next/image";

import EditProfile from "../edit-profile/edit-profile";

import { SITE_NAME } from "@/lib/constants/site-info";
import { getDateFromCreatedAt } from "@/lib/convex-utils";
import { api } from "@/lib/convex/_generated/api";
import { toastManager } from "@/lib/toast";
import { useMutation, useQuery } from "convex/react";
import { Calendar, Ellipsis, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";
import ProfileHeaderSkeleton from "./skeleton";

import * as Sentry from "@sentry/nextjs";
import { useRouter } from "next/navigation";
import { useState } from "react";

type ProfileHeaderProps = {
  username: string;
};

function ProfileHeader({ username }: ProfileHeaderProps) {
  const [followLoading, setFollowLoading] = useState<boolean>(false);

  const profile = useQuery(api.user.getProfile, { username });
  const user = useQuery(api.user.currentUser);
  const isFollowing = useQuery(api.user.isFollowing, { username });

  // const { followers, status, loadMore } = usePaginatedQuery(
  //   api.user.getFollowers,
  //   { username },
  //   { initialNumItems: 10 },
  // );

  const followUser = useMutation(api.user.followUser);
  const unfollowUser = useMutation(api.user.unfollowUser);

  const router = useRouter();

  if (
    profile === undefined ||
    user === undefined ||
    isFollowing === undefined
  ) {
    return <ProfileHeaderSkeleton />;
  }

  if (profile === null) {
    router.push("/not-found");
    return null;
  }

  const createdAtDate = new Date(profile.createdAt);

  const joinDate = getDateFromCreatedAt(profile.createdAt);

  const onFollow = async () => {
    try {
      setFollowLoading(true);

      const result = await followUser({ username });

      if (result === null) return;

      if ("error" in result) {
        switch (result.error) {
          case "INTERNAL_SERVER_ERROR":
            return toastManager.add({
              title: "Error",
              description: `Unknown error attempting to follow ${username}. Please try again.`,
            });
          case "NOT_FOUND":
            return toastManager.add({
              title: "Error",
              description: `Could not find ${username} on ${SITE_NAME}. Their username may have changed.`,
            });
          case "UNAUTHORIZED":
            return toastManager.add({
              title: "Error",
              description: `Please log in to follow ${username} on ${SITE_NAME}.`,
            });
        }
      }
    } catch (err: unknown) {
      Sentry.captureException(err);

      return toastManager.add({
        title: "Error",
        description:
          "Unknown error attempting to follow ${username}. Please try again.",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  const onUnfollow = async () => {
    try {
      setFollowLoading(true);

      const result = await unfollowUser({ username });

      if (result === null) return;

      if ("error" in result) {
        switch (result.error) {
          case "INTERNAL_SERVER_ERROR":
            return toastManager.add({
              title: "Error",
              description: `Unknown error attempting to unfollow ${username}. Please try again.`,
            });
          case "NOT_FOUND":
            return toastManager.add({
              title: "Error",
              description: `Could not find ${username} on ${SITE_NAME}. Their username may have changed.`,
            });
          case "UNAUTHORIZED":
            return toastManager.add({
              title: "Error",
              description: `Please log in to unfollow ${username} on ${SITE_NAME}.`,
            });
        }
      }
    } catch (err: unknown) {
      Sentry.captureException(err);

      return toastManager.add({
        title: "Error",
        description:
          "Unknown error attempting to unfollow ${username}. Please try again.",
      });
    } finally {
      setFollowLoading(false);
    }
  };

  return (
    <>
      <div className="relative h-36 w-full xl:h-48">
        {profile.headerImage && (
          <Image
            src={profile.headerImage}
            alt=""
            fill
            sizes="100%"
            className="profile-header-image object-cover"
          />
        )}
        <div className="profile-header-image-mask absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0)_0%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.7)_100%)]" />
      </div>
      <div className="content-wrapper relative px-5 xl:p-0">
        <div className="relative -mt-16 flex flex-col gap-6 md:-mt-20 md:flex-row">
          <div className="profile-avatar-image relative">
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
          <div className="profile-info -mt-7.5 flex-1 pt-2 md:mt-0 md:pt-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-[#9F9F9A]">@{username}</p>
              </div>
              <div className="flex items-end gap-2">
                {user?.username === username ? (
                  <EditProfile
                    headerImage={profile.headerImage}
                    profileIcon={profile.image as string | undefined}
                    name={profile.name}
                    username={username}
                    aboutMe={profile.aboutMe}
                  />
                ) : isFollowing === false ? (
                  <Button
                    variant="default"
                    className="bg-primary w-25 cursor-pointer px-4 py-2"
                    onClick={async () => await onFollow()}
                  >
                    {followLoading ? (
                      <Loader2 className="h-5 w-25 animate-spin" />
                    ) : (
                      "Follow"
                    )}
                  </Button>
                ) : isFollowing === true ? (
                  <Button
                    variant="secondary"
                    className="w-25 cursor-pointer px-4 py-2"
                    onClick={async () => await onUnfollow()}
                  >
                    {followLoading ? (
                      <Loader2 className="h-5 w-25 animate-spin" />
                    ) : (
                      "Following"
                    )}
                  </Button>
                ) : (
                  ""
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
              {createdAtDate && (
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
                href={`/user/${username}/polls`}
                className="text-foreground/80 hover:text-foreground"
              >
                <span className="font-bold">
                  {profile.createdPolls?.length ?? 0}
                </span>
                <span className="text-muted-foreground ml-1">
                  Poll
                  {profile.createdPolls
                    ? profile.createdPolls.length > 1
                      ? "s "
                      : " "
                    : "s "}
                  Created
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
