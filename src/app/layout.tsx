import { siteName } from "@/lib/constants/site-info";
import { Toast } from "@base-ui-components/react/toast";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { toastManager } from "../lib/toast";
import Nav from "./components/nav/nav";
import { ThemeProvider } from "./components/theme-provider";

import { ConvexClientProvider } from "./components/convex-client-provider";
import Footer from "./components/footer/footer";
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
    <ConvexAuthNextjsServerProvider>
      <ConvexClientProvider>
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
                <Nav />
                {children}
                <Footer />
                <Toast.Viewport className="fixed top-auto right-4 bottom-4 left-auto z-100 mx-auto my-0 w-62.5 sm:right-8 sm:bottom-8 sm:w-75">
                  <ToastList />
                </Toast.Viewport>
              </Toast.Provider>
            </ThemeProvider>
          </body>
        </html>
      </ConvexClientProvider>
    </ConvexAuthNextjsServerProvider>
  );
}
