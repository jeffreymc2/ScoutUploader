import React from "react"
import Link from "next/link"
import { FaBaseball } from "react-icons/fa6"
import { Card, CardContent } from "./ui/card"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <section className="w-full pt-12 ">
        <div className="container space-y-10 xl:space-y-16">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter font-pgFont text-gray-700 sm:text-4xl md:text-5xl lg:text-6xl/none">
                Perfect Game Media Uploader
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-lg ">
                Search and upload media by players, events, and more.
              </p>
            </div>
          </div>
          
        </div>
      </section>
      <main className="flex flex-col items-center justify-center py-2">
        <div className="flex flex-wrap justify-center space-x-4 md:space-x-6">

        <Card className=" shadow-lg">
        <CardContent>

            <div className="flex items-center justify-center">
              <UsersIcon className="w-12 h-12 text-gray-700 " />
            </div>
            <h2 className="mt-2 text-lg font-semibold text-center text-gray-700 ">
            Search & Upload by Players
            </h2>
            <p className="mt-2 text-sm text-center text-gray-500 ">
              Search by player name or id find and upload media content by players.
            </p>
            <div className="mt-4 flex justify-center">
              <Link
                className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90 "
                href="/players"
              >
                Search Players
              </Link>
            </div>
          </CardContent>
          </Card>
          <Card className=" shadow-lg">
        <CardContent>
            <div className="flex items-center justify-center">
              <FaBaseball className="w-12 h-12 text-gray-700 " />
            </div>
            <h2 className="mt-2 text-lg font-semibold text-center text-gray-700 ">
              Search and Upload by Events
            </h2>
            <p className="mt-2 text-sm text-center text-gray-500 ">
            Search by event name or id to find and upload media content by events. Once uploaded, tag media to players.
            </p>
            <div className="mt-4 flex justify-center">
              <Link
                className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-primary/90 "
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
  )
}

function CalendarIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
  )
}


function UsersIcon(props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>) {
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
  )
}
