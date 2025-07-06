import { redirect } from "next/navigation";
import { use } from "react";

type PollPageProps = {
  params: Promise<{ poll: number }>;
};

function PollPage({ params }: PollPageProps) {
  const { poll } = use(params);

  if (!poll) return redirect("/not-found");

  return (
    <>
      <p>soon</p>
    </>
  );
}

export default PollPage;
