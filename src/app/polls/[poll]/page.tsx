"use client";

import { ConnectionState } from "@/app/components/connection-state";
import Messages from "@/app/components/messages";
import { ChannelProvider } from "ably/react";

import { redirect } from "next/navigation";
import { use } from "react";
import Metadata from "./metadata";

type PollPageProps = {
  params: Promise<{ poll: number }>;
};

function PollPage({ params }: PollPageProps) {
  const { poll } = use(params);

  if (!poll) return redirect("/not-found");

  return (
    <>
      <Metadata seoTitle="some poll" seoDescription="some poll description" />
      <ChannelProvider channelName={`poll-${poll}`}>
        <main>
          <ConnectionState />
          <Messages poll={poll} />
        </main>
      </ChannelProvider>
    </>
  );
}

export default PollPage;
