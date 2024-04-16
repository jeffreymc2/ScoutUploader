import React from "react";
import Link from "next/link";
import { FaBaseball } from "react-icons/fa6";
import { Card, CardContent } from "../ui/card";
import BackgroundImage from "./BackgroundImage";

export default function LandingPage() {
  return (
    <>
      <div className="flex flex-col ">
        <section className="w-full pt-12">
          <div className="container space-y-10 xl:space-y-16">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-5xl font-bold tracking-loose font-pgFont text-gray-100 sm:text-6xl md:text-6xl lg:text-6xl">
                  Perfect Game Media
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-100 md:text-xl pb-5 sm:font-light text-lg font-light">
                  Search and upload media by players, events, and more.
                </p>
              </div>
            </div>
          </div>
        </section>
        <main className="flex flex-col items-center justify-center py-2 mb-5">
          <div className="flex flex-col md:flex-row justify-center space-y-4 md:space-y-0 md:space-x-6">
            <Card className="w-full md:w-1/2 lg:w-1/3 shadow-lg py-10 px-10">
              <CardContent className="flex flex-col items-center h-full">
                <div className="flex items-center justify-center">
                  <UsersIcon className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-center text-gray-600">
                  Search & Upload Media Content by Players
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600 flex-grow">
                  Search by player name or id find and upload media content by
                  players.
                </p>
                <div className="mt-6">
                  <Link
                    className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                    href="/players"
                  >
                    Search Players
                  </Link>
                </div>
              </CardContent>
            </Card>
            <Card className="w-full md:w-1/2 lg:w-1/3 shadow-lg py-10 px-10">
              <CardContent className="flex flex-col items-center h-full">
                <div className="flex items-center justify-center">
                  <FaBaseball className="w-12 h-12 text-blue-500" />
                </div>
                <h2 className="mt-4 text-lg font-semibold text-center text-gray-600">
                  Search & Upload Media Content by Events
                </h2>
                <p className="mt-2 text-sm text-center text-gray-600 flex-grow">
                  Search by event name or id to find and upload media content by
                  events. Once uploaded, tag media to players.
                </p>
                <div className="mt-6">
                  <Link
                    className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800"
                    href="/events"
                  >
                    Search Events
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </>
  );
}
function CalendarIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function UsersIcon(
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
