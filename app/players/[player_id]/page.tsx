//app/players/%5Bplayer_id%5D/page.tsx

import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import Uploader from "@/components/Uploader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeletePost from "@/components/DeletePost";
import { Button } from "@/components/ui/button";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import BackButton from "@/components/BackButton";
import { RiDeleteBin5Line } from "react-icons/ri";
import { Loading } from "./loading";

import { Car } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import MediaRenderer from "@/components/MediaRenderer";
import { Suspense } from "react";
import { Player } from "@/lib/types/types";

interface PlayerData {
  PlayerID: number;
  PlayerName: string;
  GradYear: string;
  CityState: string;
  Height: string;
  Weight: number;
  BatsThrows: string;
  PrimaryPos: string;
  Commitment: string | null;
  BestRankSort: number | null;
  bestPGGrade: number | null;
  NationalRank: number | null;
  NationalPosRank: number | null;
  StateRank: number | null;
  StatePosRank: number | null;
  Note: string | null;
  HighSchool: string;
  LastTeamPlayedFor: string | null;
  Age: string;
  ProfilePic: string | null;
}

interface Post {
  id: string;
  created_at: string;
  player_id: string | null;
  name: string;
  object_id: string;
  post_by: string;
  profile: {
    display_name: string | null;
  } | null;
  image: string;
  event_id?: string;
  team_id?: string;
  isVideo?: boolean;
}

interface PlayerSearchProps {
  posts: Post[] | null;
  players: Player[];
  eventId?: string;
}

export default async function PlayerPage({
  params,
}: {
  params: { player_id: string };
}) {
  const player_id = params.player_id;
  const supabase = supabaseServer();

  const response = await fetch(
    process.env.NEXT_PUBLIC_URL + `/api/players?playerID=${player_id}`
  );
  const playerData: PlayerData = await response.json();

  // Fetch posts (image references) related to the player from the "posts" table
  // Fetch posts (image references) related to the player from the "posts" table
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("*")
    .eq("player_id", playerData.PlayerID)
    .order("created_at", { ascending: false });

  if (postsError) {
    console.error("Error fetching images:", postsError);
    return <div>Error fetching images</div>;
  }

  const playerSearchProps: PlayerSearchProps = {
    posts: posts.map((post) => ({
      ...post,
      profile: null,
      image: post.event_id
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${post.post_by}/${post.player_id}/${post.name}`,
      isVideo: isVideoFile(post.name),
    })),
    players: [],
    eventId: "",
  };

  return (
    <>
      <span>
        <BackButton />
      </span>

      <div className="flex flex-col lg:flex-row">
        <div className="w-full p-5 bg-white rounded-lg shadow-md">
          <div className="flex flex-col lg:flex-row items-center lg:space-x-4">
            <Avatar className="w-60 h-60 rounded-lg">
              <Image
                alt="Player Avatar"
                src={playerData.ProfilePic ?? ""}
                fill={true}
                style={{
                  objectFit: "cover",
                }}
              />
              <AvatarFallback>JP</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-1">
              <h2 className="text-5xl font-pgFont font-bold">
                {playerData?.PlayerName || "N/A"}
              </h2>
              <p className="text-md text-gray-500 ">
                Player ID:{playerData?.PlayerID || "N/A"}
              </p>
              <p className="text-md text-gray-500 ">
                Grad Year:{playerData?.GradYear || "N/A"} | Age:{" "}
                {playerData?.Age || "N/A"}
              </p>
              <div className="space-y-4 pt-5">
                <Dialog>
                  <DialogTrigger>
                    <Button>Upload More Files</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <Uploader
                      playerid={playerData.PlayerID}
                      FullName={playerData.PlayerName}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-light">Height</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Height || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Weight</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Weight || "N/A"} lbs
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">City</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.CityState || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-light">College Commitment</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Commitment || "N/A"}{" "}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Highschool</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData.HighSchool}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">National Pos Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.NationalPosRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">State Pos Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.StatePosRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">National Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.NationalRank || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">State Rank</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.StateRank || "N/A"}
              </p>
            </div>

            <div className="space-y-1">
              <p className="text-sm font-light">Bats/Throws</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.BatsThrows || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Primary Position</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.PrimaryPos || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Best PG Grade</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.bestPGGrade || "N/A"}
              </p>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm font-light">Best Rank Sort</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.BestRankSort || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-light">Notes</p>
              <p className="text-2xl font-bold font-pgFont text-gray-500 ">
                {playerData?.Note || "N/A"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
          <Card className="mt-5 shadow-lg border border-gray-100 min-h-96">
            <CardHeader>
              <CardTitle className="font-pgFont">{`Photo and Video Uploads of ${playerData.PlayerName}`}</CardTitle>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {playerSearchProps.posts?.map((post) => (
                  
                  <div key={post.id} className="relative">
                            <Suspense fallback={<Loading />}>

                    <MediaRenderer file={post} />
                    </Suspense>

                    <div className="absolute top-2 right-2">
                      <AlertDialog>
                        <AlertDialogTrigger>
                          {" "}
                          <RiDeleteBin5Line />
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this file from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <DeletePost
                              post_by={post.post_by}
                              image={post.image}
                              event_id={post.event_id || ""} 
                            />
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
}
// Helper function to determine if a file is a video based on its extension
function isVideoFile(fileName: string) {
  const videoExtensions = [
    ".mp4",
    ".webm",
    ".ogg",
    ".mov",
    ".avi",
    ".flv",
    ".wmv",
  ];
  return videoExtensions.some((extension) =>
    fileName.toLowerCase().endsWith(extension)
  );
}
