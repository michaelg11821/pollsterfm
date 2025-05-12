import { Metadata } from "next";

import { siteName } from "@/config";

export const metadata: Metadata = {
  title: `Error | ${siteName}`,
  description: "An error has occurred.",
};

function Error() {
  return (
    <main className="centered-main">
      <h2 className="mb-5 text-center text-3xl font-bold">Error ⚠️</h2>
      <p className="max-w-100 text-center text-xl font-light">
        A major error has occurred. Please contact an admin if the issue
        persists.
      </p>
    </main>
  );
}

export default Error;
