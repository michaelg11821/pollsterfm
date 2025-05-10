import { Toast } from "@base-ui-components/react/toast";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { siteName } from "../config";
import { toastManager } from "../lib/toast";
import Nav from "./components/nav/nav";
import { ThemeProvider } from "./components/theme-provider";

import ToastList from "./components/toast-list/toast-list";
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
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toast.Provider toastManager={toastManager}>
            <Nav />
            {children}
            <Toast.Viewport className="absolute w-full max-w-75 mt-0 mb-0 ml-auto mr-auto bottom-8 right-8 left-auto top-auto">
              <ToastList />
            </Toast.Viewport>
          </Toast.Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
