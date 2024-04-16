// app/layout.tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import Navbar from "@/components/UtilityComponents/Navbar";
import { Toaster } from "@/components/ui/sonner";
import localFont from "next/font/local";
import Footer from "@/components/Footer";
import { usePathname } from "next/navigation";
import MainRootComponent from "@/components/MainRootComponent";

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
      <body
        className={`${inter.className} overflow-y-scroll flex flex-col min-h-screen`}
      >
        <QueryProvider>
          <ThemeProvider
            attribute="class"
            enableSystem
            disableTransitionOnChange
          >
            <div className="w-full relative mx-auto xl:px-0">
              <Navbar />
            </div>
          </ThemeProvider>
          <MainRootComponent>{children}</MainRootComponent>
          <Footer />
          <Toaster />
        </QueryProvider>
      </body>
    </html>
  );
}
