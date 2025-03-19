import { auth } from "@/auth";
import { redirect } from "next/navigation";

import ProviderLogins from "../components/provider-logins";

async function SignIn() {
  const session = await auth();

  const user = session?.user;

  if (user) return redirect("/profile");

  return <ProviderLogins />;
}

export default SignIn;
