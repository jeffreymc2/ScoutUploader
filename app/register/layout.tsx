// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import BackgroundImage from "@/components/UtilityComponents/BackgroundImage";


const inter = Inter({ subsets: ["latin"], display: "swap" });
const pgFont = localFont({ src: "../UnitedSansSmCdBd.woff2" });


export const metadata: Metadata = {
  title: "Perfect Game Scout Uploader",
  description: "PG Scouts can upload player images and videos.",
};


export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <BackgroundImage />

      {/* Optionally, apply a background color or other full-width styles here */}
      <div className="max-w-6xl mx-auto ">
        {/* Centered container with max width */}
        {children}
        {/* This will be the content passed to the Layout component */}
      </div>
    </>
  );
}