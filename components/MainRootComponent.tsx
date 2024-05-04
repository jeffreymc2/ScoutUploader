"use client";
import { usePathname } from "next/navigation";
import React from "react";

export default function MainRootComponent({
  children,
}: {
  children: React.ReactNode;
}) {
  const playerId = "";
  const pathname = usePathname();

  const mainBgClass =
    pathname.startsWith("/players") ||
    pathname.startsWith("/events") ||
    pathname.startsWith("/profile")
      ? "bg-gray-100"
      : "";

  const bgVideo =
  pathname.startsWith("/players") ||
  pathname.startsWith("/events") ||
  pathname.startsWith("/profile") || 
  pathname.startsWith("/diamondkast") 
      ? "max-w-6xl"
      : "";

  return (
    <main className={`space-y-5 px-2 xl:px-0 flex-grow ${mainBgClass}`}>
      <div className={`${bgVideo} w-full mx-auto`}>{children}</div>
    </main>
  );
}
