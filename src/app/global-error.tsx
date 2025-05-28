"use client";

import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { siteName } from "../config";

import Footer from "./components/footer/footer";
import NavSkeleton from "./components/nav/skeleton";

import { toastManager } from "@/lib/toast";
import { Toast } from "@base-ui-components/react";
import { ThemeProvider } from "./components/theme-provider";
import ToastList from "./components/ui/toast-list";
import "./globals.css";

const lexend = Lexend({
  variable: "--font-lexend",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: `Home | ${siteName}`,
  description: "A poll-based music social platform",
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html
      lang="en"
      className={`${lexend.variable} antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-svh">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toast.Provider toastManager={toastManager}>
            <NavSkeleton />
            <main className="centered-main">
              <h2 className="mb-5 text-center text-3xl font-bold">Error ⚠️</h2>
              <p className="max-w-100 text-center text-xl font-light">
                A major error has occurred. Please contact an admin if the issue
                persists.
              </p>
            </main>
            <Footer />
            <Toast.Viewport className="absolute top-auto right-8 bottom-8 left-auto mt-0 mr-auto mb-0 ml-auto w-full max-w-75">
              <ToastList />
            </Toast.Viewport>
          </Toast.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
