import { Toast } from "@base-ui-components/react/toast";
import type { Metadata } from "next";
import { Lexend } from "next/font/google";
import { siteName } from "../config";
import { toastManager } from "../lib/toast";
import Nav from "./components/nav/nav";
import { ThemeProvider } from "./components/theme-provider";

import Footer from "./components/footer/footer";
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
