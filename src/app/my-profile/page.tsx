import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

async function MyProfile() {
  const session = await auth();

  const user = session?.user;

  if (user) {
    return redirect(`/user/${user.username}`);
  } else {
    return redirect("/sign-in");
  }
}

export default MyProfile;
