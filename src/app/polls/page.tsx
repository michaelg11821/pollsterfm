import { SITE_NAME } from "@/lib/constants/site-info";
import type { Metadata } from "next";
import Polls from "../components/polls/polls";

export const metadata: Metadata = {
  title: `Polls | ${SITE_NAME}`,
  description: "See more music polls on pollster.fm!",
};

function PollsPage() {
  return (
    <main className="content-wrapper px-5 pt-4 pb-8 xl:px-0">
      <h2 className="my-6 text-3xl font-bold">Polls</h2>
      <Polls />
    </main>
  );
}

export default PollsPage;
