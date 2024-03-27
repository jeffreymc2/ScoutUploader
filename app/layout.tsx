//app/layout.tsx

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import QueryProvider from "@/components/query-provider";
import Navbar from "@/components/Navbar";
import { Toaster } from "@/components/ui/sonner";
import localFont from 'next/font/local'



const inter = Inter({ subsets: ["latin"], display: "swap" });

const pgFont = localFont({ src: './UnitedSansSmCdBd.woff2' });

export const metadata: Metadata = {
  title: "Perfect Game Rewards Dashboard",
  description:
    "PG Rewards is a loyalty program that rewards customers for their participation in Perfect Game events.",
};



export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning className={pgFont.className}>
			<body className={inter.className}>

				<QueryProvider>
					<ThemeProvider
						attribute="class"
						// defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						<main className="max-w-6xl min-h-screen mx-auto py-10 space-y-10 px-5 xl:px-0">
							<Navbar />
							{children}
						</main>
						<Toaster />
					</ThemeProvider>
				</QueryProvider>

			</body>
		</html>
	);
}
