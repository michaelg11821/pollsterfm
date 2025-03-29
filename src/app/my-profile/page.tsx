import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

import { type PollsterUser } from "@/lib/types/pollsterUser";

async function MyProfile() {
  const session = await auth();

  const user = session?.user as PollsterUser;

  if (user) {
    return redirect(`/user/${user.username}`);
  } else {
    return redirect("/sign-in");
  }
}

export default MyProfile;
