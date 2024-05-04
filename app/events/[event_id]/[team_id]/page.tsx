import { supabaseServer } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { Team, Post, Player, EventSearch, MediaFile } from "@/lib/types/types";
import EventTeamGallery from "@/components/EventComponents/EventTeamGallery";
import EventSkeletonLoader from "@/components/EventComponents/EventTeanSkeleton";
import Link from "next/link";
import Image from "next/image";
import {
  BaselineIcon,
  CalendarIcon,
  MapPinIcon,
  PlayIcon,
} from "@/components/ui/event-icons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  CalendarCheckIcon,
  LocateIcon,
  TagIcon,
  TrophyIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { RiVideoUploadLine } from "react-icons/ri";
import UploaderEvents from "@/components/UploaderEvents";

import RosterTable from "@/app/events/[event_id]/[team_id]/components/RosterTableComponent";

interface EventTeamPageProps {
  params: {
    event_id: string;
    team_id: string;
  };
}

export default async function EventTeamPage({ params }: EventTeamPageProps) {
  const { event_id, team_id } = params;
  const supabase = supabaseServer();

  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("event_id", event_id)
    .eq("team_id", team_id)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching images:", postsError);
    return <div>Error fetching images</div>;
  }

  const typedPosts = posts as Post[];

  const playersResponse = await fetch(
    process.env.NEXT_PUBLIC_URL +
      `/api/teams?query=${encodeURIComponent(event_id)}`
  );

  if (!playersResponse.ok) {
    console.error("Error fetching teams:", await playersResponse.text());
    return <div>Error fetching teams</div>;
  }

  const eventResponse = await fetch(
    process.env.NEXT_PUBLIC_URL +
      `/api/getEvent?query=${encodeURIComponent(event_id)}`
  );

  if (!eventResponse.ok) {
    console.error("Error fetching event:", await eventResponse.text());
    return <div>Error fetching event</div>;
  }

  const event: EventSearch = await eventResponse.json();
  const teamsData: Team[] = await playersResponse.json();
  const team = teamsData.find(
    (team) => team.TournamentTeamID === parseInt(team_id)
  );

  const playersData: Player[] = team?.Roster || [];

  if (!team) {
    return <div>Team not found</div>;
  }

  const {
    TournamentTeamName,
    SeasonYear,
    City,
    State,
    Classification,
    Wins,
    Losses,
    Ties,
    CoachFirstName,
    CoachLastName,
    CoachEmail,
    CoachMobile,
    Roster,
  } = team;

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="container mx-auto px-4 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <Card className="rounded-lg shadow-lg bg-white">
              <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                <CardTitle className="text-sm font-bold">
                  Event Details
                </CardTitle>
              </div>
              <CardContent>
                <div className="flex flex-col md:flex-row items-center mb-4">
                  <div className="relative w-48 h-48 mb-4 md:mb-0 md:mr-4">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Image
                        alt="Event Logo"
                        src={event.EventLogoURL}
                        width={150}
                        height={150}
                        className="object-contain"
                      />
                    </div>
                  </div>
                  <h2 className="text-3xl md:text-5xl font-semibold font-pgFont text-gray-400 text-center md:text-left">
                    {event.EventName}
                  </h2>
                </div>
                <div className="flex flex-col md:flex-row items-center justify-center md:justify-start space-y-4 md:space-y-0 md:space-x-4">
                  <div className="flex items-center space-x-2">
                    <CalendarIcon className="text-muted-foreground h-6 w-6" />
                    <div className="text-sm">
                      <span className="font-semibold">Start Date: </span>
                      2/4/2024
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CalendarCheckIcon className="text-muted-foreground h-6 w-6" />
                    <div className="text-sm">
                      <span className="font-semibold">End Date: </span>
                      2/4/2024
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <LocateIcon className="text-muted-foreground h-6 w-6" />
                    <div className="text-sm">
                      <span className="font-semibold">Location: </span>
                      Colorado Springs, CO
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Suspense
              fallback={
                <Card className="mt-8 rounded-lg shadow-lg bg-white min-h-96">
                  <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                    <EventSkeletonLoader className="h-6 w-32" />
                  </div>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {Array.from({ length: 8 }).map((_, index) => (
                        <EventSkeletonLoader
                          key={index}
                          className="h-48 w-full rounded-lg"
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              }
            >
              <Card className="mt-4 rounded-lg shadow-lg bg-white sm:min-h-screen min-h-[200px]">
                <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4 flex items-center justify-between">
                  <CardTitle className="text-sm font-bold">
                    Media Gallery
                  </CardTitle>
                  <Dialog>
                    <DialogTrigger className="text-sm font-bold flex items-center space-x-1 ">
                      <RiVideoUploadLine className="h-5 w-5" />
                      <span>Upload Media</span>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <UploaderEvents
                          EventName={event.EventName}
                          EventID={event.EventID.toString()}
                          TeamID={team.TournamentTeamID.toString() || ""}
                        />
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>

                {typedPosts.length === 0 && (
                  <CardContent>
                    <EventTeamGallery
                      posts={typedPosts}
                      players={playersData}
                      eventId={event_id}
                      teamId={team_id}
                      image={""}
                    />
                  </CardContent>
                )}
                {typedPosts.length > 0 && (
                  <CardContent>
                    <p className="text-sm font-semibold text-gray-600">
                      No media found
                    </p>
                    <EventTeamGallery
                      posts={typedPosts}
                      players={playersData}
                      eventId={event_id}
                      teamId={team_id}
                      image={""}
                    />
                  </CardContent>
                )}
              </Card>
            </Suspense>
          </div>

          <div>
            <Card className="rounded-lg shadow-lg bg-white mb-4">
              <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                <CardTitle className="text-sm font-semibold">
                  Team Details
                </CardTitle>
              </div>
              <CardContent>
                <div className="flex items-center mb-4">
                  <h2 className="text-md font-bold text-gray-600 pt-2">
                    {TournamentTeamName}
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <CalendarIcon className="w-5 h-5 mr-2 text-blue-500" />
                    <p className="font-light text-sm">{SeasonYear}</p>
                  </div>
                  <div className="flex items-center">
                    <TagIcon className="w-5 h-5 mr-2 text-blue-500" />
                    {!Classification ? (
                      <p className="font-light text-sm">
                        <span className="font-light text-sm"></span> Not
                        Available
                      </p>
                    ) : (
                      <p className="font-light text-sm">
                        <span className="font-light text-sm"></span>{" "}
                        {Classification}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center">
                    <TrophyIcon className="w-5 h-5 mr-2 text-blue-500" />
                    <p className="font-light text-sm">
                      <span className="font-light text-sm">Record:</span> {Wins}
                      -{Losses}-{Ties}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="rounded-lg shadow-lg bg-white">
              <div className="bg-blue-500 text-white rounded-t-lg py-2 px-4">
                <CardTitle className="text-sm font-semibold">
                  Tournament Team Roster
                </CardTitle>
              </div>
              <CardContent>
                <RosterTable roster={Roster} />
              </CardContent>
            </Card>

            <Card className="rounded-lg shadow-lg bg-white mt-4">
              <div className="bg-blue-500 text-gray-100 rounded-t-lg py-2 px-4">
                <CardTitle className="text-sm font-bold">
                  Coach Information
                </CardTitle>
              </div>
              <CardContent className="mt-2">
                <div>
                  <p className="font-bold text-sm">Coach Name:</p>
                  <p className="font-light text-sm">
                    {CoachFirstName} {CoachLastName}
                  </p>
                </div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Email:</p>
                  <p className="font-light text-sm">{CoachEmail}</p>
                </div>
                <div className="mt-2">
                  <p className="font-bold text-sm">Mobile:</p>
                  <p className="font-light text-sm">{CoachMobile}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
