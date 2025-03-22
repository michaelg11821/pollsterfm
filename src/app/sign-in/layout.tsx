import type { Metadata } from "next";

import styles from "./layout.module.css";

export const metadata: Metadata = {
  title: "Sign In | Pollster.fm",
  description: "Sign in to Pollster.fm",
};

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div id={styles.root}>
      <h1 className={styles.platformName}>Pollster.fm</h1>
      {children}
    </div>
  );
}
