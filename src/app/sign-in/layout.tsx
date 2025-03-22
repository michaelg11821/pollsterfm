import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "../globals.css";
import styles from "./layout.module.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

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
    <html lang="en">
      <body className={`${inter.variable}`}>
        <h1 className={styles.platformName}>Pollster.fm</h1>
        {children}
      </body>
    </html>
  );
}
