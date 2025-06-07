import { Toast } from "@base-ui-components/react/toast";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { siteName } from "../config";
import { toastManager } from "../lib/toast";
import Nav from "./components/nav/nav";
import { ThemeProvider } from "./components/theme-provider";

import { Suspense } from "react";
import Footer from "./components/footer/footer";
import NavSkeleton from "./components/nav/skeleton";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
            <Suspense fallback={<NavSkeleton />}>
              <Nav />
            </Suspense>
            {children}
            <Footer />
            <Toast.Viewport className="fixed top-auto right-4 bottom-4 left-auto mx-auto my-0 w-62.5 sm:right-8 sm:bottom-8 sm:w-75">
              <ToastList />
            </Toast.Viewport>
          </Toast.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
