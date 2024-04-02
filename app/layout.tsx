// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import { supabaseServer } from "@/lib/supabase/server"; 



const inter = Inter({ subsets: ["latin"], display: "swap" });
const pgFont = localFont({ src: "./UnitedSansSmCdBd.woff2" });

export const metadata: Metadata = {
  title: "Perfect Game Scout Uploader",
  description: "PG Scouts can upload player images and videos.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={pgFont.className}>
      <body className={`${inter.className} overflow-y-scroll`}>
        <QueryProvider>
          <ThemeProvider attribute="class" enableSystem disableTransitionOnChange>
            <div className="w-full relative mx-auto xl:px-0">
              <Navbar />
            </div>
            <main className="pt-5 pb-5 space-y-10 px-5 xl:px-0 bg-white">
              {/* Optionally, apply a background color or other full-width styles here */}
              <div className="max-w-6xl mx-auto">
                {/* Centered container with max width */}
                {children}
                {/* This will be the content passed to the Layout component */}
              </div>
            </main>
            <Toaster />
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}