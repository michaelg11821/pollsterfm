import { auth } from "@/lib/auth";
import { Metadata } from "next";
import { redirect } from "next/navigation";

import ProviderLogins from "../components/provider-logins/provider-logins";

export const metadata: Metadata = {
  title: "Sign In | Pollster.fm",
  description: "Sign in to Pollster.fm",
};

async function SignIn() {
  const session = await auth();

  const user = session?.user;

  if (user) return redirect("/profile");

  return (
    <main className="centered-main">
      <ProviderLogins />
    </main>
  );
}

export default SignIn;
