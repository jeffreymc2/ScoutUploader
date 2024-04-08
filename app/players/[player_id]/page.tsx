//app/players/%5Bplayer_id%5D/page.tsx

import { supabaseServer } from "@/lib/supabase/server";
import Image from "next/image";
import Uploader from "@/components/Uploader";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import DeletePost from "@/components/DeletePost";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackButton from "@/components/BackButton";
import { RiVideoUploadLine } from "react-icons/ri";
import { RiDeleteBin5Line } from "react-icons/ri";
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
import { Label } from "@/components/ui/label";
import MediaRenderer from "@/components/MediaRenderer";
import { Suspense } from "react";
import { Player } from "@/lib/types/types";
// import DiamondKastVideo from "@/components/DiamondKastVideo";

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
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/events/${post.post_by}/${post.event_id}/${post.team_id}/${post.name}`
        : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/media/players/${post.post_by}/${post.player_id}/${post.name}`,
      isVideo: isVideoFile(post.name),
    })),
    players: [],
    eventId: "",
  };

  const url = new URL(
    `https://dk.perfectgame.org/players/${playerData.PlayerID}?ms=638479303817445795&sk=5p030Qdbe1E=&hst=`
  );

  return (
    <div className="container mx-auto p-4 ">
      <BackButton />

      <Card className="mt-2">
        <CardContent className="p-0 bg-gradient-to-b from-gray-100 to-white">
          <div className="flex flex-col items-center justify-center space-y-4 md:flex-row md:space-y-0 md:space-x-8 p-0">
            <Avatar className="w-80 h-80 mt-5 md:mt-0 md:w-80 md:h-80 rounded-sm">
              <AvatarImage
                src={playerData.ProfilePic ?? ""}
                alt="Player Avatar"
                className="rounded-sm object-cover object-center w-full h-full"
              />
              <AvatarFallback>
                {playerData.PlayerName.slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center md:text-left ">
              <h2 className="text-4xl font-pgFont md:text-6xl font-bold">
                {playerData?.PlayerName || "N/A"}
              </h2>
              <p className="text-md text-gray-500">
                Player ID: {playerData?.PlayerID || "N/A"}
              </p>
              <p className="text-md text-gray-500">
                Grad Year: {playerData?.GradYear || "N/A"} | Age:{" "}
                {playerData?.Age || "N/A"}
              </p>
              <div className="mt-4 mb-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                      <RiVideoUploadLine className="h-6 w-6 mr-2" /> Upload
                      Media Content
                    </Button>
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
        </CardContent>
      </Card>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="bg-gradient-to-b from-gray-100 to-white">
            <CardTitle className="font-pgFont text-4xl">
              Player Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Height</Label>
                <p className="text-lg">{playerData?.Height || "N/A"}</p>
              </div>
              <div>
                <Label>Weight</Label>
                <p className="text-lg">{playerData?.Weight || "N/A"} lbs</p>
              </div>
              <div>
                <Label>City</Label>
                <p className="text-lg">{playerData?.CityState || "N/A"}</p>
              </div>
              <div>
                <Label>College Commitment</Label>
                <p className="text-lg">{playerData?.Commitment || "N/A"}</p>
              </div>
              <div>
                <Label>High School</Label>
                <p className="text-lg">{playerData.HighSchool}</p>
              </div>
              <div>
                <Label>National Pos Rank</Label>
                <p className="text-lg">
                  {playerData?.NationalPosRank || "N/A"}
                </p>
              </div>
              <div>
                <Label>State Pos Rank</Label>
                <p className="text-lg">{playerData?.StatePosRank || "N/A"}</p>
              </div>
              <div>
                <Label>National Rank</Label>
                <p className="text-lg">{playerData?.NationalRank || "N/A"}</p>
              </div>
              <div>
                <Label>State Rank</Label>
                <p className="text-lg">{playerData?.StateRank || "N/A"}</p>
              </div>
              <div>
                <Label>Bats/Throws</Label>
                <p className="text-lg">{playerData?.BatsThrows || "N/A"}</p>
              </div>
              <div>
                <Label>Primary Position</Label>
                <p className="text-lg">{playerData?.PrimaryPos || "N/A"}</p>
              </div>
              <div>
                <Label>Best PG Grade</Label>
                <p className="text-lg">{playerData?.bestPGGrade || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="bg-gradient-to-b from-gray-100 to-whit1">
            <CardTitle className="font-pgFont text-4xl">
              Additional Info
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label>Notes</Label>
                <p className="text-md">{playerData?.Note || "N/A"}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="min-h-[500px] xs:min-w-[300px] sm:min-w-[400px] md:min-w-[500px] lg:min-w-[600px] mt-4 rounded-md">
        <CardHeader className="mb-0 py-5 px-5 bg-gradient-to-b from-gray-100 to-white rounded-t-md">
          <div className="flex ">
            {" "}
            {/* Center the image within the card header */}
            <Image
              src="https://avkhdvyjcweghosyfiiw.supabase.co/storage/v1/object/public/misc/dkPlus_horizontal_primary%20(3).png"
              alt="DiamondKast Logo"
              width={300} // These values should be the maximum width and height you want the image to have
              height={500} // The image will scale down on smaller screens because of the following CSS class
              className="object-cover object-center mb-2 max-w-full h-auto" // Make image responsive
            />
          </div>
        </CardHeader>
        <CardContent className="mt-5 rounded-b-md">
          <iframe
            src={url.toString()}
            style={{ minHeight: "450px" }} // Inline styles to ensure minimum height is respected
            className="w-full h-auto" // Width is full and height is auto to maintain aspect ratio
            id="ContentTopLevel_ContentPlaceHolder1_ifDesktop"
            allowFullScreen
            name="638479303817445795"
          />
        </CardContent>
      </Card>

      <Suspense fallback={<div>Loading...</div>}>
        <Card className="mt-4">
          <CardHeader className="bg-gradient-to-b from-gray-100 to-white">
            <CardTitle className="font-pgFont text-4xl">
              {`${playerData.PlayerName}'s`} Media Content
            </CardTitle>
            <div className="mt-4 mb-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="px-4 py-2 font-medium tracking-wide text-white transition-colors duration-200 transform bg-blue-500 rounded-md hover:bg-blue-800">
                    <RiVideoUploadLine className="h-6 w-6 mr-2" /> Upload Media
                    Content
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <Uploader
                    playerid={playerData.PlayerID}
                    FullName={playerData.PlayerName}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {playerSearchProps.posts?.map((post) => (
                <div key={post.id} className="relative">
                  <MediaRenderer file={post} />
                  <div className="absolute top-2 ">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <RiDeleteBin5Line className="w-6 h-6 text-gray-900 absolute top-[200px] left-[35px]" />
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete this file from our servers.
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
      </Suspense>
    </div>
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