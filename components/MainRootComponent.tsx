"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function MainRootComponent({ children }: { children: React.ReactNode }) {
  const playerId = "";
  const pathname = usePathname();
  
  const mainBgClass = pathname.startsWith("/players") ||
                      pathname.startsWith("/events") ||
                      pathname.startsWith("/profile")
    ? "bg-gray-100"
    : "";

  return (
    <main className={`space-y-5 px-2 xl:px-0 flex-grow ${mainBgClass}`}>
      <div className="max-w-6xl mx-auto">{children}</div>
    </main>
  );
}