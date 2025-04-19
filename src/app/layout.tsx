import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toast } from "@base-ui-components/react/toast";
import "./globals.css";
import Nav from "./components/nav/nav";
import Footer from "./components/footer/footer";

import { toastManager } from "@/lib/toast";
import ToastList from "./components/toast-list/toast-list";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Home | Pollster.fm",
  description: "A poll-based music social platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable}`}>
        <Toast.Provider toastManager={toastManager}>
          <Nav />
          {children}
          <Footer />
          <Toast.Viewport className="toast-viewport">
            <ToastList />
          </Toast.Viewport>
        </Toast.Provider>
      </body>
    </html>
  );
}
