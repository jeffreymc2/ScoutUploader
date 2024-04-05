"use client";
import { usePathname } from "next/navigation";
import React from "react";


export default function MainRootComponent({ children }: { children: React.ReactNode }) {

const playerId = "";  
const pathname = usePathname();
const mainBgClass = pathname.startsWith('/players') ? 'bg-gray-100' : '';

return (
    <main className={`space-y-10 px-5 xl:px-0 flex-grow ${mainBgClass}`}>
              {/* Optionally, apply a background color or other full-width styles here */}
              <div className="max-w-6xl mx-auto ">
                {/* Centered container with max width */}
                {children}
                {/* This will be the content passed to the Layout component */}
              </div>
            </main>
);

}