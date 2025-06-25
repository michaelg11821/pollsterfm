import type { Metadata } from "next";

import { siteName } from "../../config";

import AblyWrapper from "../components/ably-wrapper";

export const metadata: Metadata = {
  title: `Polls | ${siteName}`,
  description: `See more polls on ${siteName}.`,
};

export default function PollsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <AblyWrapper>{children}</AblyWrapper>;
}
