import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";

import FirebaseProvider from "@/providers/firebase";
import CurrencyProvider from "@/providers/currency";

import Header from "@/components/layout/header";

import "./globals.css";
import TransactionsProvider from "@/providers/transactions";
import { cn } from "@/lib/utils";
import { checkUserToken } from "./actions/checkUserToken";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const runtime = "nodejs";

export const metadata: Metadata = {
  title: "Finanças",
  description: "Controle e visualização das suas finanças",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/logo.svg",
    apple: "/logo.svg",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Finanças",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const result = await checkUserToken();

  return (
    <html lang="en" className={cn("font-sans", inter.variable)}>
      <body className={inter.className}>
        <div className="bg-neutral-200 min-h-screen h-full pb-4 overflow-hidden">
          <FirebaseProvider>
            {result.valid ? (
              <TransactionsProvider>
                <CurrencyProvider>
                  <ToastContainer />
                  <Header />

                  {children}
                </CurrencyProvider>
              </TransactionsProvider>
            ) : (
              children
            )}
          </FirebaseProvider>
        </div>
      </body>
    </html>
  );
}
